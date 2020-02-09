# TypeCal

Work in Progress

# Getting started

```typescript
const ical = `BEGIN:VCALENDAR
...(your ical string here)...
END:VCALENDAR`;
const cal = new CalParser();
cal.parseCal(ical);
console.log(cal.toJson());
```

# Progess

- [x] VEVENT
    - [x] General components
    - [x] ATTENDEES
- [ ] VALARM -> WIP, 50%
- [ ] VTIMEZONE -> WIP
- [ ] VJOURNAL -> WIP
- [ ] Parse from HTTP/FS stream (something like `calParser.fromURL()`)

# License 

MIT