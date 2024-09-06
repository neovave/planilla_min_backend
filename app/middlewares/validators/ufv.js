const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistMes, idExistUfv, verificarDecimal, fechaExistUfv} = require('./database');
const { options } = require('../../routes/auth');

const validationSchema =  {
    id_mes: {
        isEmpty: {
            negated: true, errorMessage: "Id mes es obligatorio",
        },
        custom: { options: idExistMes},
    },
    fecha: {
        isEmpty: {
            negated: true, errorMessage: "Fecha ufv es obligatorio",
        },
        isDate: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },
        custom: {options: fechaExistUfv },
    },
    valor: {
        isEmpty: {
            negated: true, errorMessage: "El valor dirigido es obligatorio",
        },
        isNumeric:{
            errorMessage:"El valor debe ser númerico"
        },        
        // isfloat:{

        // },
        custom:{ options: verificarDecimal },
    }
    /*activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo boolean [false, true]",
        }
    }*/
};
const validationUpdateSchema =  {
    id_mes: {
        isEmpty: {
            negated: true, errorMessage: "Id mes es obligatorio",
        },
        custom: { options: idExistMes},
    },
    fecha: {
        isEmpty: {
            negated: true, errorMessage: "Fecha ufv es obligatorio",
        },
        isDate: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },        
    },
    valor: {
        isEmpty: {
            negated: true, errorMessage: "El valor dirigido es obligatorio",
        },
        isNumeric:{
            errorMessage:"El valor debe ser númerico"
        },        
        // isfloat:{

        // },
        custom:{ options: verificarDecimal },
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
            custom: { options: idExistUfv},
        },
        ...validationUpdateSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistUfv} },
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

