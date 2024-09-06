const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistAsigBono, idExistBono, idExistEmpleado } = require('./database');

const validationSchema =  {
    id_bono: {
        isEmpty: {
            negated: true, errorMessage: "Id bono es obligatorio",
        },
        custom: { options: idExistBono}, //verificamos si existe uuid
    },
    id_empleado: {
        isEmpty: {
            negated: true, errorMessage: "Id empleado es obligatorio",
        },
        custom: { options: idExistEmpleado}, //verificamos si existe uuid
    },
    fecha_inicio: {
        isEmpty: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },
        isDate: {
            negated: true, errorMessage: "La fecha inicio tiene que ser de tipo Date",
        },
        //custom: { options: codigoExistCapacitacion },
    },
    fecha_limite: {
        optional: { options: { checkFalsy: true } },
        isDate: {
            negated: true, errorMessage: "La fecha limite tiene que ser de tipo Date",
        },
        //custom: { options: codigoExistCapacitacion },
    },    
    estado: {
        isEmpty: {
            negated: true, errorMessage: "El campo estado es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 2 caracteres',
            options: { min: 1, max: 2},
        },
    }
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistAsigBono },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistAsigBono} },
        estado: {
            isEmpty: {
                negated: true, errorMessage: "El campo estado es obligatorio",
            },
            isLength: {
                errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 2 caracteres',
                options: { min: 1, max: 2},
            },
        }
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

