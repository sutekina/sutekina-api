import express, { json } from "express";
import {QueryOptions, queryMatch} from "../../interfaces/QueryOptions";
import Beatmap from "../../classes/Beatmap";
import Scores from "../../classes/Scores";

export = (router: express.Router) => {
    router.get("/beatmaps/:beatmap?", async (req, res, next) => {
        if(!req.params.beatmap) return res.json({"message":`Please enter a beatmap id, to list all beatmapsets use route /beatmapsets.`, "code":200})
        const options: QueryOptions = queryMatch(req.query, {})

        res.json(await Beatmap.find(req.params.beatmap, options));
    });

    router.get("/beatmaps/:beatmap/scores", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {}, /^(scoreId|beatmapMd5|score|pp|accuracy|maxCombo|mods|hits300|hits100|hits50|hitsMiss|grade|status|mode|playtime|timeElapsed|clientFlags|userId|perfect)$/)

        res.json(await Scores.getAll("beatmap", req.params.beatmap, options));
    });
};
