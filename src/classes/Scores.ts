import SutekinaApi from "./SutekinaApi";
import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";

export = class Scores extends Array {
    constructor(...scores: object[] | any[]) {
        super(scores.length);

        scores.forEach((score) => this.push(score));

        return this[1];
    }

    public static getList = (filter: scoreFilter, options: QueryOptions, idType: "id" | "safe_name" = "id") => {
        return new Promise((resolve, reject) => {
            // shitty code.
            // for best plays just set s.status = 2;
            // ${(options.distinct ? `NOT EXISTS (SELECT * FROM scores_${options.mod} uwu WHERE uwu.userId = 3 AND ` +
            //                 `s.map_md5 = uwu.map_md5 AND s.pp < uwu.pp) AND ` : "")}
            // const query =   `SELECT s.id scoreId, m.id beatmapId, m.set_id beatmapSetId, score, pp, acc accuracy, s.max_combo maxCombo, ` +
            //                 `mods, n300 hits300, n100 hits100, n50 hits50, nmiss hitsMiss, grade, s.status, ` +
            //                 `s.mode, play_time playtime, time_elapsed timeElapsed, client_flags clientFlags, userid userId, perfect ` +
            //                 `FROM scores_${options.mod} s JOIN maps m ON s.map_md5 = m.md5 JOIN users u ON s.userid = u.id ` +
            //                 `WHERE ${filterQueryBuilder(filter, idType)} s.mode = ? AND s.status >= ? AND m.status >= ? AND u.priv >= 3 ` +
            //                 `ORDER BY ${options.order} ${(options.ascending) ? "ASC" : "DESC"} LIMIT ?, ?;`;
            const query =
                `SELECT ` +
                    `s.id scoreId,` +
                    `m.id beatmapId,` +
                    `m.set_id beatmapSetId,` +
                    `s.score,` +
                    `s.pp,` +
                    `s.acc accuracy,` +
                    `s.max_combo maxCombo,` +
                    `s.mods,` +
                    `s.n300 hits300,` +
                    `s.n100 hits100,` +
                    `s.n50 hits50,` +
                    `s.nmiss hitsMiss,` +
                    `s.grade,` +
                    `s.status,` +
                    `s.mode,` +
                    `s.play_time playtime,` +
                    `s.time_elapsed timeElapsed,` +
                    `s.client_flags clientFlags,` +
                    `s.userid userId,` +
                    `s.perfect ` +
                `FROM scores_${options.mod} s ` +
                `JOIN maps m ON s.map_md5 = m.md5 ` +
                `JOIN users u ON s.userid = u.id ` +
                // cool way for handling distinct scores distinct
                // INNER JOIN
                //     (SELECT userid, max(round(pp)) pp
                //     from scores_vn
                //     JOIN maps m2 ON map_md5 = m2.md5
                //     WHERE m2.id = 1627148
                //     group by userid)
                //     s2 ON s.userid = s2.userid AND round(s.pp) = round(s2.pp)
                `WHERE ` +
                    `${filterQueryBuilder(filter, idType)} ` +
                    `s.mode = ? AND ` +
                    `s.status >= ? AND ` +
                    `m.status >= ? AND ` +
                    `u.priv >= 3 ` +
                `ORDER BY ${options.order} ${(options.ascending) ? "ASC" : "DESC"} ` +
                `LIMIT ?, ?;`;

            const parameters = [options.modeNumber, options.scoreStatus, options.beatmapStatus, options.offset, options.limit];
            if(filter.user.active) parameters.unshift(filter.user.value);
            if(filter.beatmap.active) parameters.unshift(filter.beatmap.value);

            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters})
            SutekinaApi.mysql.execute(query, parameters, async (err, res, fields) => {
                if(err) return reject(err);
                let scores: any = res;
                if(!scores[0] && filter.user.active && idType !== "safe_name") scores = await Scores.getList(filter, options, "safe_name");
                resolve(new Scores(scores));
            });
        });
    };
}

const filterQueryBuilder = (filter: scoreFilter, idType: string): string => {
    let str: string = "";
    if(filter.beatmap.active) str = "m.id = ? AND ";
    if(filter.user.active) str = str + `u.${idType} = ? AND`;
    return str;
}

type scoreFilter = {
    beatmap: {
        active: boolean,
        value: string | null
    },
    user: {
        active: boolean,
        value: string | null
    }
}

// ${(filterId) ? "userid = ? AND" : ""}