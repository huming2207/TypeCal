import { PropParams } from './PropParams';
import { $enum } from 'ts-enum-util';

export enum ClassLevel {
    Public = 'PUBLIC',
    Private = 'PRIVATE',
    Confidential = 'CONFIDENTIAL',
    Unknown = '',
}

export class Classification extends PropParams<ClassLevel> {
    public constructor() {
        super(ClassLevel.Unknown);
    }

    public parse(pairStr: string): boolean {
        const pairKV = pairStr.split('=');
        if (pairKV[0] == 'CLASS') {
            this._level = $enum(ClassLevel).getValueOrDefault(pairKV[1], ClassLevel.Unknown);
            return true;
        } else {
            return false;
        }
    }
}
