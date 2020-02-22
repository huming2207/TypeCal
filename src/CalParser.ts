import { ComponentType } from './components/Component';
import { EventParser } from './parsers/ComponentParsers/EventParser';
import { Serialize } from 'cerialize';
import { ComponentParser } from './parsers/ComponentParsers/ComponentParser';
import omitEmpty from 'omit-empty';
import { Calendar } from './Calendar';
import { DateTime } from 'luxon';
import axios from 'axios';
import { MSTimezoneLUT } from './common/MSTimezoneLut';
import { ReadStream } from 'fs';
import { ParseState } from './common/ParseState';

export class CalParser {
    public calendar: Calendar = new Calendar();
    private microsoftTz = false;
    private parseState: ParseState = ParseState.ParseInit;

    public parseCal = (str: string): void => {
        const lfStr = str.replace('\r', '');
        // Get product ID
        this.findProductId(lfStr);

        // Find default timezone
        this.findDefaultTimezone(lfStr);

        // Find out events
        const eventParser = new EventParser();
        const vevents = ComponentParser.findComponents(lfStr, ComponentType.Event);
        for (const vevent of vevents) {
            this.calendar.events.push(eventParser.parseComponent(vevent));
        }
    };

    public fromURL = async (url: string): Promise<void> => {
        let cachedStr = '';
        const resp = await axios.get(url, { responseType: 'stream' }).catch(err => {
            throw err;
        });

        const eventParser = new EventParser();
        const respStream = resp.data as ReadStream;
        return new Promise<void>((resolve, reject) => {
            respStream.on('data', async (chunk: Buffer) => {
                cachedStr += chunk.toString();
                cachedStr = cachedStr.replace(/\r\n/g, '\n');
                switch (this.parseState) {
                    case ParseState.ParseInit: {
                        this.parseState = ParseState.ProductId;
                        break;
                    }

                    case ParseState.ProductId: {
                        if (this.findProductId(cachedStr)) {
                            this.parseState = ParseState.DefaultTz;
                        } else {
                            this.parseState = ParseState.ParseError;
                        }
                        break;
                    }

                    case ParseState.DefaultTz: {
                        if (this.findDefaultTimezone(cachedStr)) {
                            this.parseState = ParseState.Event;
                        } else {
                            this.parseState = ParseState.ParseError;
                        }
                        break;
                    }

                    case ParseState.Event: {
                        if (!ComponentParser.hasBegin(cachedStr, ComponentType.Event)) break; // Just repeat again if there's no BEGIN:VEVENT found
                        const vevents = ComponentParser.findComponents(cachedStr, ComponentType.Event);
                        for (const vevent of vevents) {
                            this.calendar.events.push(eventParser.parseComponent(vevent));
                        }

                        cachedStr = cachedStr.substring(ComponentParser.lastParsedEnd(cachedStr, ComponentType.Event));
                        break;
                    }

                    case ParseState.Todo: {
                        break;
                    }

                    case ParseState.ParseError: {
                        reject(new Error('Default timezone or product ID not found'));
                    }
                }
            });

            respStream.on('end', () => {
                this.parseState = ParseState.Done;
                resolve();
            });
        });
    };

    public toJSON = (): string => {
        const serialized = Serialize(this.calendar);
        return JSON.stringify(omitEmpty(serialized, { omitZero: false }));
    };

    private findProductId = (str: string): boolean => {
        const pidResult = str.match(/(?<=\nPRODID\:)(.*)/);
        if (pidResult !== null) {
            this.calendar.productId = pidResult[0];
            this.microsoftTz = this.calendar.productId.includes('Microsoft Exchange Server'); // Use M$'s style timezone LUT
            return true;
        } else {
            return false;
        }
    };

    private findDefaultTimezone = (str: string): boolean => {
        // Find default timezone (if exists)
        const tzResult = str.match(/(((?<=\nTZID\:)|(?<=\nTZID\;VALUE\=TEXT\:)|(?<=\nX-WR-TIMEZONE\:)|(?<=\nX-WR-TIMEZONE\;VALUE\=TEXT\:))(.*))/);
        if (tzResult !== null && DateTime.local().setZone(tzResult[0]).isValid) {
            this.calendar.timezone = this.microsoftTz ? MSTimezoneLUT.get(tzResult[0].replace('"', '')) : tzResult[0].replace('"', '');
            return true;
        } else {
            return false;
        }
    };
}
