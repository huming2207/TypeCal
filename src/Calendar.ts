import { autoserializeAs } from 'cerialize';
import { EventComponent } from './components/EventComponent';

export class Calendar {
    @autoserializeAs('events')
    public events: EventComponent[] = [];

    @autoserializeAs('timezone')
    public timezone = '';

    @autoserializeAs('productId')
    public productId = '';
}
