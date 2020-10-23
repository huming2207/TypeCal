import { serializeAs } from 'cerialize';
import { DateSerializer } from '../common/DateSerializer';

export class CalDuration {
    @serializeAs('durationSec')
    private _durationSec = NaN;

    public get durationSec(): number {
        return this._durationSec;
    }

    public set durationSec(value: number) {
        this._durationSec = value;
    }

    @serializeAs(DateSerializer, 'atDate')
    private _atDate = new Date('invalid');

    public get atDate(): Date {
        return this._atDate;
    }

    public set atDate(value: Date) {
        this._atDate = value;
    }

    @serializeAs('relatedTo')
    private _related = '';

    public get related(): string {
        return this._related;
    }

    public set related(value: string) {
        this._related = value;
    }
}
