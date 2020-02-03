import { PropParams } from './PropParams';
import { $enum } from 'ts-enum-util';

export enum TransparentLevel {
    Opaque = 'OPAQUE',
    Transparent = 'TRANSPARENT',
    Unknown = '',
}

export class Transparency extends PropParams<TransparentLevel> {
    public constructor() {
        super(TransparentLevel.Unknown);
    }

    public parse(pairStr: string): boolean {
        const pairKV = pairStr.split('=');
        if (pairKV[0] == 'ROLE') {
            this._level = $enum(TransparentLevel).getValueOrDefault(pairKV[1], TransparentLevel.Unknown);
            return true;
        } else {
            return false;
        }
    }
}
