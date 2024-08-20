const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const {  nameExistTipoMovimiento, idExistTipoMovimiento } = require('./database');

const validationSchema =  {
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 4 caracteres y máximo 120 caracteres',
            options: { min: 4, max: 120},
        },
        custom: { options: nameExistTipoMovimiento },
    },
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
            custom: { options: idExistTipoMovimiento},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistTipoMovimiento} },
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

