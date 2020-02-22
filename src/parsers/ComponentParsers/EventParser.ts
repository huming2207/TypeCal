import { EventComponent } from '../../components/EventComponent';
import { ComponentParser } from './ComponentParser';
import { StringParser } from '../ValueParsers/StringParser';
import { NumberParser } from '../ValueParsers/NumberParser';
import { DateTimeParser } from '../ValueParsers/DateTimeParser';
import { CalAddressParser } from '../ValueParsers/CalAddressParser';
import { ComponentType } from '../../components/Component';
import { AlarmParser } from './AlarmParser';

export class EventParser extends ComponentParser<EventComponent> {
    private stringParser = new StringParser();
    private numberParser = new NumberParser();
    private dateTimeParser = new DateTimeParser();
    private calAddrParser = new CalAddressParser();
    private alarmParser = new AlarmParser();

    public parseComponent = (rawStr: string): EventComponent => {
        const eventComponent = new EventComponent();
        const unwrapStr = rawStr.replace(/\n\s/gm, '');

        // Try find and parse VALARMs in this VEVENT
        if (rawStr.includes('BEGIN:VALARM') && rawStr.includes('END:VALARM')) {
            const rawAlarmStrs = ComponentParser.findComponents(rawStr, ComponentType.Alarm);
            for (const rawAlarmStr of rawAlarmStrs) {
                eventComponent.alarms.push(this.alarmParser.parseComponent(rawAlarmStr));
            }
        }

        const kvPair = ComponentParser.strToKvPairs(unwrapStr);
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
