import { PropParams } from './PropParams';
import { $enum } from 'ts-enum-util';

export enum RoleLevel {
    Chair = 'CHAIR',
    ReqiredParticipant = 'REQ-PARTICIPANT',
    OptionalParticipant = 'OPT-PARTICIPANT',
    NonParticipant = 'NON-PARTICIPANT',
    Unknown = '',
}

export class Role extends PropParams<RoleLevel> {
    public constructor() {
        super(RoleLevel.Unknown);
    }

    public parse(pairStr: string): boolean {
        const pairKV = pairStr.split('=');
        if (pairKV[0] == 'ROLE') {
            this._level = $enum(RoleLevel).getValueOrDefault(pairKV[1], RoleLevel.Unknown);
            return true;
        } else {
            return false;
        }
    }
}
