import { autoserializeAs } from 'cerialize';

export class CalendarComponent {
    @autoserializeAs('productId')
    private _prodId = '';

    public get prodId(): string {
        return this._prodId;
    }

    public set prodId(value) {
        this._prodId = value;
    }

    @autoserializeAs('version')
    private _version = '';

    public get version(): string {
        return this._version;
    }

    public set version(value) {
        this._version = value;
    }

    @autoserializeAs('scale')
    private _calScale = '';

    public get calScale(): string {
        return this._calScale;
    }

    public set calScale(value) {
        this._calScale = value;
    }

    @autoserializeAs('method')
    private _method = '';

    public get method(): string {
        return this._method;
    }

    public set method(value) {
        this._method = value;
    }
}
