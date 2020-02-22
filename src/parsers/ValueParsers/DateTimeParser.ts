import { ValueParser } from './ValueParser';
import { DateTime } from 'luxon';
import { TimezoneManager } from '../../common/TimezoneManager';
import { MSTimezoneLUT } from '../../common/MSTimezoneLut';

export class DateTimeParser implements ValueParser<Date> {
    public parse = (rawStr: string): Date => {
        if (rawStr.includes('VALUE=DATE:')) {
            return this.parseDtWithDateOnly(rawStr);
        } else if (rawStr.includes('TZID')) {
            return this.parseDtWithTzid(rawStr);
        } else if (/\d+T\d+Z/.test(rawStr)) {
            return this.parseDtWithUtc(rawStr);
        } else {
            return this.parseDtWithFloating(rawStr);
        }
    };

    private parseDtWithDateOnly = (rawStr: string): Date => {
        // Parse date-only scenario, e.g. something like "DTEND;VALUE=DATE:19980704"
        const dateStr = rawStr.split(':');
        return DateTime.fromFormat(dateStr[dateStr.length - 1], 'yyyyMMdd').toJSDate();
    };

    private parseDtWithTzid = (rawStr: string): Date => {
        // If TZID exists, read timezone from TZID
        const tzManager = TimezoneManager.getInstance();
        const tzid = rawStr.match(/(?<=TZID\=)(.*)(?=\:)/gm); // Take out the value between "TZID=" and ":"
        if (tzid === null) throw SyntaxError(`Cannot parse DateTime property: ${rawStr}, invalid TZID.`);
        if (!tzManager.msMode) {
            const tzidStr = tzid[0].replace('-', '/'); // Replace some old-school TZID value like "US-Eastern"
            const dateStr = rawStr.split(':');
            return DateTime.fromFormat(dateStr[dateStr.length - 1], "yyyyMMdd'T'HHmmss", { zone: tzidStr, setZone: true }).toJSDate();
        } else {
            const tzidStr = MSTimezoneLUT.get(tzid[0]);
            if (!tzidStr) throw SyntaxError(`Invalid Microsoft TZID: ${tzidStr}`);
            const dateStr = rawStr.split(':');
            return DateTime.fromFormat(dateStr[dateStr.length - 1], "yyyyMMdd'T'HHmmss", { zone: tzidStr, setZone: true }).toJSDate();
        }
    };

    private parseDtWithUtc = (rawStr: string): Date => {
        // For most of the scenarios, e.g. DTSTART:19970714T133000Z
        return DateTime.fromFormat(rawStr, "yyyyMMdd'T'HHmmss'Z'", { zone: 'UTC', setZone: true }).toJSDate();
    };

    private parseDtWithFloating = (rawStr: string): Date => {
        // For "floating timezone" scenarios e.g. DTSTART:19980116T061000
        const tzManager = TimezoneManager.getInstance();
        return DateTime.fromFormat(rawStr, "yyyyMMdd'T'HHmmss", { zone: tzManager.defaultTimezone, setZone: true }).toJSDate();
    };

    public propNames = ['DTEND', 'DUE', 'DTSTART', 'DURATION', 'LAST-MODIFIED', 'DTSTAMP'];
}
