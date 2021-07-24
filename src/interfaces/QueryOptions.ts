import objectLookup from "../util/object/objectLookup";

export interface QueryOptions {
    mod?: string,
    mode?: string,
    modeNumber?: string,
    order?: string,
    ascending?: boolean,
    limit?: string,
    offset?: string,
    beatmapStatus?: string, // -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5
    scoreStatus?: string, // 0 | 1 | 2
    country?: string
}

const modeNumbers = {
    std: "0",
    taiko: "1",
    ctb: "2",
    mania: "3"
}

export function queryMatch(query: any, orderRgx?: RegExp): QueryOptions {
    if(query.beatmapStatus) query.beatmapStatus = parseInt(query.beatmapStatus, 10);
    if(query.scoreStatus) query.scoreStatus = parseInt(query.scoreStatus, 10);

    // not the most elegant solution, should reject request if this is the mode but if someone has mods rx and mode mania then mode = std and if mods ap and mode maniataikocatch then mode = std;
    query.mode = (query.mod === "rx" && query.mode === "mania") || (query.mod === "ap" && query.mode.toString().match(/^(mania|taiko|catch)$/)) ? "std" : query.mode;

    const match: QueryOptions = {};

    match.mod = query.mod && query.mod.toString().match(/^(vn|rx|ap)$/) ? query.mod.toString() : "vn";
    match.mode = query.mode && query.mode.toString().match(/^(std|taiko|catch|mania)$/) ? query.mode.toString() : "std";
    match.modeNumber = objectLookup(match.mode, modeNumbers);
    match.order = query.order && query.order.toString().match(orderRgx || /x^/) ? query.order.toString() : "pp";
    match.ascending = query.ascending === "true" ? true : false;
    match.limit = (parseInt(query.limit, 10) ? parseInt(query.limit.toString(), 10) : 10).toString();
    match.offset = (parseInt(query.offset, 10) ? parseInt(query.offset.toString(), 10) : 0).toString();
    match.beatmapStatus = (query.beatmapStatus >= -2 && query.beatmapStatus <= 5 ? query.beatmapStatus : 2).toString();
    match.scoreStatus = (query.scoreStatus >= 0 && query.scoreStatus <= 2 ? query.scoreStatus : 1).toString();
    match.country = query.country && query.country.length === 2 ? query.country.toString().toLowerCase() : undefined;

    return match;
}

