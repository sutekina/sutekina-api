export = (name: string, obj: any) => {
    if (isObjKey(name, obj)) {
        return obj[name];
    }

    return undefined
}

function isObjKey<T>(key: any, obj: T): key is keyof T {
    return key in obj;
}