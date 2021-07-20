import SutekinaApi from "./SutekinaApi";
import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";

export = class Scores extends Array {
    constructor(...scores: object[] | any[]) {
        super(scores.length);

        scores.forEach((score) => this.push(score));

        return this[1];
    }

    public static getAll = (filter: "beatmap" | "user" | "all", filterId: string | null, {mod, modeNumber, order, ascending, limit, offset, scoreStatus, beatmapStatus}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query =   `SELECT s.id scoreId, m.id beatmapId, m.set_id beatmapsetId, score, pp, acc accuracy, s.max_combo maxCombo, ` +
                            `mods, n300 hits300, n100 hits100, n50 hits50, nmiss hitsMiss, grade, s.status, ` +
                            `s.mode, play_time playtime, time_elapsed timeElapsed, client_flags clientFlags, userid userId, perfect ` +
                            `FROM osu.scores_${mod} s JOIN osu.maps m ON s.map_md5 = m.md5 JOIN osu.users u ON s.userid = u.id ` +
                            `WHERE ${filterQueryBuilder(filter)} s.mode = ? AND s.status >= ? AND m.status >= ? AND u.priv >= 3 ` +
                            `ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?;`;

            const parameters = [modeNumber, scoreStatus, beatmapStatus, offset, limit];
            if(filter !== "all") parameters.unshift(filterId);

            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters})
            SutekinaApi.mysql.execute(query, parameters, (err, res, fields) => {
                if(err) return reject(err);
                resolve(new Scores(res));
            });
        });
    };
}

const filterQueryBuilder = (filter: string): string => {
    switch(filter) {
        case "beatmap":
            return "m.id = ? AND";
        case "user":
            return "u.safe_name = ? AND";
        default:
            return "";
    }
}

// ${(filterId) ? "userid = ? AND" : ""}