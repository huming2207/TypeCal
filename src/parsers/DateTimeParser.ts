import { SubParser } from './SubParser';
import { DateTime } from 'luxon';

export class DateTimeParser implements SubParser<Date> {
    public parse = (rawStr: string): Date => {
        if (rawStr.includes(';VALUE=DATE:')) {
            // Parse date-only scenario, e.g. something like "DTEND;VALUE=DATE:19980704"
            const dateStr = rawStr.split(':');
            return DateTime.fromFormat(dateStr[dateStr.length - 1], 'yyyyMMdd').toJSDate();
        } else if (rawStr.includes('TZID')) {
            // If TZID exists, read timezone from TZID
            const tzid = rawStr.match(/(?<=TZID\=)(.*)(?=\:)/gm); // Take out the value between "TZID=" and ":"
            if (tzid === null) throw SyntaxError(`Cannot parse DateTime property: ${rawStr}, invalid TZID.`);
            const tzidStr = tzid[0].replace('-', '/'); // Replace some old-school TZID value like "US-Eastern"
            const dateStr = rawStr.split(':');
            return DateTime.fromFormat(dateStr[dateStr.length - 1], "yyyyMMdd'T'HHmmss", { zone: tzidStr, setZone: true }).toJSDate();
        } else if (/\d+T\d+Z/.test(rawStr)) {
            // For most of the scenarios, e.g. DTSTART:19970714T133000Z
            return DateTime.fromFormat(rawStr, "yyyyMMdd'T'HHmmss'Z'", { zone: 'UTC', setZone: true }).toJSDate();
        } else {
            // For "floating timezone" scenarios e.g. DTSTART:19980116T061000
            return DateTime.fromFormat(rawStr, "yyyyMMdd'T'HHmmss").toJSDate();
        }
    };

    public propNames = ['DTEND', 'DUE', 'DTSTART', 'DURATION', 'LAST-MODIFIED', 'DTSTAMP'];
}
