import Clan from "./Clan";
import SutekinaApi from "./SutekinaApi";
import logging from "../util/logging";
import {QueryOptions} from "../interfaces/QueryOptions";

export = class Clans extends Array {
    constructor(...clans: Clan[] | any[]) {
        super(clans.length);

        clans.forEach((clan, i) => this[i] = clan);

        return this[0];
    }

    // counting members is kinda inefficient since it scales pretty bad but oh well.
    public static getList = ({limit, offset, order, ascending, search, modMode}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query =   `SELECT c.id clanId, c.name, c.tag, c.owner userId, c.created_at createdAt, ` +
                            `(SELECT COUNT(*) FROM users u WHERE priv >= 3 AND u.clan_id = c.id) members, ` +
                            `(SELECT SUM(s.pp) FROM users u JOIN stats s ON s.id = u.id AND mode = ? WHERE priv >= 3 AND u.clan_id = c.id) AS pp ` +
                            `FROM clans c ${search ? `WHERE concat(c.name, c.tag) LIKE ? ESCAPE '\\\\' ` : ""}` +
                            `ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?;`;

            const parameters: (string | number)[] = [offset, limit];
            if(search) parameters.unshift(search);
            parameters.unshift(modMode);
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res: any, fields) => {
                if(err) return reject(err);
                resolve(new Clans(res));
            });
        });
    }

    public static count = ({search}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) as count FROM clans c ${search ? `WHERE concat(c.name, c.tag) LIKE ? ESCAPE '\\\\'` : ""}`;

            const parameters = [];
            if(search) parameters[0] = search;

            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res: any[], fields) => {
                if(err) return reject(err);
                resolve(res[0].count);
            });
        });
    }
}