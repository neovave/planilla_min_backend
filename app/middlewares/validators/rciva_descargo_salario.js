const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistRcivaDescargo, idExistMes, idExistEmpleado } = require('./database');

const validationSchema =  {
    id_mes: {
        isEmpty: {
            negated: true, errorMessage: "Id mes es obligatorio",
        },
        custom: { options: idExistMes}, //verificamos si existe uuid
    },
    id_empleado: {
        isEmpty: {
            negated: true, errorMessage: "Id empleado es obligatorio",
        },
        custom: { options: idExistEmpleado}, //verificamos si existe uuid
    },
    nro_orden: {
        isEmpty: {
            negated: true, errorMessage: "El número orden es obligatorio",
        },
        isLength: {
            errorMessage: 'El número orden debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
    },
    total_facturas: {
        isDecimal: {
            errorMessage: 'El total en facturas debe ser un número decimal válido.'
        }        
    },
    importe_cod26: {
        isDecimal: {
            errorMessage: 'El importe cod26 debe ser un número decimal válido.'
        }        
    },
    total_cod113: {
        isDecimal: {
            errorMessage: 'El total cod113 debe ser un número decimal válido.'
        }        
    },
    importe_cod113: {
        isDecimal: {
            errorMessage: 'El importe cod113 debe ser un número decimal válido.'
        }        
    },
    importe_rciva: {
        isDecimal: {
            errorMessage: 'El importe rciva debe ser un número decimal válido.'
        }        
    },
    importe_cod464: {
        isDecimal: {
            errorMessage: 'El importe cod464 debe ser un número decimal válido.'
        }        
    },
    importe_cod465: {
        isDecimal: {
            errorMessage: 'El importe cod465 debe ser un número decimal válido.'
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
            custom: { options: idExistRcivaDescargo },
        },
        ...validationSchema}),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistRcivaDescargo} },        
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

