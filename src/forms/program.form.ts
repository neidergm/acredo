import { T_FieldsTypes } from '../interfaces/generic.interface';

const programForm: T_FieldsTypes[] = [
    {
        "name": "estado",
        "label": "Estado",
        "tag": "select",
        "type": "simple",
        "options": ["Activo", "Cerrado"],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "nivel",
        "label": "Nivel de formación",
        "tag": "select",
        "type": "simple",
        "options": ["PREGRADO", "POSGRADO"],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "modalidad",
        "label": "Modalidad",
        "tag": "select",
        "type": "simple",
        "options": ["PRESENCIAL", "VIRTUAL", "A DISTANCIA"],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "tipo_formacion",
        "label": "Tipo de formación",
        "tag": "select",
        "type": "simple",
        "options": ["TÉCNICO", "TECNOLOGO", "PROFESIONAL"],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "titulo",
        "label": "Título otorgado",
        "tag": "input",
        "type": "text",
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
]

export default programForm;