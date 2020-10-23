import { autoserializeAs } from 'cerialize';

export class Attachment {
    @autoserializeAs('mimeType')
    private _mimeType = '';

    public get mimeType(): string {
        return this._mimeType;
    }

    public set mimeType(value: string) {
        this._mimeType = value;
    }

    @autoserializeAs('url')
    private _url = '';

    public get url(): string {
        return this._url;
    }

    public set url(value: string) {
        this._url = value;
    }
}
