import { TodoComponent } from '../../components/TodoComponent';
import { ComponentParser } from './ComponentParser';
import { ComponentType } from '../../components/Component';
import { AlarmParser } from './AlarmParser';

export class TodoParser extends ComponentParser<TodoComponent> {
    private alarmParser = new AlarmParser();
    public parseComponent = (rawStr: string): TodoComponent => {
        const todoComponent = new TodoComponent();
        const unwrapStr = rawStr.replace(/\n\s/gm, '');

        // Try find and parse VALARMs in this VEVENT
        if (rawStr.includes('BEGIN:VALARM') && rawStr.includes('END:VALARM')) {
            const rawAlarmResult = ComponentParser.findComponents(rawStr, ComponentType.Alarm);
            for (const rawAlarmStr of rawAlarmResult.components) {
                todoComponent.alarms.push(this.alarmParser.parseComponent(rawAlarmStr));
            }
        }

        this.writeKvPairsToObj(todoComponent, ComponentParser.strToKvPairs(unwrapStr));
        return todoComponent;
    };
}
