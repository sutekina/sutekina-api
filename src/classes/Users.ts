import User from "./User";
import SutekinaApi from "./SutekinaApi";
import logging from "../util/logging";
import {QueryOptions} from "../interfaces/QueryOptions";

export = class Users extends Array {
    constructor(...users: User[] | any[]) {
        super(users.length);

        users.forEach((user) => this.push(user));

        return this[1];
    }

    public static getList = ({country, limit, offset, order, ascending, modMode, hasPlayed, search}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query =   `SELECT u.id userId, u.name, u.country, u.priv privilege, u.clan_id clanId, u.creation_time creationTime, u.latest_activity latestActivity, s.playtime ` +
                            `playTime, s.tscore totalScore, s.rscore rankedScore, s.max_combo maxCombo, s.plays playCount, s.pp pp, s.acc accuracy, ` +
                            `(SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp > s.pp AND ss.mode = s.mode ` +
                            `AND uu.priv & 1) AS globalRank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) ` +
                            `WHERE ss.pp > s.pp AND ss.mode = s.mode AND uu.country = u.country AND uu.priv >= 1) ` +
                            `AS countryRank FROM stats s JOIN users u ON s.id = u.id WHERE u.priv >= 3 ${country ? `AND u.country = ?` : ""} ${search ? `AND u.name LIKE ? ESCAPE '\\\\'` : ""} ${hasPlayed ? `AND s.plays > 0` : ""} AND s.mode = ? ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"}, playCount ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?; `;

            const parameters = [modMode, offset, limit];

            if(search) parameters.unshift(search);
            if(country) parameters.unshift(country);

            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res, fields) => {
                if(err) return reject(err);
                resolve(new Users(res));
            });
        });
    }
    public static count = ({country, modMode, hasPlayed, search}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) as count FROM stats s JOIN users u ON s.id = u.id WHERE u.priv >= 3 ${country ? `AND u.country = ?` : ""} ${search ? `AND u.name LIKE ? ESCAPE '\\\\'` : ""} ${hasPlayed ? `AND s.plays > 0` : ""} AND s.mode = ?;`;
            const parameters: (string | number)[] = [modMode];

            if(search) parameters.unshift(search);
            if(country) parameters.unshift(country);

            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res: any[], fields) => {
                if(err) return reject(err);
                resolve(res[0].count);
            });
        });
    }
}