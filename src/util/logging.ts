import winston from "winston";
import path from "path";
import { debug } from "../../config.json";

const colors: winston.config.AbstractConfigSetColors = {
    fatal: "bold red",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "cyan",
    trace: "magenta"
}

const levels: winston.config.AbstractConfigSetLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
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
                    filename: path.join(__dirname, "../../..", debug.file_dir, `${new Date().toISOString()}.log`),
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