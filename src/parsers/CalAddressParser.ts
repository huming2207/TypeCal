import { SubParser } from './SubParser';
import { CalAddress } from '../properties/CalAddress';

export class CalAddressParser implements SubParser<CalAddress> {
    public parse = (rawStr: string): CalAddress => {
        const itemStrs = rawStr.match(/(\\.|[^;])+/g);
        if (itemStrs === null) throw new SyntaxError(`Seems like it's not a CalAddress type: ${rawStr}`);
        const itemKV = new Map<string, string>();
        for (const itemStr of itemStrs) {
            const item = itemStr.split('=');
            if (item.length != 2) {
                throw new SyntaxError(`Invalid item length: ${itemStr}, ${item}`);
            }
            itemKV.set(item[0], item[1]);
        }

        const calAddr = new CalAddress();

        /* eslint-disable @typescript-eslint/no-explicit-any */
        Object.keys(calAddr).forEach(key => {
            if (!key.startsWith('_')) return;

            const calKey = key.substring(1).toUpperCase();
            const calVal = itemKV.get(calKey);
            if (calVal === undefined) return;

            if (typeof (this as any)[key] === 'string') {
                (this as any)[key] = calVal;
            }
        });
        /* eslint-enable @typescript-eslint/no-explicit-any */

        return calAddr;
    };

    public propNames = ['ATTENDEE', 'ORGANIZER'];
}
