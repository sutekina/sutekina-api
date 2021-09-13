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

    public static getList = ({limit, offset, order, ascending}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT c.id clanId, c.name, c.tag, c.owner userId, c.created_at createdAt, (SELECT COUNT(*) FROM users u WHERE priv >= 3 AND u.clan_id = c.id) members FROM osu.clans c ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?;`;
            const parameters = [offset, limit];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res: any, fields) => {
                if(err) return reject(err);
                resolve(new Clans(res));
            });
        });
    }
}