import express from "express";
import {QueryOptions, queryMatch} from "../../interfaces/QueryOptions";
import BeatmapSet from "../../classes/BeatmapSet";

export = (router: express.Router) => {
    router.get("/beatmapsets", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {order: "beatmapSetId"}, /^(beatmapSetId|artist|title|creator)$/);
        res.json({
            count: await BeatmapSet.count(options),
            results: await BeatmapSet.getList(options)
        });
    });
    router.get("/beatmapsets/:beatmapset", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {order: "difficultyRating"}, /^(beatmapId|beatmapSetId|beatmapStatus|beatmapMd5|artist|title|version|creator|lastUpdate|totalLength|maxCombo|frozen|playCount|passes|mode|bpm|ar|cs|od|hp|difficultyRating)$/)
        res.json(await BeatmapSet.get(req.params.beatmapset, options));
    });
};
