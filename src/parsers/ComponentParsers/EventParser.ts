import { EventComponent } from '../../components/EventComponent';
import { ComponentParser } from './ComponentParser';
import { ComponentType } from '../../components/Component';
import { AlarmParser } from './AlarmParser';

export class EventParser extends ComponentParser<EventComponent> {
    private alarmParser = new AlarmParser();
    public parseComponent = (rawStr: string): EventComponent => {
        const eventComponent = new EventComponent();
        const unwrapStr = rawStr.replace(/\n\s/gm, '');

        // Try find and parse VALARMs in this VEVENT
        if (rawStr.includes('BEGIN:VALARM') && rawStr.includes('END:VALARM')) {
            const rawAlarmResult = ComponentParser.findComponents(rawStr, ComponentType.Alarm);
            for (const rawAlarmStr of rawAlarmResult.components) {
                eventComponent.alarms.push(this.alarmParser.parseComponent(rawAlarmStr));
            }
        }

        this.writeKvPairsToObj(eventComponent, ComponentParser.strToKvPairs(unwrapStr));
        return eventComponent;
    };
}
