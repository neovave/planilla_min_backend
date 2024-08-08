const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistRcivaCert, idExistMes, idExistEmpleado } = require('./database');

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
    impuesto_saldo: {
        isDecimal: {
            errorMessage: 'El precio debe ser un número decimal válido.'
        }        
    },
    impuesto_fecha_saldo: {
        isDate: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },        
    },
    impuesto_numero: {
        isEmpty: {
            negated: true, errorMessage: "El número es obligatorio",
        },
        isLength: {
            errorMessage: 'El número debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
    },
    impuesto_descripcion: {
        isEmpty: {
            negated: true, errorMessage: "La descripción es obligatorio",
        },
        isLength: {
            errorMessage: 'El descripción debe tener mínimo a 4 caracteres y máximo 200 caracteres',
            options: { min: 4, max: 200},
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
            custom: { options: idExistRcivaCert },
        },
        ...validationSchema}),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistRcivaCert} },        
    }),
    validatedResponse
]


module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete
}

