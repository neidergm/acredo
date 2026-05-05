import { type T_FieldsTypes } from '../interfaces/generic.interface';

const resolutionForm: T_FieldsTypes[] = [
    {
        "name": "reso_apro",
        "label": "Resolución de aprobación",
        "tag": "input",
        "type": "text",
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "reco_min",
        "label": "Reconocimiento del ministerio",
        "tag": "input",
        "type": "text",
        "wrapperClassName": "col-12 col-md-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "estado",
        "label": "Estado",
        "tag": "select",
        "type": "simple",
        "options": [{ "label": "Activo", "value": 1 }, { "label": "Inactivo", "value": 0 }],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "fech_reso",
        "label": "Fecha de resolución",
        "tag": "date",
        "type": "date",
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "fech_ejec",
        "label": "Fecha de ejecución",
        "tag": "date",
        "type": "date",
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "vige_reso",
        "label": "Vigencia (años)",
        "tag": "input",
        "type": "number",
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "peri_acad",
        "label": "Periodo académico",
        "tag": "select",
        "type": "simple",
        "options": ["Semestral", "Mensual", "Trimestral", "Anual"],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "nper_snies",
        "label": "Número de periodos",
        "tag": "input",
        "type": "number",
        "wrapperClassName": "col-6 col-lg-3",
        "validations": {
            "required": true
        }
    }, {
        "name": "ncre_snies",
        "label": "Número de créditos",
        "tag": "input",
        "type": "number",
        "wrapperClassName": "col-6 col-lg-3",
        "validations": {
            "required": true
        }
    },
    {
        "name": "just_reso",
        "label": "Justificación de resolución",
        "tag": "input",
        "type": "text",
        "wrapperClassName": "col-12 col-md",
        "validations": {}
    },
    {
        "name": "jres_deta",
        "label": "Justificación detallada",
        "tag": "input",
        "type": "textarea",
        "wrapperClassName": "col-12",
        "validations": {}
    },
    {
        "name": "file_reso",
        "label": "Documento de resolución",
        "tag": "file",
        "type": "simple",
        "accept": [".pdf"],
        "wrapperClassName": "col-12",
        "validations": {
            maxFileSize: 20,
        }
    },
]

export default resolutionForm;