import { baseUrl } from "./constantsService";

/**
 * [GET]
 * /conv
 */
export const CONVOCATORIES_LIST = `${baseUrl}/conv`;

/**
 * [GET]
 * /conv/{id_conv}
 */
export const CONVOCATORY_DETAILS = `${baseUrl}/conv/`;

/**
 * [GET]
 * /cond/all/{id_conv}
 */
export const CONDITIONS_BY_CONVOCATORY = `${baseUrl}/cond/all/`;

/**
 * [GET]
 * /cond/detalle/{id_cond}
 */
export const CONDITION_DETAILS = `${baseUrl}/cond/detalle/`;

/**
 * [GET]
 * /resp/all/{id_fcamp}
 */
export const FORM_ANSWERS = `${baseUrl}/resp/all/`;

/**
 * [GET]
 * /form/campos/{fields}
 */
export const FORM_FIELDS = `${baseUrl}/form/campos/`;


