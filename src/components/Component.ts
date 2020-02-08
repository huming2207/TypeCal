export enum ComponentType {
    Event = 'VEVENT',
    Alarm = 'VALARM',
    Todo = 'VTODO',
    FreeBusy = 'VFREEBUSY',
    Journal = 'VJOURNAL',
    Timezone = 'VTIMEZONE',
}

export interface Component {
    parseComponent(rawStr: string): void;
}
