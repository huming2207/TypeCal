import { StringParser } from '../parsers/StringParser';
import { DateTimeParser } from '../parsers/DateTimeParser';
import { StringHelper } from '../common/StringHelper';
import { NumberParser } from '../parsers/NumberParser';
import { CalAddress } from '../properties/CalAddress';
import { CalAddressParser } from '../parsers/CalAddressParser';
import { Component } from './Component';

export class EventComponent implements Component {
    private _uid = '';
    private _dtStamp: Date = new Date('invalid');
    private _dtStart: Date = new Date('invalid');
    private _dtEnd: Date = new Date('invalid');
    private _summary = '';
    private _class = '';
    private _categories = '';
    private _transp = '';
    private _location = '';
    private _attendee: CalAddress[] = [];

    private stringParser = new StringParser();
    private numberParser = new NumberParser();
    private dateTimeParser = new DateTimeParser();
    private calAddrParser = new CalAddressParser();

    public get uid(): string {
        return this._uid;
    }

    public set uid(val: string) {
        this._uid = val;
    }

    public get summary(): string {
        return this._summary;
    }

    public set summary(val: string) {
        this._summary = val;
    }

    public get classification(): string {
        return this._class;
    }

    public set classification(val: string) {
        this._class = val;
    }

    public get categories(): string {
        return this._categories;
    }

    public set categories(val: string) {
        this._categories = val;
    }

    public get transparency(): string {
        return this._transp;
    }

    public set transparency(val: string) {
        this._transp = val;
    }

    public get location(): string {
        return this._location;
    }

    public set location(val: string) {
        this._location = val;
    }

    public get creationTime(): Date {
        return this._dtStamp;
    }

    public set creationTime(val: Date) {
        this._dtStamp = val;
    }

    public get startTime(): Date {
        return this._dtStart;
    }

    public set startTime(val: Date) {
        this._dtStart = val;
    }

    public get endTime(): Date {
        return this._dtEnd;
    }

    public set endTime(val: Date) {
        this._dtEnd = val;
    }

    public parseComponent = (rawStr: string): void => {
        const unwrapStr = rawStr.replace(/\n\s/gm, '');
        const lines = StringHelper.splitNonEmpty(unwrapStr, '\n');
        const kvPair = new Map<string, string[]>();
        for (const currLine of lines) {
            // Split from something like "UID:foobar:baz" to "UID" and "foobar:baz"
            const key = currLine.split(/\;|\:/g, 1)[0];
            const val = currLine.substring(currLine.indexOf(key) + key.length + 1);
            const valInMap = kvPair.get(key);

            // In case some keys (e.g. ANTENDEE) are duplicated...
            if (valInMap === undefined) {
                kvPair.set(key, [val]);
            } else {
                valInMap.push(val);
                kvPair.set(key, valInMap);
            }
        }

        Object.keys(this).forEach((key: string) => {
            if (!key.startsWith('_')) return;

            const calKey = key.substring(1).toUpperCase();
            const calVal = kvPair.get(calKey);
            if (calVal === undefined) return;

            /* eslint-disable @typescript-eslint/no-explicit-any */
            if (typeof (this as any)[key] === 'string') {
                (this as any)[key] = this.stringParser.parse(calVal[0]);
            } else if (typeof (this as any)[key] === 'number') {
                (this as any)[key] = this.numberParser.parse(calVal[0]);
            } else if (typeof (this as any)[key] === 'object') {
                if (this.dateTimeParser.propNames.includes(calKey)) {
                    (this as any)[key] = this.dateTimeParser.parse(calVal[0]);
                } else if (this.calAddrParser.propNames.includes(calKey)) {
                    for (const calCurrVal of calVal) {
                        (this as any)[key].push(this.calAddrParser.parse(calCurrVal));
                    }
                }
            }
            /* eslint-enable @typescript-eslint/no-explicit-any */
        });
    };

    constructor(rawStr = '') {
        if (rawStr.length > 0) this.parseComponent(rawStr);
    }
}
