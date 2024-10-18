const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistGrupoDescuento, nombreExistGrupoDesc, codigoExistGrupoDesc} = require('./database');
const { options } = require('../../routes/auth');

const validationSchema =  {
    codigo: {
        isEmpty: {
            negated: true, errorMessage: "Código es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
        custom: {options: codigoExistGrupoDesc },
    },
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "La nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'La nombre debe tener mínimo a 1 caracteres y máximo 100 caracteres',
            options: { min: 1, max: 100},
        },
        custom: {options: nombreExistGrupoDesc },
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
            custom: { options: idExistGrupoDescuento},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistGrupoDescuento} },
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

