export interface ValueParser<T> {
    parse(rawStr: string): T;
    propNames: string[];
}
