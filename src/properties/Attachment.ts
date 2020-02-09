import { serializeAs } from 'cerialize';

export class Attachment {
    @serializeAs('mimeType')
    private _mimeType = '';

    public get mimeType(): string {
        return this._mimeType;
    }

    public set mimeType(value) {
        this._mimeType = value;
    }

    @serializeAs('url')
    private _url = '';

    public get url(): string {
        return this._url;
    }

    public set url(value) {
        this._url = value;
    }
}
