import { ComponentType } from './components/Component';
import { EventParser } from './parsers/ComponentParsers/EventParser';
import { Serialize } from 'cerialize';
import { ComponentParser } from './parsers/ComponentParsers/ComponentParser';
import omitEmpty from 'omit-empty';
import { Calendar } from './Calendar';
import { DateTime } from 'luxon';
import axios from 'axios';
import { MSTimezoneLUT } from './common/MSTimezoneLut';
import fs, { ReadStream } from 'fs';
import { TimezoneManager } from './common/TimezoneManager';

export class CalParser {
    public calendar: Calendar = new Calendar();

    public parseCal = (str: string): void => {
        const lfStr = str.replace(/\r\n/g, '\n');
        // Get product ID
        this.findProductId(lfStr);

        // Find default timezone
        this.findDefaultTimezone(lfStr);

        // Find out events
        const eventParser = new EventParser();
        const vevents = ComponentParser.findComponents(lfStr, ComponentType.Event);
        for (const vevent of vevents.components) {
            this.calendar.events.push(eventParser.parseComponent(vevent));
        }
    };

    public fromURL = async (url: string): Promise<Calendar> => {
        const resp = await axios.get(url, { responseType: 'stream' }).catch((err) => {
            throw err;
        });

        const respStream = resp.data as ReadStream;
        return this.fromReadStream(respStream);
    };

    public fromFile = async (path: string): Promise<Calendar> => {
        const fsStream = fs.createReadStream(path);
        return this.fromReadStream(fsStream);
    };

    public fromReadStream = (respStream: ReadStream): Promise<Calendar> => {
        let cachedStr = '';
        let hasInit = false;
        const eventParser = new EventParser();
        return new Promise<Calendar>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            respStream.on('data', (chunk: any) => {
                if (Buffer.isBuffer(chunk)) {
                    cachedStr += chunk.toString().replace(/\r\n/g, '\n');
                } else if (typeof chunk === 'string') {
                    cachedStr += chunk.replace(/\r\n/g, '\n');
                } else {
                    throw new Error('Unsupported stream type, need to be string or Buffer');
                }

                if (!hasInit) {
                    if (!this.findProductId(cachedStr)) {
                        reject(new Error('Product ID not found'));
                    }

                    if (!this.findDefaultTimezone(cachedStr)) {
                        reject(new Error('Default timezone not found'));
                    }

                    hasInit = true;
                }

                if (!ComponentParser.hasBegin(cachedStr, ComponentType.Event)) return; // Just repeat again if there's no BEGIN:VEVENT found
                const vevents = ComponentParser.findComponents(cachedStr, ComponentType.Event);
                for (const vevent of vevents.components) {
                    this.calendar.events.push(eventParser.parseComponent(vevent));
                }

                cachedStr = cachedStr.substring(vevents.tailIndex);
            });

            respStream.on('end', () => {
                resolve(this.calendar);
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
            TimezoneManager.getInstance().msMode = this.calendar.productId.includes('Microsoft Exchange Server'); // Use M$'s style timezone LUT
            return true;
        } else {
            return false;
        }
    };

    private findDefaultTimezone = (str: string): boolean => {
        // Find default timezone (if exists)
        const tzMgr = TimezoneManager.getInstance();
        const tzResult = str.match(/(((?<=\nTZID\:)|(?<=\nTZID\;VALUE\=TEXT\:)|(?<=\nX-WR-TIMEZONE\:)|(?<=\nX-WR-TIMEZONE\;VALUE\=TEXT\:))(.*))/);
        if (tzResult !== null) {
            if (!tzMgr.msMode) {
                this.calendar.timezone = tzResult[0].replace('"', '');
            } else {
                const lutResult = MSTimezoneLUT.get(tzResult[0].replace('"', ''));
                if (lutResult !== undefined) {
                    this.calendar.timezone = lutResult;
                } else {
                    this.calendar.timezone = 'Etc/GMT';
                }
            }
            tzMgr.defaultTimezone = this.calendar.timezone;
            return DateTime.local().setZone(tzMgr.defaultTimezone).isValid;
        } else {
            return false;
        }
    };
}
