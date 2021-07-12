import express from "express";

export = (router: express.Router) => {
    router.get("/leaderboards", (req, res, next) => {
        res.json("Meow");
    })
};
