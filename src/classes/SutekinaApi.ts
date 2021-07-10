import express from "express";
import logging from "../util/logging";

export = class SutekinaApi {
    private static application: express.Application;

    constructor(port?: number, name?: string) {
        if(SutekinaApi.application) return SutekinaApi.application

        if(!port) throw new Error("Please provide the port that the api should run on.");

        SutekinaApi.application = express();

        SutekinaApi.application.listen(port, () => {
            logging.info(`${name ? name : "sutekina-api"} is running on ${port}`);
        });
    }
}