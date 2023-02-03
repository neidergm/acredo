export const getNormalDate = (value: string | number | Date) => new Date(value).toLocaleString(
    [], { month: '2-digit', day: "2-digit", year: "numeric" }
)