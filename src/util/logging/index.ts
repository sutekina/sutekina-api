import winston from "winston";
import path from "path";
import { debug } from "../../../config.json";

const colors: winston.config.AbstractConfigSetColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "cyan",
    verbose: "magenta"
}

const levels: winston.config.AbstractConfigSetLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    verbose: 4
}
let staticLogger: winston.Logger;
export = ((): winston.Logger => {
    if(!staticLogger) {
        winston.addColors(colors);
        staticLogger = winston.createLogger({
            levels,
            transports: [
                new winston.transports.Console({
                    level: debug.terminal_level,
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.errors({stack:true}),
                        winston.format.timestamp({format: "MM-DD-YYYY HH:mm:ss.SSS UTC"}),
                        winston.format.printf(info => {
                            return `[${info.timestamp}] ${info.level}${(info.status) ? ` ${info.status}` : ''}: ${info.stack || info.message}`
                        }),
                    )
                }),
                new winston.transports.File({
                    level: debug.file_level,
                    filename: path.join(__dirname, "../../../..", debug.file_dir, `${new Date().toISOString()}.log`),
                    format: winston.format.combine(
                        winston.format.errors({stack:true}),
                        winston.format.timestamp(),
                        winston.format.json({space: 2})
                    )
                })
            ]
        });
    }

    return staticLogger;
})();