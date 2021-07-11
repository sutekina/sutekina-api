import express from "express";
import clock from "../clock";
import logging from "../logging";

export = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const requestStart: bigint = clock();
    res.on("finish", () => {
        const requestEnd = Number(clock(requestStart)).toFixed(2);
        logging.debug(`${req.method} ${req.hostname}${req.originalUrl} // ${requestEnd}ms`, {
            request: {
                method: req.method,
                protocol: req.protocol,
                status: res.statusCode,
                hostname: req.hostname,
                path: (req.baseUrl) ? req.baseUrl + req.path : req.path,
                query: req.query
            },
            status: res.statusCode
        });
        logging.verbose(`${req.method} / IP: (${req.headers['x-forwarded-for']}), URL: ${req.hostname}${req.originalUrl} // ${requestEnd}ms`, {headers: req.headers, status: res.statusCode});
    });
    next();
}