/**
 * @method POST
 * @params { token, confia: 0 }
 */
export const LOGIN = "auth/autenticar";
/**
 * @method GET
 * @params /[{type}]
 * @param type? - can be 1 for get A and D roles; 2 for get only B roles
 */
export const ROLS = `roles`;

/*---------------------------------------------*/
// PROCESS
/*---------------------------------------------*/

/**
 * @method GET
 */
export const PROCESS_LIST = `conv`;

/**
 * @method GET
 */
export const GET_PROCESS_TYPE = `cond/tipos`;

/**
 * @method GET
 * @params /{ id_conv }
 */
export const PROCESS_DETAILS = `conv/`;

/**
 * @method GET
 * @params /{ id_conv }
 */
export const DELETE_PROCESS = `conv/`;

/**
 * @method POST
 * @params { id_prog, id_tcond, id_sede, id_prog }
 */
export const CREATE_PROCESS = `conv`;

/**
 * @method PUT
 * @params { id_conv, id_prog, id_tcond, id_sede, id_prog }
 */
export const UPDATE_PROCESS = `conv`;


/*---------------------------------------------*/
// TASK
/*---------------------------------------------*/

/**
 * @method GET
 * @params /{ id_cond }
 */
export const CONDITION_DETAILS = `cond/`;

/**
 * @method DELETE
 * @params /{ id_cond }
 */
export const DELETE_TASK = `cond/`;

/**
 * @method POST
 * @params { nomb_cond, sede, detalle, cod_cond }
 */
export const SAVE_TASK = `cond`;

/**
 * @method PUT
 * @params { nomb_cond, sede, detalle, cod_cond, id_cond }
 */
export const UPDATE_TASK = `cond`;

/**
 * @method PUT
 * @params { form_cond, id_cond }
 */
export const ASOCIATE_FORM_TO_TASK = `cond`;


/*---------------------------------------------*/
// ANSWERS FORM
/*---------------------------------------------*/

/**
 * @method GET
 * @params /{ id_form }
 */
export const ANSWER_BY_FORM = `resp/`;

/**
 * @method GET
 * @params /{ id_form }
 */
export const ALL_ANSWERS_BY_FORM = `resp/all/`;

/**
 * @method POST
 * @params 
 */
export const SAVE_ANSWERS = `resp`;

/**
 * @method DELETE
 * @params /{ f_camp }/{ grupo_resp }
 */
export const DELETE_ANSWER = `resp/`;

/**
 * @method GET
 * @params /{ id_cond }
 */
export const HISTORIC_BY_CONDITION = `resp/historial/`;

/**
 * @method PUT
 * @params { id_fcamp, orden }
 */
export const ORDERING_ANSWERS = `resp/ordenar`;


/*---------------------------------------------*/
// FORMS AND FIELDS
/*---------------------------------------------*/

/**
 * @method GET
 * @params /{ id_form }
 */
export const FORM = `form/`;

/**
 * @method GET
 * @params /{ fields }
 */
export const FORM_FIELDS = `form/campos/`;

/**
 * @method GET
 * @params /{ id_fcamp }
 */
export const OBSERVATION_BY_FORM = `obs/`;


/*---------------------------------------------*/
// OBSERVATIONS
/*---------------------------------------------*/

/**
 * @method GET
 * @params /{ id_fcamp }/{ grupo }
 */
export const OBSERVATION_BY_ATTACHMENT = `obs/`;

/**
 * @method POST
 * Required: {observacion:string, id_cond:string, id_form:string, id_fcamp:string}
 * Optional: {archivos:<Array>, id_camp:string, grupo_resp:string (Only for attachments), id_ref:string (para comenter observación (se guarda id de obs))}
 */
export const SAVE_OBSERVATION = `obs`;


/*---------------------------------------------*/
// STAGES
/*---------------------------------------------*/

/**
 * @method GET
 * @params /{ id_condicion }
 */
export const STAGES = `etapas/`;

/**
 * @method PUT
 * @params { id_cond, id_nodo, est_etapa }
 */
export const PUT_STAGE = `etapas`;

/**
 * @method DELETE
 * @params /{id_stages}
 */
export const DELETE_STAGE = `etapas/`;


/*---------------------------------------------*/
// ACTIONS
/*---------------------------------------------*/

/**
 * @method PUT
 * @params { id_accion, ...JSON  }
 */
export const PUT_ACTION = `acciones`;

/**
 * @method DELETE
 * @params /{ id_accion }
 */
export const DELETE_ACTION = `acciones/`;


/*---------------------------------------------*/
// POSITIONS AND RESPONSIBLE
/*---------------------------------------------*/

/**
 * @method GET
 */
export const CHARGE = `cargos`;

/**
 * @method GET
 * @params /{ id_charge }/[{ id_cond } for do task modification]/[{id_action} for actions assignation]
 */
export const RESPONSIBLES_BY_CHARGE = `cargos/responsable/`;


/*---------------------------------------------*/
// PHASES
/*---------------------------------------------*/

/**
 * @method GET
 * @params /{ id_conv }
 */
export const PHASES_WITH_COND_BY_PROCESS = `fases/condiciones/`;
/**
 * @method GET
 * @params /{ id_phase }
 */
export const PHASE_DETAILS = `fases/`;

/**
 * @method POST
 */
export const SAVE_PHASE = `fases`;

/**
 * @method DELETE
 * @params /{ id_phase }
 */
export const DELETE_PHASE = `fases/`;

/**
 * @method GET
 * @params /{ id_fase } 
 */
export const ATTACHMENTS_BY_PHASE = `resp/anexos/`;



/*---------------------------------------------*/
// CAMPUS
/*---------------------------------------------*/

/**
 * @method GET
 */
export const CAMPUS_LIST = `sedes`;


/*---------------------------------------------*/
// INFO
/*---------------------------------------------*/

/**
 * @method GET
 * @params {/process_type}
 */
export const CONDITIONS_TYPES = `getinfo/condiciones`;

/**
 * @method GET
 */
export const DEPARTMENT_LIST = `getinfo/departamentos`;

/**
 * @method GET
 * @params {departamento}
 */
export const CITIES_BY_DEPARTMENT = `getinfo/ciudades`;


/*---------------------------------------------*/
// FORMS TEMPLATE
/*---------------------------------------------*/

/**
 * @method GET
 */
export const GET_TEMPLATES_CATEGORIES = `plantilla/categorias`;

/**
 * @method GET
 * @params /{type: "form" | "tareas" | "fase" | "etapa" | "accion"}/{id_category}
 */
export const GET_TEMPLATES = `plantilla/`;


/*---------------------------------------------*/
// PROGRAMS
/*---------------------------------------------*/

/**
 * @method POST | PUT
 * @params {[0].nomb_prog, [0].titu_prog, [0].depa_prog, [0].ciud_prog, [0].nivel_prog, [0].tform_prog, [0].moda_prog}
 */
export const SAVE_PROGRAM_DATA = `programas`;
/**
 * @method GET
 */
export const GET_PROGRAMS_LIST = `programas`;

/**
 * @method GET
 * @params /[state]?
 */
export const GET_PROGRAMS_BY_STATE = `programas/all/`;

/**
 * @method PUT
 * @params {est_prog: -1, cid_prog}
 */
export const DELETE_PROGRAM = `programas`;

/**
 * @method GET
 */
export const GET_FACULTAD = `programas/facultades`;


/*---------------------------------------------*/
// NOTIFICATIONS
/*---------------------------------------------*/

/**
 * @method GET
 */
export const GET_NOTIFICATIONS = `noti`;

/**
 * @method PUT
 * @params {id_noti}
 */
export const MARK_AS_READ_NOTIFICATION = `noti`;

/**
 * @method GET
 */
export const GET_NOTIFICATIONS_REPORT = `noti/reporte`;


/*---------------------------------------------*/
// DASHBOARD
/*---------------------------------------------*/

/**
 * @method GET
 */
export const GET_RESUME = `admin/resumen`;

/**
 * @method GET
 */
export const GET_PROCESS_INDICATORS = `conv/estados`;

/**
 * @method GET
 */
export const GET_PROGRAMS_INDICATORS = `programas/estado`;

/**
 * @method GET
 * @params /[state]?
 */
export const GET_PROCESS_BY_STATE = `conv/all/`;


/*---------------------------------------------*/
// EVENTS
/*---------------------------------------------*/

/**
 * @method POST
 * @param [/event_id] for update
 * @params {[0].nomb_evento, [0].desc_evento, [0].reco_evento[], [0].id_prog, [0].fech_evento}
 */
export const SAVE_PROGRAM_EVENT = `eventos`;

/**
 * @method DELETE
 * @params /event_id
 */
export const DELETE_PROGRAM_EVENT = `eventos/`;


/*---------------------------------------------*/
// RESOLUTIONS
/*---------------------------------------------*/

/**
 * @method POST
 * @params {[0].nomb_evento, [0].desc_evento, [0].reco_evento[], [0].id_prog, [0].fech_evento}
 */
export const SAVE_PROGRAM_RESOLUTION = `programas/resolucion`;

/**
 * @method PUT
 * @params {[0].nomb_evento, [0].desc_evento, [0].reco_evento[], [0].id_prog, [0].fech_evento}
 */
export const UPDATE_PROGRAM_RESOLUTION = `programas/resolucion`;

/**
 * @method PUT
 * @params {resoluciones[0].reso_apro, id_prog}
 */
export const DELETE_PROGRAM_RESOLUTION = `programas/resolucion`;


