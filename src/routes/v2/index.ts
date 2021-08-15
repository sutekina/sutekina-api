// sutekina-api/v2
// attempt at rest api
import { application } from "../../../config.json";
import { Router } from "express";
import beatmaps from "./beatmaps";
import beatmapsets from "./beatmapsets";
import users from "./users";
import clans from "./clans";

const router = Router();
try {
    router.get("/", (req, res, next) => {
        res.json({"message":`${application.name}-v2`, "code":200})
    });
    beatmaps(router);
    beatmapsets(router);
    users(router);
    clans(router);
} catch(err) {
    err.level = err.level || "error";
    router.use((req, res, next) => next(err));
}

export = router;