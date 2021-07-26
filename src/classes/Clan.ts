import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";
import SutekinaApi from "./SutekinaApi";
import Users from "./Users";

export = class Clan {
    public clanId: number;
    public name: string;
    public tag: string;
    public userId: number;
    public createdAt: string;
    public members: number;

    constructor(clan: Clan | any) {
        Object.assign(this, clan);
    }

    public static findMembers(identifier: string, {mod, mode, limit, offset, order, ascending}: QueryOptions) {
        return new Promise((resolve, reject) => {
            const query = `SELECT u.id userId, u.name, u.country, u.priv privilege, u.clan_id clanId, u.creation_time creationTime, s.playtime_${mod}_${mode} ` +
            `playTime, s.tscore_${mod}_${mode} totalScore, s.rscore_${mod}_${mode} rankedScore, s.max_combo_${mod}_${mode} maxCombo, s.plays_${mod}_${mode} playCount, s.pp_${mod}_${mode} pp, s.acc_${mod}_${mode} accuracy, ` +
            `(SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp_${mod}_${mode} > s.pp_${mod}_${mode} ` +
            `AND uu.priv & 1) AS globalRank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) ` +
            `WHERE ss.pp_${mod}_${mode} > s.pp_${mod}_${mode} AND uu.country = u.country AND uu.priv >= 1) ` +
            `AS countryRank FROM stats s JOIN users u ON s.id = u.id WHERE u.priv >= 3 AND u.clan_id = ? AND u.clan_id != 0 ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?; `;
            const parameters = [identifier, offset, limit];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res: any, fields) => {
                if(err) return reject(err);
                resolve(new Users(res));
            });
        });
    };

    public static find(identifier: string) {
        return new Promise((resolve, reject) => {
            const query = `SELECT c.id clanId, c.name, c.tag, c.owner userId, c.created_at createdAt, (SELECT COUNT(*) FROM users u WHERE priv >= 3 AND u.clan_id = c.id) members FROM osu.clans c WHERE c.id = ?;`;
            const parameters = [identifier];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res: any, fields) => {
                if(err) return reject(err);
                resolve(new Clan(res[0]));
            });
        });
    }
}