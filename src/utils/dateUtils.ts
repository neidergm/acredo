/**
 * Convert String date to Date Object
 * @param date string date
 * @returns Date from string
 */
export const stringToDate = (date: string) => {
    const [d1, d2, d3, h = "0", min = "0", s = "0", ms = "0"] = date.trim().split(/[-|/ |T :]/);
    const yearFirst = d1.length === 4;
    return new Date(
        +(yearFirst ? d1 : d3),
        +d2 - 1,
        +(yearFirst ? d3 : d1),
        +h, +min, +s, +ms,
    );
}

export const dateToString = (date: Date, join = "-", reverse = false) => {
    let d = date.toLocaleString('es-CO', { month: '2-digit', day: "2-digit", year: "numeric" }).split(/[-|/ |T :]/)

    if (reverse) d = d.reverse()
        
    return d.join(join)
}


/**
 * Normalize Dates using options
 * @param value date as string or number format 
 * @param options 
 * @returns date as string transformed with options
 */
export const getNormalDate = (value: string | number, options?: Intl.DateTimeFormatOptions) => {
    let date: Date;

    if (!value) return ""

    if (typeof value === "string") {
        date = stringToDate(value);
    } else {
        date = new Date(value);
    }

    return date.toLocaleString(
        'es-CO', options || { month: '2-digit', day: "2-digit", year: "numeric" }
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