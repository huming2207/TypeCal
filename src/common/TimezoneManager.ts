import { MSTimezoneLUT } from './MSTimezoneLut';

export class TimezoneManager {
    private static instance: TimezoneManager;
    private _defaultTimezone: string;

    public get defaultTimezone(): string {
        return this._defaultTimezone;
    }

    public set defaultTimezone(value: string) {
        if (!this.msMode) {
            this._defaultTimezone = value;
        } else {
            const lutResult = MSTimezoneLUT.get(value);
            this._defaultTimezone = lutResult === undefined ? 'Etc/GMT' : lutResult;
        }
    }

    private _msMode: boolean;

    public get msMode(): boolean {
        return this._msMode;
    }

    public set msMode(value: boolean) {
        this._msMode = value;
    }

    private constructor() {
        this._defaultTimezone = 'Asia/Beijing';
        this._msMode = false;
    }

    public static getInstance = (): TimezoneManager => {
        if (!TimezoneManager.instance) {
            TimezoneManager.instance = new TimezoneManager();
        }
        return TimezoneManager.instance;
    };
}
