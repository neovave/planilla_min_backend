const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistConfigMinNacional } = require('./database');

const validationSchema =  {
    total_min_salario: {
        isInt: {
            errorMessage: 'El cantidad total de minimos nacional salarios debe ser un número entero válido.'
        },        
    },
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "El campo descripción es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 4 caracteres y máximo 100 caracteres',
            options: { min: 4, max: 100},
        },        
        //custom: { options: nameExistConfigMinNacional },
    },
    tipo: {
        isEmpty: {
            negated: true, errorMessage: "El campo tipo es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 4 caracteres y máximo 50 caracteres',
            options: { min: 4, max: 50},
        },        
        //custom: { options: nameExistConfigMinNacional },
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
            custom: { options: idExistConfigMinNacional},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistConfigMinNacional} },
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

