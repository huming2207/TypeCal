export class CalAddress {
    private _cn = '';

    public get displayName(): string {
        return this._cn;
    }

    public set displayName(value: string) {
        this._cn = value;
    }

    private _cuType = '';

    public get calUserType(): string {
        return this._cuType;
    }

    public set calUserType(value: string) {
        this._cuType = value;
    }

    private _role = '';

    public get role(): string {
        return this._role;
    }

    public set role(value: string) {
        this._role = value;
    }

    private _partStat = '';

    public get partState(): string {
        return this._partStat;
    }

    public set partState(value: string) {
        this._partStat = value;
    }

    private _delegateFrom = '';

    public get delegateFrom(): string {
        return this._delegateFrom;
    }

    public set delegateFrom(value: string) {
        this._delegateFrom = value;
    }

    private _delegateTo = '';

    public get delegateTo(): string {
        return this._delegateTo;
    }

    public set delegateTo(value: string) {
        this._delegateTo = value;
    }

    private _sentBy = '';

    public get sentBy(): string {
        return this._sentBy;
    }

    public set sentBy(value: string) {
        this._sentBy = value;
    }

    private _member = '';

    public get member(): string {
        return this._member;
    }

    public set member(value: string) {
        this._member = value;
    }

    private _rsvp = '';

    public get rsvp(): string {
        return this._rsvp;
    }

    public set rsvp(value: string) {
        this._rsvp = value;
    }
}
