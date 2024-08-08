const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistEscalaRciva } = require('./database');

const validationSchema =  {
    totalganado: {
        isDecimal: {
            errorMessage: 'El total ganado debe ser un número decimal válido.'
        }    
    },
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "La descripcion es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 4 caracteres y máximo 300 caracteres',
            options: { min: 4, max: 300},
        },
    },
    activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo bigint [0,1]",
        }
    },
    
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistEscalaRciva },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistEscalaRciva} },
    
        // activo: {
        //     isBoolean: {
        //         errorMessage: "El estado debe ser de tipo boolean [0, 1]",
        //     }
        // }
    }),
    validatedResponse
]


module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete
}

