const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistAsigSubsidio, idExistTipoDescuento, idExistEmpleado, idExistMes } = require('./database');

const validationSchema =  {
    id_tipo_descuento: {
        isEmpty: {
            negated: true, errorMessage: "Id tipo subsidio es obligatorio",
        },
        custom: { options: idExistTipoDescuento}, //verificamos si existe uuid
    },
    id_empleado: {
        isEmpty: {
            negated: true, errorMessage: "Id empleado es obligatorio",
        },
        custom: { options: idExistEmpleado}, //verificamos si existe uuid
    },
    // cod_empleado: {
    //     optional: { options: { checkFalsy: true } },
    //     isLength: {
    //         errorMessage: 'El nombre debe tener mínimo a 1 caracteres y máximo 15 caracteres',
    //         options: { min: 1, max: 15},
    //     },
    //     //custom: { options: codigoExistCapacitacion },
    // },
    monto: {
        isDecimal: {
            errorMessage: 'El precio debe ser un número decimal válido.'
        }
        // isLength: {
        //     errorMessage: 'El nombre debe tener mínimo a 1 caracteres y máximo 15 caracteres',
        //     options: { min: 1, max: 15},
        // },
        // custom: { options: codigoExistCapacitacion },
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
    tipo_pago: {
        isEmpty: {
            negated: true, errorMessage: "El campo tipo de pago es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },
    },
    /*id_user_charge: {
        isEmpty: {
            negated: true, errorMessage: "Id usuario es obligatorio",
        },
        custom: { options: idExistUser},
    },*/
    fecha_inicio: {
        isEmpty: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },
        isDate: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },
    },
    fecha_limite: {
        optional: { options: { nullable: true } },
        isDate: {
            negated: true, errorMessage: "La fecha inicio es obligatorio",
        },
    },
    numero_cuota: {
        optional: { options: { nullable: true } },
        isInt: {
            errorMessage: "La número de cuota es obligatorio",
        },
        toInt: true,
    },
    nombre_archivo: {
        optional: { options: { nullable: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 50 caracteres',
            options: { min: 1, max: 50},
        },
    },
    activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo bigint [0,1]",
        }
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
            custom: { options: idExistAsigSubsidio },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistAsigSubsidio} },
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

const getValidateImportacion= [
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
    getValidateImportacion
}

