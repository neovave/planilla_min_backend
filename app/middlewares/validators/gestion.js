const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistGestion, nameExistGestion } = require('./database');

const validationSchema =  {
    gestiones: {
        isEmpty: {
            negated: true, errorMessage: "El campo año o gestión es obligatorio",
        },
        // isInt: {
        //     errorMessage: "El año debe ser de tipo number",
        // },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 1 caracteres y máximo 4 caracteres',
            options: { min: 1, max: 4},
        },        
        custom: { options: nameExistGestion },
    },
    // fecha_inicio: {
    //     isEmpty: {
    //         negated: true, errorMessage: "La fecha inicio es obligatorio",
    //     },
    //     isLength: {
    //         errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
    //         options: { min: 10, max: 10},
    //     },
        
    // },
    // fecha_limite: {
    //     isEmpty: {
    //         negated: true, errorMessage: "La fecha limite es obligatorio",
    //     },
    //     isLength: {
    //         errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
    //         options: { min: 10, max: 10},
    //     },
    // },
    motivo_cierre: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 200},
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
            custom: { options: idExistGestion},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistGestion} },
        motivo_cierre: {
            isEmpty: {
                         negated: true, errorMessage: "El motivo de cierre es obligatorio",
                    },
            isLength: {
                errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
                options: { min: 1, max: 200},
            },
        },
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

