import User from "./User";
import mysql from "mysql2";

export = class Users extends Array {
    constructor(...users: User[]) {
        super(users.length);

        users.forEach((user, i) => this[i] = user);
    }

    public static getAll = (limit: number, offset?: number): Users => {
        return new Users()
    }
}