
class ObjectHelper {

    public static isNullOrEmpty(obj): boolean {
        for (let key in obj) {
            if (obj[key] !== null && obj[key] != "")
                return false;
        }
        return true;
    }
    public static isNullOrEmptyWithExceptions(obj, exceptions: string[]): boolean {
        for (let key in obj) {
            if(!exceptions.includes(key))
            {
                if (obj[key])
                    return false;
            }
        }
        return true;
    }
    public static isNullOrEmptyWithDefaultExceptions(obj, exceptions: string[]): boolean {
        if(!exceptions)
            exceptions = [];
        ["pageIndex", "pageSize", "exportToFile"].forEach(w => exceptions.push(w));
        for (let key in obj) {
            if(!exceptions.includes(key))
            {
                if (obj[key])
                    return false;
            }
        }
        return true;
    }
}

export default ObjectHelper;