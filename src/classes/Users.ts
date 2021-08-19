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

    public static getAll = ({mod, country, mode, limit, offset, order, ascending, modMode}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query =   `SELECT u.id userId, u.name, u.country, u.priv privilege, u.clan_id clanId, u.creation_time creationTime, s.playtime ` +
                            `playTime, s.tscore totalScore, s.rscore rankedScore, s.max_combo maxCombo, s.plays playCount, s.pp pp, s.acc accuracy, ` +
                            `(SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp > s.pp AND ss.mode = s.mode ` +
                            `AND uu.priv & 1) AS globalRank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) ` +
                            `WHERE ss.pp > s.pp AND ss.mode = s.mode AND uu.country = u.country AND uu.priv >= 1) ` +
                            `AS countryRank FROM stats s JOIN users u ON s.id = u.id WHERE u.priv >= 3 ${country ? `AND u.country = ?` : ""} AND s.mode = ${modMode} ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?; `;

            const parameters = [offset, limit];
            if(country) parameters.unshift(country);
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res, fields) => {
                if(err) return reject(err);
                resolve(new Users(res));
            });
        });
    }
}