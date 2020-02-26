import { ComponentParser } from './ComponentParser';
import { AlarmComponent } from '../../components/AlarmComponent';
import { DurationParser } from '../ValueParsers/DurationParser';

export class AlarmParser extends ComponentParser<AlarmComponent> {
    private durationParser = new DurationParser();

    public parseComponent = (rawStr: string): AlarmComponent => {
        const unwrapStr = rawStr.replace(/\n\s/gm, '');
        const kvPair = ComponentParser.strToKvPairs(unwrapStr);

        const alarmComponent = new AlarmComponent();
        Object.keys(alarmComponent).forEach((key: string) => {
            if (!key.startsWith('_')) return;

            const calKey = key.substring(1).toUpperCase();
            const calVal = kvPair.get(calKey);
            if (calVal === undefined) return;

            /* eslint-disable @typescript-eslint/no-explicit-any */
            if (typeof (alarmComponent as any)[key] === 'string') {
                (alarmComponent as any)[key] = this.stringParser.parse(calVal[0]);
            } else if (typeof (alarmComponent as any)[key] === 'number') {
                (alarmComponent as any)[key] = this.numberParser.parse(calVal[0]);
            } else if (typeof (alarmComponent as any)[key] === 'object') {
                if (this.durationParser.propNames.includes(calKey)) {
                    (alarmComponent as any)[key] = this.durationParser.parse(calVal[0]);
                }
            }
            /* eslint-enable @typescript-eslint/no-explicit-any */
        });

        return alarmComponent;
    };
}
