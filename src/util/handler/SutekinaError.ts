export = class SutekinaError extends Error {
    public level: string;
    public code: number;

    constructor(message: string, level: string, code: number, stack?: string) {
        super(message);
        this.level = level;
        this.code = code;
        if(stack) this.stack = stack;
    }
}