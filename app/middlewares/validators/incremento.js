const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistIncremento, idExistGestion, idExistCargo } = require('./database');

const validationSchema =  {
    id_gestion: {
        isEmpty: {
            negated: true, errorMessage: "Id tipo Gestion y sancion es obligatorio",
        },
        custom: { options: idExistGestion}, //verificamos si existe uuid
    },
    id_cargo: {
        isEmpty: {
            negated: true, errorMessage: "Id cargo es obligatorio",
        },
        custom: { options: idExistCargo}, //verificamos si existe uuid
    },
    monto: {
        isDecimal: {
            errorMessage: 'El monto debe ser un número decimal válido.'
        }
        
    },
    unidad: {
        isEmpty: {
            negated: true, errorMessage: "El campo unidad es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 2 caracteres',
            options: { min: 1, max: 2},
        },
    },
    porcentaje: {
        isDecimal: {
            errorMessage: 'El monto debe ser un número decimal válido.'
        }
        
    },
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "La descripcion es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 4 caracteres y máximo 200 caracteres',
            options: { min: 4, max: 200},
        },
    },
    fecha_habilitacion: {
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
            negated: true, errorMessage: "La fecha fin es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 10, max: 10},
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
            custom: { options: idExistIncremento },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistIncremento} },
    
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

