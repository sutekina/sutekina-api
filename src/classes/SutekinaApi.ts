import express from "express";
import mysql from "mysql2";
import config from "../../config.json";
import logging from "../util/logging";

export = class SutekinaApi {
    private static application: express.Application;
    public static mysql: mysql.Connection;

    constructor(port?: number, name?: string) {
        if(!port) throw new Error("Please provide the port that the api should run on.");

        SutekinaApi.application = express();

        SutekinaApi.application.disable('case sensitive routing');
        SutekinaApi.application.disable('strict routing');
        SutekinaApi.application.disable('x-powered-by');
        SutekinaApi.application.set('etag', 'strong');

        SutekinaApi.application.listen(port, () => {
            logging.info(`${name ? name : "sutekina-api"} is running on ${port}`);
        });

        this.connectDatabase();
    }

    public ping(): boolean {
        if(!SutekinaApi.application) throw new Error("Sutekina isn't running.");

        return true
    }

    public static getApp(): express.Application {
        if(!this.application) throw new Error(("Please create a SutekinaApi instance."));

        return this.application;
    }

    private connectDatabase() {
        const handleDisconnect = () => {
            SutekinaApi.mysql = mysql.createConnection(config.mysql);
            SutekinaApi.mysql.connect((err: MysqlError) => {
                if(err) {
                    logging.error(err.message, err);
                    setTimeout(handleDisconnect, 2000);
                } else {
                    logging.debug(`Connected to ${config.mysql.user}@${config.mysql.host}:${config.mysql.port}/${config.mysql.database}`);
                }
            });

            SutekinaApi.mysql.on('error', (err: MysqlError) => {
                logging.error(err.message, err);
                if(err.code === "PROTOCOL_CONNECTION_LOST") return setTimeout(handleDisconnect, 2000);
                throw err;
            });
        };

        handleDisconnect();
    }
}

interface MysqlError extends Error {
    code: string;
    sqlStateMarker?: string;
    sqlState?: string;
    fieldCount?: number;
    fatal: boolean;
}