import { ComponentParser } from './ComponentParser';
import { TimezoneComponent } from '../../components/TimezoneComponent';

export class TimezoneParser extends ComponentParser<TimezoneComponent> {
    public parseComponent = (rawStr: string): TimezoneComponent => {
        const tzComponent = new TimezoneComponent();
        const result = rawStr.match(/(?<=TZID\:)(.*)/gm);
        if (result === null || result.length > 1) {
            throw new SyntaxError('Cannot find TZID in this VTIMEZONE section');
        }

        tzComponent.tzid = result[0];
        return tzComponent;
    };
}
