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
export const CONDITION_DETAILS = `cond/detalles/`;

/**
 * [GET]
 * /resp/one/{id_form}
 */
export const ANSWER_BY_FORM = `resp/one/`;

/**
 * [GET]
 * /resp/all/{id_form}
 */
export const ALL_ANSWERS_BY_FORM = `resp/all/`;

/**
 * [POST]
 * /resp
 */
export const SAVE_ANSWERS = `resp`;

/**
 * [DELETE]
 * /resp/{id_fcamp}/{grupo}
 */
export const DELETE_ANSWERS = `resp/`;

/**
 * [GET]
 * /form/{id_form}
 */
export const FORM = `form/`;

/**
 * [GET]
 * /form/campos/{fields}
 */
export const FORM_FIELDS = `form/campos/`;

/**
 * [GET]
 * /resp/historial/{id_cond}
 */
export const HISTORIC_BY_CONDITION = `resp/historial/`;


