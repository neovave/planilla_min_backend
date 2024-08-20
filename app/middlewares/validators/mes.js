const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistMes, nameExistMes } = require('./database');

const validationSchema =  {
    id_gestion: {
        isEmpty: {
            negated: true, errorMessage: "El campo gestión es obligatorio",
        },
        custom: { options: idExistMes },
    },
    mes_literal: {
        isEmpty: {
            negated: true, errorMessage: "El campo mes es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo mes debe tener mínimo a 1 caracteres y máximo 15 caracteres',
            options: { min: 1, max: 15},
        },        
        //custom: { options: nameExistGestion },
    },
    fecha_inicio: {
        isEmpty: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 10, max: 10},
        },
        
    },
    fecha_limite: {
        isEmpty: {
            negated: true, errorMessage: "La fecha limite es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 10, max: 10},
        },
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
            custom: { options: idExistMes},
        },
        estado: {
            isEmpty: {
                negated: true, errorMessage: "El campo estado es obligatorio",
            },
            isLength: {
                errorMessage: 'El campo mes debe tener mínimo y máximo 2 caracteres',
                options: { min: 2, max: 2},
            },        
            //custom: { options: nameExistGestion },
        },
        //...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistMes} },
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

