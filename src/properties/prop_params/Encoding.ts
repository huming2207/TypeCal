import { PropParams } from './PropParams';
import { $enum } from 'ts-enum-util';

export enum EncodeType {
    EightBit = '8BIT',
    Base64 = 'BASE64',
    Unknown = '',
}

export class Encoding extends PropParams<EncodeType> {
    public constructor() {
        super(EncodeType.Unknown);
    }

    public parse(pairStr: string): boolean {
        const pairKV = pairStr.split('=');
        if (pairKV[0] == 'ENCODING') {
            this._level = $enum(EncodeType).getValueOrDefault(pairKV[1], EncodeType.Unknown);
            return true;
        } else {
            return false;
        }
    }
}
