const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistCatCargo, nameExistCatCargo } = require('./database');

const validationSchema =  {
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El campo nombre es obligatorio",
        },
        // isInt: {
        //     errorMessage: "El año debe ser de tipo number",
        // },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 1 caracteres y máximo 50 caracteres',
            options: { min: 1, max: 50},
        },        
        custom: { options: nameExistCatCargo },
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
            custom: { options: idExistCatCargo},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistCatCargo} },
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

