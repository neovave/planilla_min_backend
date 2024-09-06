const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const {  nameExistBono, idExistBono } = require('./database');

const validationSchema =  {
    nombre_abreviado: {
        isEmpty: {
            negated: true, errorMessage: "El nombre abreviado es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 4 caracteres y máximo 20 caracteres',
            options: { min: 2, max: 20},
        },
        custom: { options: nameExistBono },
    },
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "La descripción es obligatorio",
        },
        isLength: {
            errorMessage: 'La descripción debe tener mínimo a 2 caracteres y máximo 200 caracteres',
            options: { min: 2, max: 200},
        },
        
    },
    porcentaje: {
        isEmpty: {
            negated: true, errorMessage: "El porcentaje es obligatorio",
        },
        isNumeric: {
            errorMessage: 'La porcentaje debe ser un número decimal válido.'
        }
    },
    descripcion: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo descripción debe tener mínimo a 4 caracteres y máximo 300 caracteres',
            options: { min: 1, max: 300},
        },
    },
    tipo: {
        isEmpty: {
            negated: true, errorMessage: "El tipo es obligatorio",
        },
        isLength: {
            errorMessage: 'El tipo debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20 },
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
            custom: { options: idExistBono},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistBono} },
        activo: {
            isString: {
                errorMessage: "El estado debe ser de tipo bigint - id",
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

