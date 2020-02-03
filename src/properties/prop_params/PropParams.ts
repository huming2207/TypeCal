import { RoleLevel } from './Role';
import { ClassLevel } from './Classification';
import { EncodeType } from './Encoding';
import { ParticipateLevel } from './Participation';

export abstract class PropParams<T extends string | RoleLevel | ClassLevel | EncodeType | ParticipateLevel> {
    protected _level: T;
    protected constructor(level: T) {
        this._level = level;
    }

    public get value(): T {
        return this._level;
    }

    public set value(value: T) {
        this._level = value;
    }

    public abstract parse(pairStr: string): boolean;
}
