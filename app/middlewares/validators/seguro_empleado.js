const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistSeguroEmp, idExistEmpleado, idExistSeguro } = require('./database');

const validationSchema =  {
    id_empleado: {
        isEmpty: {
            negated: true, errorSeguroEmpsage: "El campo empleado es obligatorio",
        },
        custom: { options: idExistEmpleado },
    },
    id_seguro: {
        isEmpty: {
            negated: true, errorSeguroEmpsage: "El campo seguro es obligatorio",
        },
        custom: { options: idExistSeguro },
    },
    motivo: {
        isEmpty: {
            negated: true, errorSeguroEmpsage: "El campo motivo obligatorio",
        },
        isLength: {
            errorSeguroEmpsage: 'El campo SeguroEmp debe tener mínimo a 5 caracteres y máximo 200 caracteres',
            options: { min: 5, max: 200},
        },        
    },
    /*activo: {
        isBoolean: {
            errorSeguroEmpsage: "El estado debe ser de tipo boolean [false, true]",
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
            custom: { options: idExistSeguroEmp},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistSeguroEmp} },
        activo: {
            isInt: {
                errorSeguroEmpsage: "El estado debe ser entero",
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

