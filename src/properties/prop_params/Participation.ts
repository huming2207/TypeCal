import { PropParams } from './PropParams';
import { $enum } from 'ts-enum-util';

export enum ParticipateLevel {
    NeedsAction = 'NEEDS-ACTION',
    Accepted = 'ACCEPTED',
    Declined = 'DECLINED',
    Tentative = 'TENTATIVE',
    Delegated = 'DELEGATED',
    Completed = 'COMPLETED',
    InProcess = 'IN-PROCESS',
    Unknown = '',
}

export class Participation extends PropParams<ParticipateLevel> {
    public constructor() {
        super(ParticipateLevel.Unknown);
    }

    public parse(pairStr: string): boolean {
        const pairKV = pairStr.split('=');
        if (pairKV[0] == 'ROLE') {
            this._level = $enum(ParticipateLevel).getValueOrDefault(pairKV[1], ParticipateLevel.Unknown);
            return true;
        } else {
            return false;
        }
    }
}
