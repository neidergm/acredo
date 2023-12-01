import { I_FormField } from '../interfaces/conditions.interface';
import { T_FieldsTypes } from '../interfaces/generic.interface';
import mapField from '../utils/mapField';

const eventForm = (): T_FieldsTypes[] => [
    {
        "name": "fech_evento",
        "label": "Fecha",
        "tag": "date",
        "type": "date",
        "wrapperClassName": "col-12 col-md-4 col-lg-3",
        "min": "today",
        "validations": {
            "required": true
        }
    },
    {
        "name": "nomb_evento",
        "label": "Nombre",
        "tag": "input",
        "type": "text",
        "wrapperClassName": "col",
        "validations": {
            "required": true
        }
    },
    // {
    //     "name": "desc_evento",
    //     "label": "Descripción",
    //     "tag": "input",
    //     "type": "textarea",
    //     "wrapperClassName": "col-12",
    //     "style": { "minHeight": "150px" },
    //     "validations": {}
    // },
    {
        ...mapField({
            json_campo: {
                "name": "desc_evento",
                "label": "Descripción",
                "tag": "custom",
                "type": "ckeditor",
                "validateAs": "input",
                "wrapperClassName": "col-12",
                // "config": {},
                // "style": { "minHeight": "150px" },
                "validations": {}
            }
        } as unknown as I_FormField)
    },
    {
        "name": "reco_evento",
        "label": "Recordatorios",
        "tag": "list",
        "type": "div",
        "fields": [
            {
                "name": "days",
                "label": "Días antes del evento",
                "tag": "input",
                "type": "number",
                "style": { width: "100px" },
                "placeholder": "3",
                "className": "order-1 text-center",
                "validations": {
                    "required": true
                }
            },
        ],
        // "wrapperClassName": "col-12",
        "validations": {
            // "required": true
        },
        classNameForEveryItem: 'col-auto event-recordatory-item',
        // defaultValue: []
    },
    {
        "name": "correo_add",
        "label": "Otros usuarios a notificar",
        "tag": "list",
        "type": "div",
        "fields": [
            {
                "name": "correo",
                // "label": "Correo",
                "tag": "input",
                "type": "email",
                "style": { width: "300px" },
                "placeholder": "correo@ejemplo.com",
                // "className": "order-1 text-center",
                "validations": {
                    "required": true
                }
            },
        ],
        "wrapperClassName": "pt-3 col",
        "validations": {
            // "required": true
        },
        classNameForEveryItem: 'col-auto event-recordatory-item',
        // defaultValue: []
    }
]

export default eventForm;