const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistAsigDescuento, idExistTipoDescuento, idExistEmpleado, idExistMunicipio, idExistMes } = require('./database');

const validationSchema =  {
    id_tipo_descuento: {
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
    id_municipio: {
        isEmpty: {
            negated: true, errorMessage: "Id municipio es obligatorio",
        },
        custom: { options: idExistMunicipio}, //verificamos si existe uuid
        
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
            errorMessage: "Número de cuota es obligatorio",
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

    con_beneficiario:{
        optional: { options: { nullable: true } },
        isBoolean: {
            errorMessage: 'El campo beneficio debe ser verdadero o falso.'
        },
        toBoolean: true
    },
    ci_ruc:{
        optional: { options: { nullable: true } },
        isLength: {
            errorMessage: 'El ci y ruc debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },
        custom: {
            options: (value, { req }) => {
                // Validar solo si el beneficio es verdadero
                if (req.body.con_beneficiario && !value) {
                    throw new Error('Debe proporcionar ci o ruc de beneficiario si el tipo descuento es con beneficiario.');
                }
                return true;
            }
        },
        
    },
    detalle_ruc:{
        optional: { options: { nullable: true } },
        isLength: {
            errorMessage: 'El detalle ruc  debe tener mínimo a 1 caracteres y máximo 100 caracteres',
            options: { min: 1, max: 100},
        },
        custom: {
            options: (value, { req }) => {
                // Validar solo si el beneficio es verdadero
                if (req.body.con_beneficiario && !value) {
                    throw new Error('Debe proporcionar detalle ruc de beneficiario si el tipo descuento es con beneficiario.');
                }
                return true;
            }
        },
        
    },
    tipo:{
        optional: { options: { nullable: true } },
        isLength: {
            errorMessage: 'El tipo debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 30},
        },
        custom: {
            options: (value, { req }) => {
                // Validar solo si el beneficio es verdadero
                if (req.body.con_beneficiario && !value) {
                    throw new Error('Debe proporcionar tipo de beneficiario si el tipo descuento es con beneficiario.');
                }
                return true;
            }
        },
        
    },
    descripcion:{
        optional: { options: { nullable: true } },
        isLength: {
            errorMessage: 'La descripción debe tener mínimo a 1 caracteres y máximo 200 caracteres',
            options: { min: 1, max: 200},
        },
        custom: {
            options: (value, { req }) => {
                // Validar solo si el beneficio es verdadero
                if (req.body.con_beneficiario && !value) {
                    throw new Error('Debe proporcionar descripción del beneficiario si el tipo descuento es con beneficiario.');
                }
                return true;
            }
        },
        
    },
    nro_cuenta:{
        optional: { options: { nullable: true } },
        isLength: {
            errorMessage: 'La descripción debe tener mínimo a 1 caracteres y máximo 30 caracteres',
            options: { min: 1, max: 30},
        },
        custom: {
            options: (value, { req }) => {
                // Validar solo si el beneficio es verdadero
                if (req.body.con_beneficiario && !value) {
                    throw new Error('Debe proporcionar descripción del beneficiario si el tipo descuento es con beneficiario.');
                }
                return true;
            }
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
            custom: { options: idExistAsigDescuento },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistAsigDescuento} },
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
];

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

