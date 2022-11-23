import { baseUrl } from "./constantsService";

/**
 * [GET]
 * /conv
 */
export const CONVOCATORIES_LIST = `conv`;

/**
 * [GET]
 * /conv/{id_conv}
 */
export const CONVOCATORY_DETAILS = `conv/`;

/**
 * [GET]
 * /cond/all/{id_conv}
 */
export const CONDITIONS_BY_CONVOCATORY = `cond/all/`;

/**
 * [GET]
 * /cond/detalle/{id_cond}
 */
export const CONDITION_DETAILS = `cond/detalle/`;

/**
 * [GET]
 * /resp/all/{id_fcamp}
 */
export const FORM_ANSWERS = `resp/all/`;

/**
 * [GET]
 * /form/campos/{fields}
 */
export const FORM_FIELDS = `form/campos/`;


