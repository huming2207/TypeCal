import { ComponentType } from './components/ComponentType';
import { EventComponent } from './EventComponent';

export class CalParser {
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
        const vevents = this.findComponents(lfStr, ComponentType.Event);
        for (const vevent of vevents) {
            this._events.push(new EventComponent(vevent));
        }
    };

    public get events(): EventComponent {
        return this.events;
    }
}
