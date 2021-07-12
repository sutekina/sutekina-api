import express from "express";
import Users from "../../classes/Users";
import User from "../../classes/User";

export = (router: express.Router) => {
    router.get("/users/:user?", (req, res, next) => {
        const mode = (req.query.mode || "std").toString();
        const mod = (req.query.mod || "vn").toString();
        const limit = parseInt(req.query.limit.toString()) || 10;
        const offset = parseInt(req.query.offset.toString()) || 0

        if(!req.params.user) return res.json(new Users());
        User.find(req.params.user, mod.match(/^(vn|rx|ap)$/) ? mod : "vn", mode.match(/^(std|taiko|catch|mania)$/) ? mode : "std").then((user) => res.json(user));
    });
};