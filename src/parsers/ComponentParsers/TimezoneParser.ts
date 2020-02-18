import { ComponentParser } from './ComponentParser';
import { TimezoneComponent } from '../../components/TimezoneComponent';

export class TimezoneParser extends ComponentParser<TimezoneComponent> {
    public parseComponent = (rawStr: string): TimezoneComponent => {
        const tzComponent = new TimezoneComponent();
        return tzComponent;
    };
}
