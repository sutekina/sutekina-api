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

    public static getAll = ({mod, mode, limit, offset, order, ascending}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT u.id, u.name, u.country, u.priv privilege, u.creation_time creationTime, s.playtime_${mod}_${mode} ` +
                `playtime, s.plays_${mod}_${mode} playcount, s.pp_${mod}_${mode} pp, s.acc_${mod}_${mode} accuracy, ` +
                `(SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp_${mod}_${mode} > s.pp_${mod}_${mode} ` +
                `AND uu.priv & 1) AS globalRank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) ` +
                `WHERE ss.pp_${mod}_${mode} > s.pp_${mod}_${mode} AND uu.country = u.country AND uu.priv >= 1) ` +
                `AS countryRank FROM stats s JOIN users u ON s.id = u.id WHERE u.priv >= 3 ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?;`;
            const parameters = [offset, limit];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res, fields) => {
                if(err) return reject(err);
                resolve(new Users(res));
            });
        });
    }
}