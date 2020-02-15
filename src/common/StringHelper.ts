/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export class StringHelper {
    public static splitNonEmpty(str: string, splitter: string | RegExp, limit?: number): string[] {
        const arr = str.split(splitter, limit);
        return arr.filter((elem: string) => {
            return elem.length > 0;
        });
    }

    public static removeEmptyJsonObj = (obj: any) => {
        Object.entries(obj).forEach(([key, val]) => {
            if (val && typeof val === 'object') StringHelper.removeEmptyJsonObj(val);
            else if (val == null) {
                delete obj[key];
            } else if (typeof val === 'string' && val === '') {
                delete obj[key];
            } else if (typeof val === 'number' && val === NaN) {
                delete obj[key];
            }
        });
    };
}
