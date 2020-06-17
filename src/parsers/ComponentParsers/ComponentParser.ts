import { ComponentType, BaseComponent } from '../../components/Component';
import { StringHelper } from '../../common/StringHelper';
import { StringParser } from '../ValueParsers/StringParser';
import { NumberParser } from '../ValueParsers/NumberParser';
import { DateTimeParser } from '../ValueParsers/DateTimeParser';
import { CalAddressParser } from '../ValueParsers/CalAddressParser';

export abstract class ComponentParser<T> {
    protected stringParser = new StringParser();
    protected numberParser = new NumberParser();
    protected dateTimeParser = new DateTimeParser();
    protected calAddrParser = new CalAddressParser();
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

    protected writeKvPairsToObj = (obj: BaseComponent, kvPair: Map<string, string[]>): void => {
        Object.keys(obj).forEach((key: string) => {
            if (!key.startsWith('_')) return;

            const calKey = key.substring(1).toUpperCase();
            const calVal = kvPair.get(calKey);
            if (calVal === undefined) return;

            /* eslint-disable @typescript-eslint/no-explicit-any */
            if (typeof (obj as any)[key] === 'string') {
                (obj as any)[key] = this.stringParser.parse(calVal[0]);
            } else if (typeof (obj as any)[key] === 'number') {
                (obj as any)[key] = this.numberParser.parse(calVal[0]);
            } else if (typeof (obj as any)[key] === 'object') {
                if (this.dateTimeParser.propNames.includes(calKey)) {
                    (obj as any)[key] = this.dateTimeParser.parse(calVal[0]);
                } else if (this.calAddrParser.propNames.includes(calKey)) {
                    for (const calCurrVal of calVal) {
                        (obj as any)[key].push(this.calAddrParser.parse(calCurrVal));
                    }
                }
            }
            /* eslint-enable @typescript-eslint/no-explicit-any */
        });
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
