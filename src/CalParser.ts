import { ComponentType } from './components/Component';
import { EventComponent } from './components/EventComponent';
import { EventParser } from './parsers/ComponentParsers/EventParser';
import { Serialize, serializeAs } from 'cerialize';

export class CalParser {
    @serializeAs('events')
    private _events: EventComponent[] = [];

    private findComponents = (rawStr: string, type: ComponentType): string[] => {
        let beginIndex = 0;
        let endIndex = 0;
        const beginStr = `BEGIN:${type}`;
        const endStr = `END:${type}`;
        const rawComponents: string[] = [];

        while (beginIndex != -1 && endIndex != -1) {
            beginIndex = rawStr.indexOf(beginStr, beginIndex + 1) + beginStr.length;
            endIndex = rawStr.indexOf(endStr, endIndex + 1);
            rawComponents.push(rawStr.substring(beginIndex + 1, endIndex));
        }

        return rawComponents;
    };

    public parseCal = (str: string): void => {
        const lfStr = str.replace('\r', '');
        const eventParser = new EventParser();
        const vevents = this.findComponents(lfStr, ComponentType.Event);
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
