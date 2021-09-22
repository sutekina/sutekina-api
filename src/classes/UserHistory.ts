import { QueryOptions } from "../interfaces/QueryOptions";
import logging from "../util/logging";
import SutekinaApi from "./SutekinaApi";

export = class UserHistory extends Array {
    constructor(...userHistory: UserHistory[] | any[]) {
        super(userHistory.length);

        userHistory.forEach((history) => this.push(history));

        return this[1];
    }

    public static get = (identifier: string, {order, ascending, modMode}: QueryOptions, identifierType: "id" | "safe_name" = "id") => {
        return new Promise((resolve, reject) => {
            const query =   `SELECT user_history_id userHistoryId, user_id userId, global_rank globalRank, ` +
                            `pp, rscore rankedScore, datetime FROM user_history uh JOIN users u ON u.id = ` +
                            `uh.user_id WHERE datetime >= date_sub(now(), interval 90 day) AND modmode = ? ` +
                            `AND u.${identifierType} = ? ORDER BY ${order} ${(ascending) ? "ASC" : "DESC"};`;

            const parameters = [modMode, identifier];
            logging.verbose(SutekinaApi.mysql.format(query, parameters), {query, parameters});
            SutekinaApi.mysql.execute(query, parameters, async (err, res, fields) => {
                if(err) return reject(err);

                let userHistory: any = res;

                if(!userHistory[0] && identifierType !== "safe_name") userHistory = await UserHistory.get(identifier, {order, ascending, modMode}, "safe_name");

                resolve(new UserHistory(userHistory));
            });
        });
    }
}
