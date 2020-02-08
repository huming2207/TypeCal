export interface ComponentParser<T> {
    parseComponent(rawStr: string): T;
}
