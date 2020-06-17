import { ValueParser } from './ValueParser';
import { CalAddress } from '../../properties/CalAddress';

export class CalAddressParser implements ValueParser<CalAddress> {
    public parse = (rawStr: string): CalAddress => {
        const itemStrs = rawStr.match(/(\\.|[^;])+/g);
        if (itemStrs === null) throw new SyntaxError(`Seems like it's not a CalAddress type: ${rawStr}`);
        const itemKV: { [key: string]: string } = {};
        for (const itemStr of itemStrs) {
            const item = itemStr.split('=');
            if (item.length < 2) {
                itemKV['CN'] = item[0]; // For some scenarios like "ATTENDEE:mailto:xyz@foobar.com"
            } else {
                itemKV[item[0]] = item[1];
            }
        }

        const calAddr = new CalAddress();

        /* eslint-disable @typescript-eslint/no-explicit-any */
        Object.keys(calAddr).forEach((key) => {
            if (!key.startsWith('_')) return;

            const calKey = key.substring(1).toUpperCase();
            const calVal = itemKV[calKey];
            if (calVal === undefined) return;

            if (typeof (calAddr as any)[key] === 'string') {
                (calAddr as any)[key] = calVal;
            }
        });
        /* eslint-enable @typescript-eslint/no-explicit-any */

        return calAddr;
    };

    public propNames = ['ATTENDEE', 'ORGANIZER'];
}
