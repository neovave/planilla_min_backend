const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistAsigSancion, idExistTipoDescuento, idExistEmpleado } = require('./database');

const validationSchema =  {
    id_tipo_sancion: {
        isEmpty: {
            negated: true, errorMessage: "Id tipo descuento y sancion es obligatorio",
        },
        custom: { options: idExistTipoDescuento}, //verificamos si existe uuid
    },
    id_empleado: {
        isEmpty: {
            negated: true, errorMessage: "Id empleado es obligatorio",
        },
        custom: { options: idExistEmpleado}, //verificamos si existe uuid
    },
    cod_empleado: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 1 caracteres y máximo 15 caracteres',
            options: { min: 1, max: 15},
        },
        //custom: { options: codigoExistCapacitacion },
    },
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
    /*id_user_charge: {
        isEmpty: {
            negated: true, errorMessage: "Id usuario es obligatorio",
        },
        custom: { options: idExistUser},
    },*/
    fecha_inicio: {
        isEmpty: {
            negated: true, errorMessage: "La fecha inicio capacitación es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 10, max: 10},
        },
    },
    fecha_limite: {
        isEmpty: {
            negated: true, errorMessage: "La fecha fin de capacitación es obligatorio",
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
            custom: { options: idExistAsigSancion },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistAsigSancion} },
        
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

