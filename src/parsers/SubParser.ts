export interface SubParser<T> {
    parse(rawStr: string): T;
    valueNames: string[];
}
