// sutekina-api/v2
// rest api
import { Router } from "express";
import beatmaps from "./beatmaps";
import leaderboards from "./leaderboards";
import users from "./users";

const router = Router();

beatmaps(router);
leaderboards(router);
users(router);

export = router;