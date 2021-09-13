import express from "express";
import Clans from "../../classes/Clans";
import Clan from "../../classes/Clan";
import { QueryOptions, queryMatch } from "../../interfaces/QueryOptions";

export = (router: express.Router) => {
    router.get("/clans/:clan?", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {order: "clanId"}, /^(clanId|name|tag|userId|createdAt|members)$/);

        if(!req.params.clan) return res.json({
            count: await Clans.count(options),
            results: await Clans.getList(options)
        });

        res.json(await Clan.get(req.params.clan));
    });

    router.get("/clans/:clan/members", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {});
        res.json(await Clan.getMembers(req.params.clan, options));
    });
};