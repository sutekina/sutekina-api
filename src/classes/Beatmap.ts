import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";
import SutekinaApi from "./SutekinaApi";
import GET from "../util/request/get";
import config from "../../config.json";


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
    public approachRate: number;
    public circleSize: number;
    public overallDifficulty: number;
    public healthPoints: number;
    public difficultyRating: number;

    constructor(beatmap: Beatmap | any) {
        Object.assign(this, beatmap);
    }

    public static find = (identifier: string, {beatmapStatus}: QueryOptions) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT id beatmapId, set_id beatmapSetId, status beatmapStatus, md5 beatmapMd5, artist, title, version, creator, last_update lastUpdate, total_length totalLength, max_combo maxCombo, frozen, plays playCount, passes, mode, bpm, ar approachRate, cs circleSize, od overallDifficulty, hp healthPoints, diff difficultyRating FROM maps WHERE id = ? AND status >= ?;`;
            let parameters = [identifier, beatmapStatus];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res: any, fields) => {
                if(err) return reject(err);
                const beatmap = res[0];
                if(beatmap && beatmap.totalLength !== 0 && beatmap.maxCombo !== 0) return resolve(new Beatmap(beatmap));
                if(!beatmap) return resolve({});
                logging.verbose(JSON.stringify(beatmap))
                GET({host: "osu.ppy.sh", protocol: "https:", port: 443, path: `/api/get_beatmaps?k=${config.authentication.osu}&h=${beatmap.beatmapMd5}`}).then((data: string) => {
                    const map = JSON.parse(data)[0];
                    // the map isn't on the osu server, deleted? TODO maybe delete score from db? // example beatmapId = 754813;
                    // i could reply with empty object but im better off doing this because then you can at least still get some data on the map.
                    if(!map) return resolve(new Beatmap(beatmap));
                    beatmap.totalLength = parseInt(map.total_length, 10);
                    beatmap.maxCombo = parseInt(map.max_combo, 10);
                    query = `UPDATE maps SET total_length = ?, max_combo = ? WHERE md5 = ?;`;
                    parameters = [beatmap.totalLength, beatmap.maxCombo, beatmap.beatmapMd5];
                    logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
                    SutekinaApi.mysql.execute(query, parameters, (e) => {
                        if(e) return reject(e);
                    });
                    resolve(new Beatmap(beatmap));
                }).catch(e => reject(e));
            });
        });
    }
}