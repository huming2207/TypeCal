# TypeCal

Work in Progress

## Getting started

### Parse from a string (blocking)

```typescript
const ical = `BEGIN:VCALENDAR
...(your ical string here)...
END:VCALENDAR`;
const cal = new CalParser();
cal.parseCal(ical);
console.log(cal.toJson());
```

### Parse from URL

```typescript
const parser = new CalParser();

parser
    .fromURL(`https://calendar.google.com/calendar/ical/...(whatever).../basic.ics`)
    .then(cal => {
        console.log(parser.toJSON());
    })
    .catch(err => {
        console.log(err);
    });
```

## Progress

- [x] VEVENT
    - [x] General components
    - [x] ATTENDEES
- [x] VALARM
- [x] VTIMEZONE (partial, TZID recognition only)
- [-] VJOURNAL -> WIP
- [-] VTODO -> WIP
- [x] Parse from HTTP/FS stream (something like `calParser.fromURL()`)
- [-] Proper timezone handling -> WIP

## License 

MIT
