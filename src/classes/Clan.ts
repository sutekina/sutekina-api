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
    // TODO i added more clan properties add them here
    constructor(clan: Clan | any) {
        Object.assign(this, clan);
    }

    public static getMembers(identifier: string, {limit, offset, order, ascending, modMode}: QueryOptions) {
        return new Promise((resolve, reject) => {
            const query =   `SELECT u.id userId, u.name, u.country, u.priv privilege, u.clan_id clanId, u.creation_time creationTime, s.playtime ` +
                            `playTime, s.tscore totalScore, s.rscore rankedScore, s.max_combo maxCombo, s.plays playCount, s.pp pp, s.acc accuracy, ` +
                            `(SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp > s.pp AND ss.mode = s.mode ` +
                            `AND uu.priv & 1) AS globalRank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) ` +
                            `WHERE ss.pp > s.pp AND ss.mode = s.mode AND uu.country = u.country AND uu.priv >= 1) ` +
                            `AS countryRank FROM stats s JOIN users u ON s.id = u.id WHERE u.priv >= 3 AND s.mode = ? AND u.clan_id = ? AND u.clan_id != 0 ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?; `;

            const parameters = [modMode, identifier, offset, limit];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res: any, fields) => {
                if(err) return reject(err);
                resolve(new Users(res));
            });
        });
    };

    public static get(identifier: string, {modMode}: QueryOptions) {
        return new Promise((resolve, reject) => {
            const query = `SELECT c.id clanId, c.name, c.tag, c.owner userId, c.created_at createdAt, (SELECT COUNT(*) FROM users u WHERE priv >= 3 AND u.clan_id = c.id) members, (SELECT SUM(s.pp) FROM users u JOIN stats s ON s.id = u.id AND mode = ? WHERE priv >= 3 AND u.clan_id = c.id) AS pp FROM clans c WHERE c.id = ?;`;
            const parameters = [modMode, identifier];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res: any, fields) => {
                if(err) return reject(err);
                resolve(new Clan(res[0]));
            });
        });
    }
}