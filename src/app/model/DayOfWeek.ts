export enum DayOfWeek {
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
}


export function dayOfWeekToNumber(day: DayOfWeek): number {
    switch (day) {
        case DayOfWeek.SUNDAY:
            return 0;
        case DayOfWeek.MONDAY:
            return 1;
        case DayOfWeek.TUESDAY:
            return 2;
        case DayOfWeek.WEDNESDAY:
            return 3;
        case DayOfWeek.THURSDAY:
            return 4;
        case DayOfWeek.FRIDAY:
            return 5;
        case DayOfWeek.SATURDAY:
            return 6;
        default:
            throw new Error(`Invalid DayOfWeek value: ${day}`);
    }
}