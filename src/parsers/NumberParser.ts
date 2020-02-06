import { SubParser } from './SubParser';

export class NumberParser implements SubParser<number> {
    public parse = (rawStr: string): number => {
        return Number(rawStr);
    };

    public propNames = ['PERCENT-COMPLETE', 'PRIORITY'];
}
