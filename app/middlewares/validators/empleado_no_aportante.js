const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistEmpNoAportante, idExistEmpleado } = require('./database');

const validationSchema =  {
    id_empleado: {
        isEmpty: {
            negated: true, errorAporteEmpsage: "El campo empleado es obligatorio",
        },
        custom: { options: idExistEmpleado },
    },
    descripcion: {
        isEmpty: {
            negated: true, errorAporteEmpsage: "El campo descripción obligatorio",
        },
        isLength: {
            errorAporteEmpsage: 'El campo descripción debe tener mínimo a 5 caracteres y máximo 300 caracteres',
            options: { min: 5, max: 300},
        },        
    },
    fecha_inicio: {
        isEmpty: {
            negated: true, errorMessage: "La fecha de habilitación es obligatorio",
        },
        isDate: {
            negated: true, errorMessage: "La fecha de habilitación tiene que ser tipo Fecha",
        }, 
    },
    tipo: {
        isEmpty: {
            negated: true, errorAporteEmpsage: "El campo tipo obligatorio",
        },
        isLength: {
            errorAporteEmpsage: 'El campo tipo debe tener mínimo a 5 caracteres y máximo 30 caracteres',
            options: { min: 5, max: 30},
        },        
    },
    /*activo: {
        isBoolean: {
            errorAporteEmpsage: "El estado debe ser de tipo boolean [false, true]",
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
            custom: { options: idExistEmpNoAportante},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistEmpNoAportante} },
        activo: {
            isInt: {
                errorAporteEmpsage: "El estado debe ser entero",
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

