import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";
import SutekinaApi from "./SutekinaApi";
import Beatmap from "./Beatmap";

export = class BeatmapSet extends Array {
    constructor(beatmapSet: Beatmap[] | any[]) {
        super(beatmapSet.length);
        beatmapSet.forEach((beatmap, i) => this[i] = beatmap);
    }

    public static get = (identifier: string, {beatmapStatus, order, ascending}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT id beatmapId, set_id beatmapSetId, status beatmapStatus, md5 beatmapMd5, artist, title, version, creator, last_update lastUpdate, total_length totalLength, max_combo maxCombo, frozen, plays playCount, passes, mode, bpm, ar approachRate, cs circleSize, od overallDifficulty, hp healthPoints, diff difficultyRating FROM maps WHERE set_id = ? AND status >= ? ORDER BY mode, ${order} ${(ascending) ? "ASC" : "DESC"} ;`;
            const parameters = [identifier, beatmapStatus];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res: any, fields) => {
                if(err) return reject(err);
                resolve(new BeatmapSet(res));
            });
        });
    }

    public static getList = ({order, ascending, beatmapStatus, offset, limit, search}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            // you could count versions but it is really bad for performance "(SELECT count(id) FROM maps mm WHERE mm.set_id = m.set_id) versions"
            // the performance is so bad that i would never do this, the higher the limit the worse it gets.

            // distinct sucks!
            const query = `SELECT DISTINCT set_id beatmapSetId, artist, title, creator FROM maps m WHERE ${search ? `concat(m.artist, m.title, m.creator) LIKE ? ESCAPE '\\\\' AND` : ""} status >= ? ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"} LIMIT ?, ?;`;
            const parameters = [beatmapStatus, offset, limit];

            if(search) parameters.unshift(search);

            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res: any, fields) => {
                if(err) return reject(err);
                resolve(res);
            });
        });
    };

    public static count = ({beatmapStatus, search}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(DISTINCT(m.set_id)) as count FROM maps m WHERE ${search ? `concat(m.artist, m.title, m.creator) LIKE ? ESCAPE '\\\\' AND` : ""} status >= ?;`;
            const parameters = [beatmapStatus];

            if(search) parameters.unshift(search);

            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, (err, res: any[], fields) => {
                if(err) return reject(err);
                resolve(res[0].count);
            });
        });
    };
}