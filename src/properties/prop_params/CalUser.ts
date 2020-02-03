import { PropParams } from './PropParams';
import { $enum } from 'ts-enum-util';

export enum CalUserType {
    Invididual = 'INDIVIDUAL',
    Group = 'GROUP',
    Resource = 'RESOURCE',
    Room = 'ROOM',
    Unknown = 'UNKNOWN',
}

export class CalUser extends PropParams<CalUserType> {
    public constructor() {
        super(CalUserType.Unknown);
    }

    public parse(pairStr: string): boolean {
        const pairKV = pairStr.split('=');
        if (pairKV[0] == 'CUTYPE') {
            this._level = $enum(CalUserType).getValueOrDefault(pairKV[1], CalUserType.Unknown);
            return true;
        } else {
            return false;
        }
    }
}
