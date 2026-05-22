export type T_ProcessTypePalette = {
    /** Strong color used on the top strip and progress accents. */
    c: string;
    /** Background color for the type badge. */
    bg: string;
    /** Border color for the type badge. */
    br: string;
    /** Text color for the type badge. */
    tx: string;
};

// Palette keyed by `id_tcond`. Source: docs/acredo_procesos_gui.html mockup.
// Backend ids today (per cond/tipos):
//   1 → CI · Acreditación
//   2 → RC Nuevo
//   3 → RC Renovación
//   4 → RC Ampliación
// Add/edit here when the backend introduces a new tipo.
const PALETTE_BY_TCOND: Record<number, T_ProcessTypePalette> = {
    1: { c: "#7C3AED", bg: "#F5F3FF", br: "#C4B5FD", tx: "#4C1D95" },
    2: { c: "#0D9488", bg: "#E6FFFA", br: "#81E6D9", tx: "#065F46" },
    3: { c: "#1E3A5F", bg: "#EFF6FF", br: "#BFDBFE", tx: "#1E3A5F" },
    4: { c: "#D97706", bg: "#FFFBEB", br: "#FDE68A", tx: "#78350F" },
};

const FALLBACK: T_ProcessTypePalette = {
    c: "#94A3B8",
    bg: "#F8FAFC",
    br: "#E2E8F0",
    tx: "#475569",
};

export const getProcessTypePalette = (id_tcond: number | null | undefined): T_ProcessTypePalette => {
    if (id_tcond == null) return FALLBACK;
    return PALETTE_BY_TCOND[id_tcond] ?? FALLBACK;
};


export const ringProgressColor = (value: number): string => {
    if (value >= 100) return "#10B981";
    if (value >= 67) return "#3B82F6";
    if (value >= 50) return "#F59E0B";
    if (value >= 25) return "#F97316";
    return "#EF4444";
};
