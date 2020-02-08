import { CalAddress } from '../properties/CalAddress';

export class EventComponent {
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
}
