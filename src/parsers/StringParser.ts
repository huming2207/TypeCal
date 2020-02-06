import { SubParser } from './SubParser';

export class StringParser implements SubParser<string> {
    public parse = (rawStr: string): string => {
        return rawStr
            .replace(/\\;/g, ';')
            .replace(/\\[nN]/g, '\n')
            .replace(/\\,/g, ',')
            .replace(/\\\\/g, '\\');
    };

    public propNames = ['UID', 'DESCRIPTION', 'CATEGORIES', 'CLASS', 'STATUS', 'SUMMARY'];
}
