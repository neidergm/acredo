/**
 * Normalize Dates using options
 * @param value date as string or number format 
 * @param options 
 * @returns date as string transformed with options
 */
export const getNormalDate = (value: string | number, options?: Intl.DateTimeFormatOptions) => {
    let date: Date;

    if (typeof value === "string") {
        let d:any = value.trim().split(/[-|/ |T :]/);
        let [d1, d2, d3, ...dx] = d;
        date = new Date(d1, d2 - 1, d3, ...dx);
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
export const getDateDiff = (from: Date, to = new Date()): number => {
    let dias = from.getTime() - to.getTime();
    return Math.ceil(dias / (1000 * 60 * 60 * 24));
}