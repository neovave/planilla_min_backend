const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistReparticion, nameExistReparticion, codigoExistReparticion, idExistMunicipio} = require('./database');
const { options } = require('../../routes/auth');

const validationSchema =  {
    id_municipio: {
        isEmpty: {
            negated: true, errorMessage: "Id Municipio es obligatorio",
        },
        custom: { options: idExistMunicipio}, //verificamos si existe uuid
    },
    codigo: {
        isEmpty: {
            negated: true, errorMessage: "Código es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
        custom: {options: codigoExistReparticion },
    },
    sigla: {
        isEmpty: {
            negated: true, errorMessage: "La sigla es obligatorio",
        },
        isLength: {
            errorMessage: 'La sigla debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },
    },
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "La nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'La nombre debe tener mínimo a 1 caracteres y máximo 200 caracteres',
            options: { min: 1, max: 200},
        },
        custom: { options: nameExistReparticion },
    },
    nombre_abreviado: {
        isEmpty: {
            negated: true, errorMessage: "La nombre abreviado es obligatorio",
        },
        isLength: {
            errorMessage: 'La nombre debe tener mínimo a 1 caracteres y máximo 100 caracteres',
            options: { min: 1, max: 100},
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
            custom: { options: idExistReparticion},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistReparticion} },
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

