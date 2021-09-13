import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";
import SutekinaApi from "./SutekinaApi";

export = class User {
    public userId: number;
    public name: string;
    public country: string;
    public privilege: number;
    public playCount: number;
    public pp: number;
    public accuracy: number;
    public globalRank: number;
    public countryRank: number;
    public playTime: number;
    public creationTime: number;
    public totalScore: number;
    public rankedScore: number;
    public maxCombo: number;
    public clanId: number;

    constructor(user: User | any) {
        Object.assign(this, user);
    }

    public static get = (identifier: string, {mod, mode, modMode}: QueryOptions, identifierType: "id" | "safe_name" = "id") => {
        return new Promise((resolve, reject) => {
            logging.info(modMode);
            const query =   `SELECT u.id userId, u.name, u.country, u.priv privilege, u.clan_id clanId, u.creation_time creationTime, s.playtime ` +
                            `playTime, s.tscore totalScore, s.rscore rankedScore, s.max_combo maxCombo, s.plays playCount, s.pp pp, s.acc accuracy, ` +
                            `(SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp > s.pp AND ss.mode = s.mode ` +
                            `AND uu.priv & 1) AS globalRank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) ` +
                            `WHERE ss.pp > s.pp AND ss.mode = s.mode AND uu.country = u.country AND uu.priv >= 1) ` +
                            `AS countryRank FROM stats s JOIN users u ON s.id = u.id WHERE s.mode = ? AND u.${identifierType} = ? AND u.priv >= 3 ORDER BY globalRank;`;

            const parameters = [modMode, identifier];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res, fields) => {
                if(err) return reject(err);

                let user: any = res;
                user = user[0] ? user[0] : user;

                if(!user.userId && identifierType !== "safe_name") user = await User.get(identifier, {mod, mode, modMode}, "safe_name");

                resolve(new User(user));
            });
        });
    }
}
