/**
 * Convert String date to Date Object
 * @param date string fate
 * @returns Date from string
 */
const stringToDate = (date: string) => {
    const d: any = date.trim().split(/[-|/ |T :]/);
    const [d1, d2, d3, ...dx] = d;
    return d1.length === 4 ? new Date(d1, d2 - 1, d3, ...dx) : new Date(d3, d2 - 1, d1, ...dx);
}

/**
 * Normalize Dates using options
 * @param value date as string or number format 
 * @param options 
 * @returns date as string transformed with options
 */
export const getNormalDate = (value: string | number, options?: Intl.DateTimeFormatOptions) => {
    let date: Date;

    if (typeof value === "string") {
        date = stringToDate(value);
    } else {
        date = new Date(value);
    }

    return date.toLocaleString(
        [], options || { month: '2-digit', day: "2-digit", year: "numeric" }
    )
}

/**
 * Get Difference in days between 2 dates
 * @param from start date
 * @param to end date
 * @returns number of days
 */
export const getDateDiff = (from: Date | string, to = new Date()): number => {
    if (typeof from === "string") { from = stringToDate(from) }
    const dias = from.getTime() - to.getTime();
    return Math.ceil(dias / (1000 * 60 * 60 * 24));
}