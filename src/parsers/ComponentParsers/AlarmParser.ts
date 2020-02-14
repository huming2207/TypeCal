import { ComponentParser } from './ComponentParser';
import { AlarmComponent } from '../../components/AlarmComponent';
import { StringParser } from '../ValueParsers/StringParser';
import { NumberParser } from '../ValueParsers/NumberParser';

export class AlarmParser extends ComponentParser<AlarmComponent> {
    private stringParser = new StringParser();
    private numberParser = new NumberParser();

    public parseComponent = (rawStr: string): AlarmComponent => {
        const unwrapStr = rawStr.replace(/\n\s/gm, '');

        const alarmComponent = new AlarmComponent();
        return alarmComponent;
    };
}
