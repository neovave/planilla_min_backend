const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistAporteEmp, idExistEmpleado, idExistAporte } = require('./database');

const validationSchema =  {
    id_empleado: {
        isEmpty: {
            negated: true, errorAporteEmpsage: "El campo empleado es obligatorio",
        },
        custom: { options: idExistEmpleado },
    },
    id_aporte: {
        isEmpty: {
            negated: true, errorAporteEmpsage: "El campo aporte es obligatorio",
        },
        custom: { options: idExistAporte },
    },
    motivo: {
        isEmpty: {
            negated: true, errorAporteEmpsage: "El campo motivo obligatorio",
        },
        isLength: {
            errorAporteEmpsage: 'El campo motivo debe tener mínimo a 5 caracteres y máximo 100 caracteres',
            options: { min: 5, max: 100},
        },        
    },
    /*activo: {
        isBoolean: {
            errorAporteEmpsage: "El estado debe ser de tipo boolean [false, true]",
        }
    }*/
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistAporteEmp},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistAporteEmp} },
        activo: {
            isInt: {
                errorAporteEmpsage: "El estado debe ser entero",
            }
        }
    }),
    validatedResponse
]


module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete
}

