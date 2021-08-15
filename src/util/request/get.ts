import https from "https";
import logging from "../logging";

export = (options: {host: string, protocol?: string, path?: string, port?: number}) => {
    return new Promise((resolve, reject) => {
        logging.verbose(`preparing request for ${options.host}`, {...options});
        https.get(options, (res) => {
            logging.verbose(`request to ${options.host}`, {...options});
            logging.debug(`request to ${options.host}${options.path} // ${res.statusCode} ${res.statusMessage}`)
            let data = '';
            res.on('data', chunk => {
                logging.verbose(`received chunk ${options.host}`, {...options, chunk})
                data += chunk;
            });

            res.on('close', () => {
                logging.verbose(`request to ${options.host} closed.`, {...options, data});
                resolve(data);
            });
        }).on("error", err => reject(err));
    })
}