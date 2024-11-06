const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistLugarExpedido, idExistGradoAcademico, ciExistEmpleado, idExistEmpleado, codigoExistEmpleado, idExistMes } = require('./database');

const validationSchema =  {
    id_expedido: {
        isEmpty: {
            negated: true, errorMessage: "El campo lugar expedido es obligatorio",
        },
        custom: { options: idExistLugarExpedido },
    },
    id_grado_academico: {
        isEmpty: {
            negated: true, errorMessage: "El campo grado academico es obligatorio",
        },
        custom: { options: idExistGradoAcademico },
    },
    cod_empleado: {
        isEmpty: {
            negated: true, errorMessage: "El campo codigo es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo codigo debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },        
        custom: { options: codigoExistEmpleado },
    },
    numero_documento: {
        isEmpty: {
            negated: true, errorMessage: "El campo número documento es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo número de documento debe tener mínimo a 4 caracteres y máximo 10 caracteres',
            options: { min: 4, max: 10},
        },
        custom: { options: ciExistEmpleado },
    },
    complemento: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo complemento debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },        
    },
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El campo nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo codigo debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },        
    },
    otro_nombre: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo otro nombre debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },        
    },
    paterno: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo paterno debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },        
    },
    materno: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo materno debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },        
    },
    fecha_nacimiento: {
        isEmpty: {
            negated: true, errorMessage: "La fecha nacimiento es obligatorio",
        },
        isDate: {
            negated: true, errorMessage: "La fecha nacimiento tiene que ser tipo Fecha",
        }, 
    },
    nacionalidad: {
        isEmpty: {
            negated: true, errorMessage: "El campo nacionalidad es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo nacionalidad debe tener mínimo a 4 caracteres y máximo 100 caracteres',
            options: { min: 4, max: 100},
        },
    },
    sexo: {
        isEmpty: {
            negated: true, errorMessage: "El campo sexo es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo sexo debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
    },
    nua: {
        isEmpty: {
            negated: true, errorMessage: "El campo nua es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo nua debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
    },
    cuenta_bancaria: {
        isEmpty: {
            negated: true, errorMessage: "El campo cuenta bancaria es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo cuenta bancaria debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },
    },
    tipo_documento: {
        isEmpty: {
            negated: true, errorMessage: "El campo tipo documento es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo tipo documento debe tener mínimo a 1 caracteres y máximo 2 caracteres',
            options: { min: 1, max: 2},
        },
    },
    cod_rciva: {
        isEmpty: {
            negated: true, errorMessage: "El campo código rciva es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo código rciva debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },
    },
    cod_rentista: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo código rentista debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },
    },
    correo: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo correo debe tener mínimo a 1 caracteres y máximo 50 caracteres',
            options: { min: 1, max: 50},
        },
    },
    telefono: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El campo teléfono debe tener mínimo a 1 caracteres y máximo 40 caracteres',
            options: { min: 1, max: 40},
        },
    },
    celular: {
        isEmpty: {
            negated: true, errorMessage: "El campo celular es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo celular debe tener mínimo a 1 caracteres y máximo 40 caracteres',
            options: { min: 1, max: 40},
        },
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
            custom: { options: idExistEmpleado},
        },
        ...validationSchema
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

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistEmpleado} },
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
    validateDelete,
    getValidateImport,
    getValidateImport
}

