import logging from "../util/logging";
import SutekinaApi from "./SutekinaApi";

export = class Clan {
    public clanId: number;
    public name: string;
    public tag: string;
    public userId: number;
    public createdAt: string;

    constructor(clan: Clan | any) {

    }

    public static find() {
        
    }
}