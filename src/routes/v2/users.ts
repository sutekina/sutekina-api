import express from "express";
import Users from "../../classes/Users";
import User from "../../classes/User";
import logging from "../../util/logging";

export = (router: express.Router) => {
    router.get("/users/:user?", (req, res, next) => {
        const mode = (req.query.mode || "std").toString();
        const mod = (req.query.mod || "vn").toString();

        const limit = (req.query.limit) ? parseInt(req.query.limit.toString(), 10) : 10;
        const offset = (req.query.offset) ? parseInt(req.query.offset.toString(), 10) : 0;

        if(!req.params.user) return Users.getAll(mod, mode, limit, offset).then(users => res.json(users));
        User.find(req.params.user, mod.match(/^(vn|rx|ap)$/) ? mod : "vn", mode.match(/^(std|taiko|catch|mania)$/) ? mode : "std").then((user) => res.json(user));
    });
};