const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistMunicipio, nameExistMunicipio, codigoExistMunicipio } = require('./database');
const { options } = require('../../routes/auth');

const validationSchema =  {
    // id_organismo: {
    //     isEmpty: {
    //         negated: true, errorMessage: "Id organismo es obligatorio",
    //     },
    //     custom: { options: idExistOrganismo}, //verificamos si existe uuid
    // },
    codigo: {
        isEmpty: {
            negated: true, errorMessage: "Código es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 1 caracteres y máximo 5 caracteres',
            options: { min: 1, max: 10},
        },
        custom: { options: codigoExistMunicipio },
    },
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "La nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'La nombre debe tener mínimo a 1 caracteres y máximo 100 caracteres',
            options: { min: 1, max: 100},
        },
        custom: { options: nameExistMunicipio },
    },
    nombre_abreviado: {
        isEmpty: {
            negated: true, errorMessage: "La nombre abreviado es obligatorio",
        },
        isLength: {
            errorMessage: 'La nombre abreviado debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
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
            custom: { options: idExistMunicipio},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistMunicipio} },
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

