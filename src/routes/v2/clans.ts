import express from "express";
import Clans from "../../classes/Clans";
import Clan from "../../classes/Clan";
import { QueryOptions, queryMatch } from "../../interfaces/QueryOptions";

export = (router: express.Router) => {
    router.get("/clans/:clan?", async (req, res, next) => {
        if(!req.query.ascending) req.query.ascending = "true";
        const options: QueryOptions = queryMatch(req.query, {order: "clanId"}, /^(clanId|name|tag|userId|createdAt|members)$/);
        if(!req.params.clan) return res.json(await Clans.getAll(options));
        res.json(await Clan.find(req.params.clan));
    });

    router.get("/clans/:clan/members", async (req, res, next) => {
        const options: QueryOptions = queryMatch(req.query, {});
        res.json(await Clan.findMembers(req.params.clan, options));
    });
};