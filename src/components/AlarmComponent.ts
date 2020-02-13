import { CalDuration } from '../properties/CalDuration';
import { serializeAs } from 'cerialize';

export class AlarmComponent {
    @serializeAs('trigger')
    private _trigger: CalDuration = new CalDuration();

    public get trigger(): CalDuration {
        return this._trigger;
    }

    public set trigger(value: CalDuration) {
        this._trigger = value;
    }

    @serializeAs('repeat')
    private _repeat = 0;

    public get repeat(): number {
        return this._repeat;
    }

    public set repeat(value: number) {
        this._repeat = value;
    }

    @serializeAs('duration')
    private _duration: CalDuration = new CalDuration();

    public get duration(): CalDuration {
        return this._duration;
    }

    public set duration(value: CalDuration) {
        this._duration = value;
    }

    @serializeAs('action')
    private _action = '';

    public get action(): string {
        return this._action;
    }

    public set action(value: string) {
        this._action = value;
    }

    @serializeAs('description')
    private _description = '';

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }
}
