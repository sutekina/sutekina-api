export = class SutekinaError extends Error {
    public level: string;
    public code: number;

    constructor(message: string, level: string, code: number, stack?: string) {
        super(message);
        this.level = level || "error";
        this.code = code || 500;
        if(stack) this.stack = stack;
    }
}