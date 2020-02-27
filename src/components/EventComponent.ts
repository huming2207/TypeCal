import { autoserializeAs, inheritSerialization } from 'cerialize';
import { DateSerializer } from '../common/DateSerializer';
import { BaseComponent } from './Component';

@inheritSerialization(BaseComponent)
export class EventComponent extends BaseComponent {
    @autoserializeAs(DateSerializer, 'dtEnd')
    private _dtEnd: Date = new Date('unknown');

    public get endTime(): Date {
        return this._dtEnd;
    }

    public set endTime(val: Date) {
        this._dtEnd = val;
    }
}
