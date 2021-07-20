import express from "express";

export = (router: express.Router) => {
    router.get("/beatmaps", (req, res, next) => {
        res.json("Meow");
    });
};
