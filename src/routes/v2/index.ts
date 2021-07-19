// sutekina-api/v2
// attempt at rest api
import { application } from "../../../config.json";
import { Router } from "express";
import beatmaps from "./beatmaps";
import users from "./users";

const router = Router();

router.get("/", (req, res, next) => {
    res.json({"message":`${application.name}-v2`, "code":200})
});
beatmaps(router);
users(router);

export = router;