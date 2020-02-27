import { JournalComponent } from '../../components/JournalComponent';
import { ComponentParser } from './ComponentParser';
import { ComponentType } from '../../components/Component';
import { AlarmParser } from './AlarmParser';

export class TodoParser extends ComponentParser<JournalComponent> {
    private alarmParser = new AlarmParser();
    public parseComponent = (rawStr: string): JournalComponent => {
        const journalComponent = new JournalComponent();
        const unwrapStr = rawStr.replace(/\n\s/gm, '');

        // Try find and parse VALARMs in this VEVENT
        if (rawStr.includes('BEGIN:VALARM') && rawStr.includes('END:VALARM')) {
            const rawAlarmResult = ComponentParser.findComponents(rawStr, ComponentType.Alarm);
            for (const rawAlarmStr of rawAlarmResult.components) {
                journalComponent.alarms.push(this.alarmParser.parseComponent(rawAlarmStr));
            }
        }

        this.writeKvPairsToObj(journalComponent, ComponentParser.strToKvPairs(unwrapStr));
        return journalComponent;
    };
}
