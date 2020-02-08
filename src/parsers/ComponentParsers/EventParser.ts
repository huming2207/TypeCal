import { EventComponent } from '../../components/EventComponent';
import { ComponentParser } from './ComponentParser';
import { StringHelper } from '../../common/StringHelper';
import { StringParser } from '../ValueParsers/StringParser';
import { NumberParser } from '../ValueParsers/NumberParser';
import { DateTimeParser } from '../ValueParsers/DateTimeParser';
import { CalAddressParser } from '../ValueParsers/CalAddressParser';

export class EventParser implements ComponentParser<EventComponent> {
    private stringParser = new StringParser();
    private numberParser = new NumberParser();
    private dateTimeParser = new DateTimeParser();
    private calAddrParser = new CalAddressParser();

    public parseComponent = (rawStr: string): EventComponent => {
        const unwrapStr = rawStr.replace(/\n\s/gm, '');
        const lines = StringHelper.splitNonEmpty(unwrapStr, '\n');
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

        const eventComponent = new EventComponent();
        Object.keys(eventComponent).forEach((key: string) => {
            if (!key.startsWith('_')) return;

            const calKey = key.substring(1).toUpperCase();
            const calVal = kvPair.get(calKey);
            if (calVal === undefined) return;

            /* eslint-disable @typescript-eslint/no-explicit-any */
            if (typeof (eventComponent as any)[key] === 'string') {
                (eventComponent as any)[key] = this.stringParser.parse(calVal[0]);
            } else if (typeof (eventComponent as any)[key] === 'number') {
                (eventComponent as any)[key] = this.numberParser.parse(calVal[0]);
            } else if (typeof (eventComponent as any)[key] === 'object') {
                if (this.dateTimeParser.propNames.includes(calKey)) {
                    (eventComponent as any)[key] = this.dateTimeParser.parse(calVal[0]);
                } else if (this.calAddrParser.propNames.includes(calKey)) {
                    for (const calCurrVal of calVal) {
                        (eventComponent as any)[key].push(this.calAddrParser.parse(calCurrVal));
                    }
                }
            }
            /* eslint-enable @typescript-eslint/no-explicit-any */
        });

        return eventComponent;
    };
}
