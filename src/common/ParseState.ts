export enum ParseState {
    ParseError = -2,
    ParseInit = -1,
    ProductId = 0,
    DefaultTz = 1,
    Event = 2,
    Todo = 3,
    Done = 4,
}
