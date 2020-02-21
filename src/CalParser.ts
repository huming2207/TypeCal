import { ComponentType } from './components/Component';
import { EventParser } from './parsers/ComponentParsers/EventParser';
import { Serialize } from 'cerialize';
import { ComponentParser } from './parsers/ComponentParsers/ComponentParser';
import omitEmpty from 'omit-empty';
import { Calendar } from './Calendar';
import { DateTime } from 'luxon';

export class CalParser {
    public calendar: Calendar = new Calendar();

    public parseCal = (str: string): void => {
        const lfStr = str.replace('\r', '');
        // Find default timezone
        this.findDefaultTimezone(str);

        // Find out events
        const eventParser = new EventParser();
        const vevents = ComponentParser.findComponents(lfStr, ComponentType.Event);
        for (const vevent of vevents) {
            setImmediate(() => {
                this.calendar.events.push(eventParser.parseComponent(vevent));
            });
        }
    };

    public toJson = (): string => {
        const serialized = Serialize(this.calendar);
        return JSON.stringify(omitEmpty(serialized, { omitZero: false }));
    };

    private findDefaultTimezone = (str: string): void => {
        // Find default timezone (if exists)
        const tzResult = str.match(/(((?<=\nTZID\:) | (?<=\nTZID\;VALUE\=TEXT\:) | (?<=\nX-WR-TIMEZONE\:) | (?<=\nX-WR-TIMEZONE\;VALUE\=TEXT\:))(.*))/);
        if (tzResult !== null && DateTime.local().setZone(tzResult[0]).isValid) {
            this.calendar.timezone = tzResult[0];
        } else {
            this.calendar.timezone = null;
        }
    };
}
