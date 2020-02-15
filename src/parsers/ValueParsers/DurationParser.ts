import { CalDuration } from '../../properties/CalDuration';
import { ValueParser } from './ValueParser';
import { Duration, DateTime } from 'luxon';

export class DurationParser implements ValueParser<CalDuration> {
    public parse = (rawStr: string): CalDuration => {
        const calDuration = new CalDuration();
        if (rawStr.includes('RELATED=')) {
            // Scenario 1: Get RELATED string first if there's a RELATED value
            const related = rawStr.match(/(?<=RELATED\=)(.*)(?=\:)/gm);
            if (related === null) throw SyntaxError(`Cannot parse CalDuration property: ${rawStr}, invalid RELATED parameter.`);
            calDuration.related = related[0];
            const durationStr = rawStr.split(':', 2)[1];
            const duration = Duration.fromISO(durationStr)
                .shiftTo('seconds')
                .toObject().seconds;
            if (duration === undefined) throw SyntaxError(`Cannot parse CalDuration property: ${rawStr}, invalid duration.`);
            calDuration.durationSec = duration;
        } else if (rawStr.includes('VALUE=DATE-TIME')) {
            // Scenario 2: DateTime ISO8601 style
            const dateTime = DateTime.fromISO(rawStr.split(':', 2)[1], { zone: 'UTC', setZone: true });
            calDuration.atDate = dateTime.toJSDate();
        } else {
            // Scenario 3: Assume it's a duration-only scenario
            const neg = rawStr.startsWith('-');
            const durationStr = neg ? rawStr.substring(1) : rawStr;
            const duration = Duration.fromISO(durationStr)
                .shiftTo('seconds')
                .toObject();
            const durationSec = duration.seconds;
            if (durationSec === undefined) {
                throw SyntaxError(`Cannot parse CalDuration property: ${rawStr}, invalid duration.`);
            }
            calDuration.durationSec = neg ? durationSec * -1 : durationSec;
        }

        return calDuration;
    };

    public propNames = ['TRIGGER', 'DURATION'];
}
