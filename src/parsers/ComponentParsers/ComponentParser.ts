import { ComponentType } from '../../components/Component';
import { StringHelper } from '../../common/StringHelper';

export abstract class ComponentParser<T> {
    abstract parseComponent(rawStr: string): T;
    public static findComponents = (rawStr: string, type: ComponentType): { components: string[]; tailIndex: number } => {
        let beginIndex = 0;
        let endIndex = 0;
        let validTail = 0;
        const beginStr = `BEGIN:${type}`;
        const endStr = `END:${type}`;
        const rawComponents: string[] = [];

        while (beginIndex >= 0 && endIndex >= 0) {
            beginIndex = rawStr.indexOf(beginStr, beginIndex + 1) + beginStr.length;
            endIndex = rawStr.indexOf(endStr, endIndex + 1);
            if (beginIndex >= endIndex) break;
            rawComponents.push(rawStr.substring(beginIndex + 1, endIndex));
            validTail = endIndex + `END:${type}`.length;
        }

        return { components: rawComponents, tailIndex: validTail };
    };

    public static indexOfBegin = (rawStr: string, type: ComponentType): number => {
        return rawStr.indexOf(`BEGIN:${type}`);
    };

    public static indexOfEnd = (rawStr: string, type: ComponentType): number => {
        return rawStr.indexOf(`END:${type}`);
    };

    public static lastParsedBegin = (rawStr: string, type: ComponentType): number => {
        return rawStr.lastIndexOf(`BEGIN:${type}`) + `BEGIN:${type}`.length;
    };

    public static lastParsedEnd = (rawStr: string, type: ComponentType): number => {
        return rawStr.lastIndexOf(`END:${type}`) + `END:${type}`.length;
    };

    public static hasBegin = (rawStr: string, type: ComponentType): boolean => {
        return ComponentParser.indexOfBegin(rawStr, type) > 0;
    };

    public static hasValidComponent = (rawStr: string, type: ComponentType): boolean => {
        return rawStr.includes(`BEGIN:${type}`) && rawStr.includes(`END:${type}`);
    };

    protected static strToKvPairs = (rawStr: string): Map<string, string[]> => {
        const lines = StringHelper.splitNonEmpty(rawStr, '\n');
        const kvPair = new Map<string, string[]>();
        let isInSubComponent = false;
        for (const currLine of lines) {
            // Split from something like "UID:foobar:baz" to "UID" and "foobar:baz"
            const key = currLine.split(/\;|\:/g, 1)[0];

            // Skip all sub-components
            if (key === 'BEGIN') isInSubComponent = true;
            if (key === 'END') isInSubComponent = false;
            if (isInSubComponent) continue;

            // Get value
            const val = currLine.substring(currLine.indexOf(key) + key.length + 1);

            // In case some keys (e.g. ANTENDEE) are duplicated...
            const valInMap = kvPair.get(key);
            if (valInMap === undefined) {
                kvPair.set(key, [val]);
            } else {
                valInMap.push(val);
                kvPair.set(key, valInMap);
            }
        }

        return kvPair;
    };
}
