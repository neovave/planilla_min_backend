const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const {  nameExistTipoPlanilla, codExistTipoPlanilla, idExistTipoPlanilla } = require('./database');

const validationSchema =  {
    codigo: {
        isEmpty: {
            negated: true, errorMessage: "El código es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 1 caracteres y máximo 2 caracteres',
            options: { min: 1, max: 2},
        },
        custom: { options: codExistTipoPlanilla },
    },
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 1 caracteres y máximo 15 caracteres',
            options: { min: 1, max: 15},
        },
        //custom: { options: nameExistTipoPlanilla },
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
            custom: { options: idExistTipoPlanilla},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistTipoPlanilla} },
        activo: {
            isString: {
                errorMessage: "El estado debe ser de tipo int - id",
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

