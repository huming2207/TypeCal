import { ValueParser } from './ValueParser';

export class StringParser implements ValueParser<string> {
    public parse = (rawStr: string): string => {
        return rawStr
            .replace(/\\;/g, ';')
            .replace(/\\[nN]/g, '\n')
            .replace(/\\,/g, ',')
            .replace(/\\\\/g, '\\');
    };

    public propNames = ['UID', 'DESCRIPTION', 'CATEGORIES', 'CLASS', 'STATUS', 'SUMMARY'];
}
