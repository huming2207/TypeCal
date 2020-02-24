import { CalAddress } from '../properties/CalAddress';
import { AlarmComponent } from './AlarmComponent';
import { autoserializeAs } from 'cerialize';
import { DateSerializer } from '../common/DateSerializer';

export enum ComponentType {
    Event = 'VEVENT',
    Alarm = 'VALARM',
    Todo = 'VTODO',
    FreeBusy = 'VFREEBUSY',
    Journal = 'VJOURNAL',
    Timezone = 'VTIMEZONE',
}

export abstract class BaseComponent {
    @autoserializeAs('uid')
    private _uid = '';

    @autoserializeAs(DateSerializer, 'dtStamp')
    private _dtStamp: Date = new Date('unknown');

    @autoserializeAs(DateSerializer, 'dtStart')
    private _dtStart: Date = new Date('unknown');

    @autoserializeAs('summary')
    private _summary = '';

    @autoserializeAs('class')
    private _class = '';

    @autoserializeAs('categories')
    private _categories = '';

    @autoserializeAs('trasp')
    private _transp = '';

    @autoserializeAs('location')
    private _location = '';

    @autoserializeAs('attendees')
    private _attendee: CalAddress[] = [];

    @autoserializeAs('alarms')
    private alarms_: AlarmComponent[] = [];

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

    public get attendees(): CalAddress[] {
        return this._attendee;
    }

    public set attendees(val: CalAddress[]) {
        this._attendee = val;
    }

    public get alarms(): AlarmComponent[] {
        return this.alarms_;
    }

    public set alarms(val: AlarmComponent[]) {
        this.alarms_ = val;
    }
}
