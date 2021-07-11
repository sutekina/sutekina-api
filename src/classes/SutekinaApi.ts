import express from "express";
import logging from "../util/logging";

export = class SutekinaApi {
    private static application: express.Application;

    constructor(port?: number, name?: string) {
        if(!port) throw new Error("Please provide the port that the api should run on.");

        SutekinaApi.application = express();

        SutekinaApi.application.disable('case sensitive routing');
        SutekinaApi.application.disable('strict routing');
        SutekinaApi.application.disable('x-powered-by');
        SutekinaApi.application.set('etag', false);

        SutekinaApi.application.listen(port, () => {
            logging.info(`${name ? name : "sutekina-api"} is running on ${port}`);
        });
    }

    public ping(): boolean {
        if(!SutekinaApi.application) throw new Error("Sutekina isn't running.");

        return true
    }

    public static getApp(): express.Application {
        if(!this.application) throw new Error(("Please create a SutekinaApi instance."));

        return this.application;
    }
}