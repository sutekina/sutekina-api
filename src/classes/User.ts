import logging from "../util/logging";
import SutekinaApi from "./SutekinaApi";

export = class User {
    public id: number;
    public name: string;
    public country: string;
    public privilege: number;
    public playcount: number;
    public pp: number;
    public accuracy: number;
    public globalRank: number;
    public countryRank: number;
    public playtime: number;
    public creationTime: number;

    constructor(user: User | any) {
        Object.assign(this, user[0] ? user[0] : user);
    }

    public static find = (identifier: string, mod: string, mode: string) => {
        return new Promise((resolve, reject) => {
            const query =   `SELECT u.id, u.name, u.country, u.priv privilege, u.creation_time creationTime, s.playtime_${mod}_${mode} ` +
                            `playtime, s.plays_${mod}_${mode} playcount, s.pp_${mod}_${mode} pp, s.acc_${mod}_${mode} accuracy, ` +
                            `(SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp_${mod}_${mode} > s.pp_${mod}_${mode} ` +
                            `AND uu.priv & 1) AS globalRank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) ` +
                            `WHERE ss.pp_${mod}_${mode} > s.pp_${mod}_${mode} AND uu.country = u.country AND uu.priv >= 1) ` +
                            `AS countryRank FROM stats s JOIN users u ON s.id = u.id WHERE safe_name = ? AND u.priv >= 3 ORDER BY globalRank;`;

            const parameters = [identifier];

            logging.verbose(query, {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res, fields) => {
                if(err) return reject(err);
                resolve(new User(res));
            });
        });
    }
}

// export type mod = "vn" | "ap" | "rx";
// export type mode = "std" | "taiko" | "catch" | "mania";