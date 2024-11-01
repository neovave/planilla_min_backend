const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistAsigCargoEmp, idExistGestion, idExistEmpleado, idExistCargo, idExistTipoMov, idExistReparticion, idExistDestino, idExistMes } = require('./database');

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
    id_reparticion: {
        isEmpty: {
            negated: true, errorMessage: "Id repartición es obligatorio",
        },
        custom: { options: idExistReparticion}, //verificamos si existe uuid
    },
    id_destino: {
        isEmpty: {
            negated: true, errorMessage: "Id destino es obligatorio",
        },
        custom: { options: idExistDestino}, //verificamos si existe uuid
    },
    fecha_inicio: {
        isEmpty: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },
        isDate: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },        
    },
    fecha_limite: {
        optional: { options: { checkFalsy: true } },        
        isDate: {
            negated: true, errorMessage: "La fecha limite es obligatorio",
        },        
        
    },
    motivo: {
        isEmpty: {
            negated: true, errorMessage: "El motivo es obligatorio",
        },
        isLength: {
            errorMessage: 'El motivo debe tener mínimo a 4 caracteres y máximo 300 caracteres',
            options: { min: 4, max: 300},
        },
    },
    nro_item: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El nro item debe tener mínimo a 4 caracteres y máximo 300 caracteres',
            options: { min: 4, max: 300},
        },
    },
    ingreso: {
        optional: { options: { checkFalsy: true } },
        isBoolean: {
            errorMessage: 'El ingreso debe ser tipo boolean válido.'
        }      
    },
    retiro: {
        optional: { options: { checkFalsy: true } },
        isBoolean: {
            errorMessage: 'El ingreso debe ser tipo boolean válido.'
        }      
    },
    estado: {
        isEmpty: {
            negated: true, errorMessage: "El estado es obligatorio",
        },
        isLength: {
            errorMessage: 'El estado debe tener mínimo a 2 caracteres y máximo 2 caracteres',
            options: { min: 2, max: 2},
        },
    },
    
    // activo: {
    //     isBoolean: {
    //         errorMessage: "El estado debe ser de tipo bigint [0,1]",
    //     }
    // },
    
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
];

const getValidateImport= [
    checkSchema({
        
        id_mes: {
            isEmpty: {
                negated: true, errorMessage: "Id mes es obligatorio",
            },
            custom: { options: idExistMes}, //verificamos si existe uuid
        },
        //...validationSchema
    }),
    validatedResponse
];



module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete,
    getValidateImport
}

