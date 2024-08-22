const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistGradoAcademico, nameExistDescripcion, nameExistCodigo} = require('./database');
const { options } = require('../../routes/auth');

const validationSchema =  {
    codigo: {
        isEmpty: {
            negated: true, errorMessage: "Código es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 1 caracteres y máximo 5 caracteres',
            options: { min: 1, max: 5},
        },
        custom: {options: nameExistCodigo },
    },
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "La descripción es obligatorio",
        },
        isLength: {
            errorMessage: 'La descripción debe tener mínimo a 1 caracteres y máximo 50 caracteres',
            options: { min: 1, max: 50},
        },
        custom: {options: nameExistDescripcion },
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
            custom: { options: idExistGradoAcademico},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistGradoAcademico} },
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

