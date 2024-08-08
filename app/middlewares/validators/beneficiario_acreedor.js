const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistBenefAcredor, idExistAsigDescuento } = require('./database');

const validationSchema =  {
    id_asig_descuento: {
        isEmpty: {
            negated: true, errorMessage: "Id tipo descuento y sancion es obligatorio",
        },
        custom: { options: idExistAsigDescuento}, //verificamos si existe uuid
    },
    detalle_ruc: {
        optional: { options: { checkFalsy: true } },isEmpty: {
            negated: true, errorMessage: "Id tipo descuento y sancion es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 1 caracteres y máximo 100 caracteres',
            options: { min: 1, max: 100},
        },
        //custom: { options: codigoExistCapacitacion },
    },
    ci_ruc: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },
    },
    tipo: {
        isEmpty: {
            negated: true, errorMessage: "El campo unidad es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
    },
    /*id_user_charge: {
        isEmpty: {
            negated: true, errorMessage: "Id usuario es obligatorio",
        },
        custom: { options: idExistUser},
    },*/
    descripcion: {
        isEmpty: {
            negated: true, errorMessage: "La fecha inicio capacitación es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 200 caracteres',
            options: { min: 1, max: 200},
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
            custom: { options: idExistBenefAcredor },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistBenefAcredor} },
        activo: {
            isBoolean: {
                errorMessage: "El estado debe ser de tipo boolean [0, 1]",
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

