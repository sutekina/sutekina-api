import express from "express";
import logging from "../logging";
import SutekinaError from "./SutekinaError";
import objectLookup from "../object/objectLookup";

export = class Handler {
    Error = (data: ErrorData, req: express.Request, res: express.Response, next: express.NextFunction) => {
        const error = new SutekinaError(data.message, data.level, data.code || 500);
        objectLookup(error.level, logging)(error.message, error);
        if(error.stack) delete error.stack;
        res.status(error.code).json(JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
    }
}

type ErrorData = {
    message: string,
    level: string,
    code?: number,
    stack?: string
};