import { ValueParser } from './ValueParser';

export class NumberParser implements ValueParser<number> {
    public parse = (rawStr: string): number => {
        return Number(rawStr);
    };

    public propNames = ['PERCENT-COMPLETE', 'PRIORITY'];
}
