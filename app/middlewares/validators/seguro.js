const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistSeguro, nameExistSeguro } = require('./database');

const validationSchema =  {
    codigo: {
        isEmpty: {
            negated: true, errorMessage: "El campo codigo es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },        
        custom: { options: nameExistSeguro },
    },
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "El campo descripción es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 4 caracteres y máximo 200 caracteres',
            options: { min: 4, max: 200},
        },
    },
    abreviado: {
        isEmpty: {
            negated: true, errorMessage: "El campo abreviado es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 4 caracteres y máximo 20 caracteres',
            options: { min: 4, max: 20},
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
            custom: { options: idExistSeguro},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistSeguro} },
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

