export const DateSerializer = {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    Serialize(value: any): any {
        const val = value as Date;
        try {
            const str = val.toISOString();
            return str;
        } catch (e) {
            return null;
        }
    },
    Deserialize(json: any): any {
        return new Date(json);
    },
    /* eslint-enable @typescript-eslint/no-explicit-any */
};
