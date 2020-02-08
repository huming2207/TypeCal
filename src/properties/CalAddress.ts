import { serializeAs } from 'cerialize';

export class CalAddress {
    @serializeAs('displayName')
    private _cn = '';

    public get displayName(): string {
        return this._cn;
    }

    public set displayName(value: string) {
        this._cn = value;
    }

    @serializeAs('calUserType')
    private _cuType = '';

    public get calUserType(): string {
        return this._cuType;
    }

    public set calUserType(value: string) {
        this._cuType = value;
    }

    @serializeAs('role')
    private _role = '';

    public get role(): string {
        return this._role;
    }

    public set role(value: string) {
        this._role = value;
    }

    @serializeAs('partState')
    private _partStat = '';

    public get partState(): string {
        return this._partStat;
    }

    public set partState(value: string) {
        this._partStat = value;
    }

    @serializeAs('delegateFrom')
    private _delegateFrom = '';

    public get delegateFrom(): string {
        return this._delegateFrom;
    }

    public set delegateFrom(value: string) {
        this._delegateFrom = value;
    }

    @serializeAs('delegateTo')
    private _delegateTo = '';

    public get delegateTo(): string {
        return this._delegateTo;
    }

    public set delegateTo(value: string) {
        this._delegateTo = value;
    }

    @serializeAs('sentBy')
    private _sentBy = '';

    public get sentBy(): string {
        return this._sentBy;
    }

    public set sentBy(value: string) {
        this._sentBy = value;
    }

    @serializeAs('member')
    private _member = '';

    public get member(): string {
        return this._member;
    }

    public set member(value: string) {
        this._member = value;
    }

    @serializeAs('rsvp')
    private _rsvp = '';

    public get rsvp(): string {
        return this._rsvp;
    }

    public set rsvp(value: string) {
        this._rsvp = value;
    }
}
