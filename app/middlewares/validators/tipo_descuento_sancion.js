const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const {  nameExistTipoDescuento, nameCortoExistTipoDescuento, idExistTipoDescuento } = require('./database');

const validationSchema =  {
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 4 caracteres y máximo 120 caracteres',
            options: { min: 4, max: 120},
        },
        custom: { options: nameExistTipoDescuento },
    },
    nombre_abreviado: {
        isEmpty: {
            negated: true, errorMessage: "El nombre abreviado es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 2 caracteres y máximo 8 caracteres',
            options: { min: 2, max: 8},
        },
        custom: { options: nameCortoExistTipoDescuento },
    },
    grupo: {
        isEmpty: {
            negated: true, errorMessage: "El campo grupo es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo grupo debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
    },
    tipo: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo tipo debe tener mínimo a 1 caracteres y máximo 100 caracteres',
            options: { min: 1, max: 100},
        },
    },
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "El campo descripción es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo descripción debe tener mínimo a 4 caracteres y máximo 200 caracteres',
            options: { min: 1, max: 200},
        },
    },
    unidad: {
        isEmpty: {
            negated: true, errorMessage: "El campo unidad es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo unidad debe tener mínimo a 1 caracteres y máximo 3 caracteres',
            options: { min: 1, max: 3},
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
            custom: { options: idExistTipoDescuento},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistTipoDescuento} },
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

