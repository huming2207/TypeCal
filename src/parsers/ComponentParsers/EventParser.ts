import { EventComponent } from '../../components/EventComponent';
import { ComponentParser } from './ComponentParser';
import { StringParser } from '../ValueParsers/StringParser';
import { NumberParser } from '../ValueParsers/NumberParser';
import { DateTimeParser } from '../ValueParsers/DateTimeParser';
import { CalAddressParser } from '../ValueParsers/CalAddressParser';

export class EventParser extends ComponentParser<EventComponent> {
    private stringParser = new StringParser();
    private numberParser = new NumberParser();
    private dateTimeParser = new DateTimeParser();
    private calAddrParser = new CalAddressParser();

    public parseComponent = (rawStr: string): EventComponent => {
        const unwrapStr = rawStr.replace(/\n\s/gm, '');
        const kvPair = EventParser.strToKvPairs(unwrapStr);

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
