import SutekinaApi from "./SutekinaApi";
import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";

export = class Scores extends Array {
    constructor(...scores: object[] | any[]) {
        super(scores.length);

        scores.forEach((score) => this.push(score));

        return this[1];
    }

    public static getAll = (filter: "beatmap" | "user" | "all", filterId: string | null, options: QueryOptions, idType: "id" | "safe_name" = "id") => {
        return new Promise((resolve, reject) => {
            // shitty code.
            // for best plays just set s.status = 2;
            // ${(options.distinct ? `NOT EXISTS (SELECT * FROM scores_${options.mod} uwu WHERE uwu.userId = 3 AND ` +
            //                 `s.map_md5 = uwu.map_md5 AND s.pp < uwu.pp) AND ` : "")}
            const query =   `SELECT s.id scoreId, m.id beatmapId, m.set_id beatmapSetId, score, pp, acc accuracy, s.max_combo maxCombo, ` +
                            `mods, n300 hits300, n100 hits100, n50 hits50, nmiss hitsMiss, grade, s.status, ` +
                            `s.mode, play_time playtime, time_elapsed timeElapsed, client_flags clientFlags, userid userId, perfect ` +
                            `FROM osu.scores_${options.mod} s JOIN osu.maps m ON s.map_md5 = m.md5 JOIN osu.users u ON s.userid = u.id ` +
                            `WHERE ${filterQueryBuilder(filter, idType)} s.mode = ? AND s.status >= ? AND m.status >= ? AND u.priv >= 3 ` +
                            `ORDER BY ${options.order} ${(options.ascending) ? "ASC" : "DESC"} LIMIT ?, ?;`;

            const parameters = [options.modeNumber, options.scoreStatus, options.beatmapStatus, options.offset, options.limit];
            if(filter !== "all") parameters.unshift(filterId);

            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters})
            SutekinaApi.mysql.execute(query, parameters, async (err, res, fields) => {
                if(err) return reject(err);
                let scores: any = res;
                if(!scores[0] && filter === "user" && idType !== "safe_name") scores = await Scores.getAll(filter, filterId, options, "safe_name");
                resolve(new Scores(scores));
            });
        });
    };
}

const filterQueryBuilder = (filter: string, idType: string): string => {
    switch(filter) {
        case "beatmap":
            return "m.id = ? AND";
        case "user":
            return `u.${idType} = ? AND`;
        default:
            return "";
    }
}

// ${(filterId) ? "userid = ? AND" : ""}