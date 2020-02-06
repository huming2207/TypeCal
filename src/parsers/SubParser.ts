export interface SubParser<T> {
    parse(rawStr: string): T;
    propNames: string[];
}
