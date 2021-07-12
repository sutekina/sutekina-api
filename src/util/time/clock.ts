export = (start?: bigint) => {
    if (!start) return process.hrtime.bigint();

    return (process.hrtime.bigint() - start) / BigInt(1000000);
}