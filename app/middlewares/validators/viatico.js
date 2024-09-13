const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistViatico, idExistMes, idExistEmpleado } = require('./database');

const validationSchema =  {
    id_mes: {
        isEmpty: {
            negated: true, errorMessage: "Id mes es obligatorio",
        },
        custom: { options: idExistMes}, //verificamos si existe uuid
    },
    id_empleado: {
        isEmpty: {
            negated: true, errorMessage: "Id empleado es obligatorio",
        },
        custom: { options: idExistEmpleado}, //verificamos si existe uuid
    },
    numero: {
        isEmpty: {
            negated: true, errorMessage: "El número es obligatorio",
        },
        isLength: {
            errorMessage: 'El número debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
    },
    memo: {
        isEmpty: {
            negated: true, errorMessage: "El memorándum es obligatorio",
        },
        isLength: {
            errorMessage: 'El memorándum debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 20},
        },
    },
    detalle: {
        isEmpty: {
            negated: true, errorMessage: "El detalle es obligatorio",
        },
        isLength: {
            errorMessage: 'El detalle debe tener mínimo a 1 caracteres y máximo 500 caracteres',
            options: { min: 1, max: 500},
        },
    },
    importe: {
        isDecimal: {
            errorMessage: 'El precio debe ser un número decimal válido.'
        }        
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
            custom: { options: idExistViatico },
        },
        ...validationSchema}),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistViatico} },        
    }),
    validatedResponse
]


module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete
}

