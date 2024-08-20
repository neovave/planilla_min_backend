const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistPlanFecha, idExistMes } = require('./database');

const validationSchema =  {
    id_mes: {
        isEmpty: {
            negated: true, errorMessage: "Id mes es obligatorio",
        },
        custom: { options: idExistMes}, //verificamos si existe uuid
    },
    fecha_limite: {
        isEmpty: {
            negated: true, errorMessage: "La fecha limite es obligatorio",
        },
        isDate: {
            negated: true, errorMessage: "La fecha tiene que ser tipo Fecha",
        }, 
    },
    tipo: {
        isEmpty: {
            negated: true, errorMessage: "El tipo es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 4 caracteres y máximo 255 caracteres',
            options: { min: 4, max: 255},
        },
    },
    // activo: {
    //     isBoolean: {
    //         errorMessage: "El estado debe ser de tipo bigint [0,1]",
    //     }
    // },
    
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistPlanFecha },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistPlanFecha} },
    
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

