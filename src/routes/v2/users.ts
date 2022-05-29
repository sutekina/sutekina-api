import express from "express";
import Users from "../../classes/Users";
import User from "../../classes/User";
import UserHistory from "../../classes/UserHistory";
import Scores from "../../classes/Scores";
import {QueryOptions, queryMatch} from "../../interfaces/QueryOptions";

export = (router: express.Router) => {
    router.get("/users/:user?", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {}, /^(userId|name|country|privilege|playcount|pp|accuracy|globalRank|countryRank|playtime|creationTime)$/);

        if(!req.params.user) return res.json({
            count: await Users.count(options),
            results: await Users.getList(options)
        });

        res.json(await User.get(req.params.user.toLowerCase(), options));
    });

    router.get("/users/:user/scores", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {}, /^(scoreId|beatmapMd5|score|pp|accuracy|maxCombo|mods|hits300|hits100|hits50|hitsMiss|grade|status|mode|playtime|timeElapsed|clientFlags|userId|perfect)$/)

        res.json(await Scores.getList({beatmap: {active: false, value: null}, user: {active: true, value: req.params.user.toLowerCase()}}, options));
    });

    router.get("/users/:user/history", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {order: "datetime"}, /^(userId|userHistoryId|globalRank|pp|rankedScore|datetime)$/);

        res.json(await UserHistory.get(req.params.user.toLowerCase(), options));
    });
};