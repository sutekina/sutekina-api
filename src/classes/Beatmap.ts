import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";
import SutekinaApi from "./SutekinaApi";

export = class Beatmap {
    public beatmapId: number;
    public beatmapSetId: number;
    public beatmapStatus: number;
    public beatmapMd5: string;
    public artist: string;
    public title: string;
    public version: string;
    public creator: string;
    public lastUpdate: Date;
    public totalLength: number;
    public maxCombo: number;
    public frozen: number;
    public playCount: number;
    public passes: number;
    public mode: number;
    public bpm: number;
    public ar: number;
    public cs: number;
    public od: number;
    public hp: number;
    public difficultyRating: number;

    constructor(beatmap: Beatmap | any) {
        Object.assign(this, beatmap);
    }

    public static find = (identifier: string, {beatmapStatus}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT id beatmapId, set_id beatmapSetId, status beatmapStatus, md5 beatmapMd5, artist, title, version, creator, last_update lastUpdate, total_length totalLength, max_combo maxCombo, frozen, plays playCount, passes, mode, bpm, ar, cs, od, hp, diff difficultyRating FROM maps WHERE id = ? AND status >= ?;`;
            const parameters = [identifier, beatmapStatus];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res: any, fields) => {
                if(err) return reject(err);
                logging.verbose(JSON.stringify(res));
                resolve(new Beatmap(res[0]));
            });
        });
    }
}