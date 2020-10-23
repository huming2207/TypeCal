import { autoserializeAs } from 'cerialize';

export class TimezoneComponent {
    @autoserializeAs('tzid')
    private _tzid = '';

    public get tzid(): string {
        return this._tzid;
    }

    public set tzid(value: string) {
        this._tzid = value;
    }
}
