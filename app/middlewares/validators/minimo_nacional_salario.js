const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistMinSalario, montoExistMinSalario } = require('./database');

const validationSchema =  {
    monto_bs: {
        isDecimal: {
            errorMessage: 'El precio debe ser un número decimal válido.'
        },
        custom: { options: montoExistMinSalario },
    },
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "El campo descripción es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 4 caracteres y máximo 200 caracteres',
            options: { min: 4, max: 200},
        },        
        //custom: { options: nameExistMinSalario },
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
            custom: { options: idExistMinSalario},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistMinSalario} },
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

