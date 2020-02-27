import { autoserializeAs, inheritSerialization } from 'cerialize';
import { DateSerializer } from '../common/DateSerializer';
import { BaseComponent } from './Component';

@inheritSerialization(BaseComponent)
export class TodoComponent extends BaseComponent {
    @autoserializeAs(DateSerializer, 'completed')
    private _completed: Date = new Date('unknown');

    @autoserializeAs(DateSerializer, 'due')
    private _due: Date = new Date('unknown');

    @autoserializeAs(DateSerializer, 'duration')
    private _duration: Date = new Date('unknown');

    public get completed(): Date {
        return this._completed;
    }
    public set completed(value: Date) {
        this._completed = value;
    }

    public get due(): Date {
        return this._due;
    }
    public set due(value: Date) {
        this._due = value;
    }

    public get duration(): Date {
        return this._duration;
    }
    public set duration(value: Date) {
        this._duration = value;
    }
}
