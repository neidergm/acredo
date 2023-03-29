/**
 * [POST]
 * {token: string, confia: 0}
 */
export const LOGIN = "auth/autenticar";

/**
 * [GET]
 * /conv
 */
export const PROCESS_LIST = `conv`;

/**
 * [GET]
 * /conv/{id_conv}
 */
export const CONVOCATORY_DETAILS = `conv/`;

/**
 * [GET]
 * /cond/{id_cond}
 */
export const CONDITION_DETAILS = `cond/`;

/**
 * [GET]
 * /resp/{id_form}
 */
export const ANSWER_BY_FORM = `resp/`;

/**
 * [GET]
 * /resp/all/{id_form}
 */
export const ALL_ANSWERS_BY_FORM = `resp/all/`;

/**
 * [GET]
 * /resp/anexo/{id_form}
 */
// export const ATTACHMENTS_ANSWER = `resp/anexos/`;

/**
 * [POST]
 * /resp
 */
export const SAVE_ANSWERS = `resp`;

/**
 * [DELETE]
 * /resp/{f_camp}{grupo_resp}
 */
export const DELETE_ANSWER = `resp/`;

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

/**
 * [GET]
 * obs/{id_fcamp}
 */
export const OBSERVATION_BY_FORM = `obs/`;


/**
 * [GET]
 * obs/{id_fcamp}/{grupo}
 */
export const OBSERVATION_BY_ATTACHMENT = `obs/`;

/**
 * [POST]
 * Required: {observacion:string, id_cond:string, id_form:string, id_fcamp:string}
 * Optional: {archivos:<Array>, id_camp:string, grupo_resp:string (Only for attachments), id_ref:string (para comenter observación (se guarda id de obs))}
 */
export const SAVE_OBSERVATION = `obs`;

/**
 * [GET]
 * fases/condiciones/{id_conv}
 */
export const PHASES_WITH_COND_BY_PROCESS = `fases/condiciones/`;

/**
 * [GET]
 * etapas/{id_condicion}
 */
export const STAGES = `etapas/`;

/**
 * [PUT]
 * etapas
 * {"id_cond": "", "id_nodo": "", "est_etapa": "" }
 */
export const PUT_STAGE = `etapas`;

/**
 * [PUT]
 * acciones
 * {"id_accion": "", ...JSON  }
 */
export const PUT_ACTION = `acciones`;

/**
 * [DELETE]
 * acciones
 * /id_accion
 */
export const DELETE_ACTION = `acciones/`;

/**
 * [GET]
 * roles
 */
export const ROLS = `acciones/`;

/**
 * [GET]
 * cargos/responsables
 */
export const RESPONSIBLE = `cargos/responsables`;
