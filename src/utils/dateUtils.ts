export const getNormalDate = (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => new Date(value).toLocaleString(
    [], options || { month: '2-digit', day: "2-digit", year: "numeric" }
)

export const getDateDiff = (from: Date, to: Date) => {
    let dias = to.getTime() - from.getTime();
    return Math.ceil(dias / (1000 * 60 * 60 * 24));
}