export class StringHelper {
    public static splitNonEmpty(str: string, splitter: string, limit?: number): string[] {
        const arr = str.split(splitter, limit);
        return arr.filter((elem: string) => {
            return elem.length > 0;
        });
    }
}
