// sutekina-api/v2
// rest api
import { Router } from "express";
import beatmaps from "./beatmaps";
import users from "./users";

const router = Router();

beatmaps(router);
users(router);

export = router;