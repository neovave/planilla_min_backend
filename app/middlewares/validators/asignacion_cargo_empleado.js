const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistAsigCargoEmp, idExistGestion, idExistEmpleado, idExistCargo, idExistTipoMov } = require('./database');

const validationSchema =  {
    id_gestion: {
        isEmpty: {
            negated: true, errorMessage: "Id tipo Gestion y sancion es obligatorio",
        },
        custom: { options: idExistGestion}, //verificamos si existe uuid
    },
    id_empleado: {
        isEmpty: {
            negated: true, errorMessage: "Id empleado es obligatorio",
        },
        custom: { options: idExistEmpleado}, //verificamos si existe uuid
    },
    id_cargo: {
        isEmpty: {
            negated: true, errorMessage: "Id cargo es obligatorio",
        },
        custom: { options: idExistCargo}, //verificamos si existe uuid
    },
    id_tipo_movimiento: {
        isEmpty: {
            negated: true, errorMessage: "Id tipo movimiento es obligatorio",
        },
        custom: { options: idExistTipoMov}, //verificamos si existe uuid
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
            negated: true, errorMessage: "La fecha fin es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 10, max: 10},
        },
    },
    motivo: {
        isEmpty: {
            negated: true, errorMessage: "El motivo es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 4 caracteres y máximo 300 caracteres',
            options: { min: 4, max: 300},
        },
    },
    nro_item: {
        isEmpty: {
            negated: true, errorMessage: "El motivo es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 4 caracteres y máximo 300 caracteres',
            options: { min: 4, max: 300},
        },
    },
    ingreso: {
        isBoolean: {
            errorMessage: 'El ingreso debe ser tipo boolean válido.'
        }      
    },
    retiro: {
        isBoolean: {
            errorMessage: 'El ingreso debe ser tipo boolean válido.'
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
            custom: { options: idExistAsigCargoEmp },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistAsigCargoEmp} },
    
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

