import express, { request } from "express";
import Users from "../../classes/Users";
import User from "../../classes/User";
import Scores from "../../classes/Scores";
import {QueryOptions, queryMatch} from "../../interfaces/QueryOptions";

export = (router: express.Router) => {
    router.get("/users/:user?", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, /^(id|name|country|privilege|playcount|pp|accuracy|globalRank|countryRank|playtime|creationTime)$/);

        if(!req.params.user) return res.json(await Users.getAll(options));
        res.json(await User.find(req.params.user.toLowerCase(), options.mod, options.mode));
    });

    router.get("/users/:user/scores", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, /^(scoreId|beatmapMd5|score|pp|accuracy|maxCombo|mods|hits300|hits100|hits50|hitsMiss|grade|status|mode|playtime|timeElapsed|clientFlags|userId|perfect)$/)

        res.json(await Scores.getAll("user", req.params.user.toLowerCase(), options));
    });
};