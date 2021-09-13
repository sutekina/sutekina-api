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
    country?: string,
    hasPlayed?: boolean,
    modMode?: number,
    search?: string
}

const modeNumbers = {
    std: "0",
    taiko: "1",
    catch: "2",
    mania: "3"
}

const modModes: any = {
    vn_std: 0,
    vn_taiko: 1,
    vn_catch: 2,
    vn_mania: 3,

    rx_std: 4,
    rx_taiko: 5,
    rx_catch: 6,

    ap_std: 7
}

export function queryMatch(query: any, base: {order?: string}, orderRgx?: RegExp): QueryOptions {
    if(query.beatmapStatus) query.beatmapStatus = parseInt(query.beatmapStatus, 10);
    if(query.scoreStatus) query.scoreStatus = parseInt(query.scoreStatus, 10);

    // not the most elegant solution, should reject request if this is the mode but if someone has mods rx and mode mania then mode = std and if mods ap and mode maniataikocatch then mode = std;
    query.mode = (query.mod === "rx" && query.mode === "mania") || (query.mod === "ap" && query.mode.toString().match(/^(mania|taiko|catch)$/)) ? "std" : query.mode;

    const match: QueryOptions = {};

    match.mod = query.mod && query.mod.toString().match(/^(vn|rx|ap)$/) ? query.mod.toString() : "vn";
    match.mode = query.mode && query.mode.toString().match(/^(std|taiko|catch|mania)$/) ? query.mode.toString() : "std";
    match.modeNumber = objectLookup(match.mode, modeNumbers);
    match.order = query.order && query.order.toString().match(orderRgx || /x^/) ? query.order.toString() : base.order || "pp";
    match.ascending = query.ascending === "true" ? true : false;
    match.limit = (parseInt(query.limit, 10) && parseInt(query.limit, 10) <= 100 ? parseInt(query.limit.toString(), 10) : 10).toString();
    match.offset = (parseInt(query.offset, 10) ? parseInt(query.offset.toString(), 10) : 0).toString();
    match.beatmapStatus = (query.beatmapStatus >= -2 && query.beatmapStatus <= 5 ? query.beatmapStatus : -2).toString();
    match.scoreStatus = (query.scoreStatus >= 0 && query.scoreStatus <= 2 ? query.scoreStatus : 0).toString();
    match.country = query.country && query.country.length === 2 ? query.country.toString().toLowerCase() : undefined;
    match.hasPlayed = query.hasPlayed === "true" ? true : false;
    match.modMode = modModes[`${match.mod}_${match.mode}`];
    match.search = query.search ? `%${query.search.toString().replace(/(\\)|([\[\]%_])/g, searchReplacer)}%` : undefined;

    return match;
}

function searchReplacer(match: string, p1: string, p2: string, offset: number, original: string) {
    if(p1) return "";
    if(p2) return `\\${p2}`
}
