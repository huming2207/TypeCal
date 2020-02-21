import { ComponentType } from './components/Component';
import { EventParser } from './parsers/ComponentParsers/EventParser';
import { Serialize } from 'cerialize';
import { ComponentParser } from './parsers/ComponentParsers/ComponentParser';
import omitEmpty from 'omit-empty';
import { Calendar } from './Calendar';
import { DateTime } from 'luxon';
import { MSTimezoneLUT } from './common/MSTimezoneLut';

export class CalParser {
    public calendar: Calendar = new Calendar();
    private microsoftTz = false;

    public parseCal = (str: string): void => {
        const lfStr = str.replace('\r', '');
        // Get product ID
        this.findProductId(lfStr);

        // Find default timezone
        this.findDefaultTimezone(lfStr);

        // Find out events
        const eventParser = new EventParser();
        const vevents = ComponentParser.findComponents(lfStr, ComponentType.Event);
        for (const vevent of vevents) {
            this.calendar.events.push(eventParser.parseComponent(vevent));
        }
    };

    public toJSON = (): string => {
        const serialized = Serialize(this.calendar);
        return JSON.stringify(omitEmpty(serialized, { omitZero: false }));
    };

    private findProductId = (str: string): void => {
        const pidResult = str.match(/(?<=\nPRODID\:)(.*)/);
        if (pidResult !== null) {
            this.calendar.productId = pidResult[0];
        }

        this.microsoftTz = this.calendar.productId.includes('Microsoft Exchange Server'); // Use M$'s style timezone LUT
    };

    private findDefaultTimezone = (str: string): void => {
        // Find default timezone (if exists)
        const tzResult = str.match(/(((?<=\nTZID\:)|(?<=\nTZID\;VALUE\=TEXT\:)|(?<=\nX-WR-TIMEZONE\:)|(?<=\nX-WR-TIMEZONE\;VALUE\=TEXT\:))(.*))/);
        if (tzResult !== null && DateTime.local().setZone(tzResult[0]).isValid) {
            this.calendar.timezone = this.microsoftTz ? MSTimezoneLUT.get(tzResult[0].replace('"', '')) : tzResult[0].replace('"', '');
        }
    };
}
