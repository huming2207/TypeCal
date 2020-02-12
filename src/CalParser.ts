import { ComponentType } from './components/Component';
import { EventComponent } from './components/EventComponent';
import { EventParser } from './parsers/ComponentParsers/EventParser';
import { Serialize, serializeAs } from 'cerialize';
import { ComponentParser } from './parsers/ComponentParsers/ComponentParser';

export class CalParser {
    @serializeAs('events')
    private _events: EventComponent[] = [];

    public parseCal = (str: string): void => {
        const lfStr = str.replace('\r', '');
        const eventParser = new EventParser();
        const vevents = ComponentParser.findComponents(lfStr, ComponentType.Event);
        for (const vevent of vevents) {
            this._events.push(eventParser.parseComponent(vevent));
        }
    };

    public get events(): EventComponent[] {
        return this._events;
    }

    public toJson = (): string => {
        const serialized = Serialize(this._events);
        return JSON.stringify(serialized);
    };
}
