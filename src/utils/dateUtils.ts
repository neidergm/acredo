export const getNormalDate = (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => new Date(value).toLocaleString(
    [], options || { month: '2-digit', day: "2-digit", year: "numeric" }
)