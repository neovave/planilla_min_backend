const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistMes, idExistUfv} = require('./database');

const validationSchema =  {
    id_mes: {
        isEmpty: {
            negated: true, errorMessage: "Id mes es obligatorio",
        },
        custom: { options: idExistMes},
    },
    fecha: {
        isEmpty: {
            negated: true, errorMessage: "Fecha ufv es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 10, max: 10},
        },
    },
    valor: {
        isEmpty: {
            negated: true, errorMessage: "El valor dirigido es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor dirigido debe tener mínimo a 1 caracter entero y 4 caracteres decimales(ej. 1,2345)',
            options: { min: 6, max: 6},
        },
    }
    /*activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo boolean [false, true]",
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
            custom: { options: idExistUfv},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistUfv} },
        activo: {
            isInt: {
                errorMessage: "El estado debe ser entero",
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

