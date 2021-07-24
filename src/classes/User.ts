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

    public static find = (identifier: string, mod: string, mode: string, identifierType: "id" | "safe_name" = "id") => {
        return new Promise((resolve, reject) => {
            const query =   `SELECT u.id userId, u.name, u.country, u.priv privilege, u.clan_id clanId, u.creation_time creationTime, s.playtime_${mod}_${mode} ` +
                            `playTime, s.tscore_${mod}_${mode} totalScore, s.rscore_${mod}_${mode} rankedScore, s.max_combo_${mod}_${mode} maxCombo, s.plays_${mod}_${mode} playCount, s.pp_${mod}_${mode} pp, s.acc_${mod}_${mode} accuracy, ` +
                            `(SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp_${mod}_${mode} > s.pp_${mod}_${mode} ` +
                            `AND uu.priv & 1) AS globalRank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) ` +
                            `WHERE ss.pp_${mod}_${mode} > s.pp_${mod}_${mode} AND uu.country = u.country AND uu.priv >= 1) ` +
                            `AS countryRank FROM stats s JOIN users u ON s.id = u.id WHERE u.${identifierType} = ? AND u.priv >= 3 ORDER BY globalRank;`;

            const parameters = [identifier];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res, fields) => {
                if(err) return reject(err);

                let user: any = res;
                user = user[0] ? user[0] : user;

                if(!user.userId && identifierType !== "safe_name") user = await User.find(identifier, mod, mode, "safe_name");

                resolve(new User(user));
            });
        });
    }
}
