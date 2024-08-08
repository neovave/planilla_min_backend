const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistCargo, idExistCatCargo, codigoExistCargo } = require('./database');

const validationSchema =  {
    id_categoria: {
        isEmpty: {
            negated: true, errorCargosage: "El campo categoria es obligatorio",
        },
        custom: { options: idExistCatCargo },
    },
    codigo: {
        isEmpty: {
            negated: true, errorCargosage: "El campo codigo es obligatorio",
        },
        isLength: {
            errorCargosage: 'El campo codigo debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },        
        custom: { options: codigoExistCargo },
    },
    descripcion: {
        isEmpty: {
            negated: true, errorCargosage: "El campo descripcion obligatorio",
        },
        isLength: {
            errorCargosage: 'El campo descripción debe tener mínimo a 5 caracteres y máximo 200 caracteres',
            options: { min: 5, max: 100},
        },        
    },
    monto: {
        isDecimal: {
            errorMessage: 'El monto debe ser un número decimal válido.'
        }
      
    },
    nivel: {
        isInt: {
            errorMessage: 'El nivel debe ser un número entero válido.'
        }
    },
    cantidad_item: {
        isInt: {
            errorMessage: 'La cantidad item debe ser un número entero válido.'
        }
    },
    tipo: {
        isEmpty: {
            negated: true, errorCargosage: "El campo tipo obligatorio",
        },
        isLength: {
            errorCargosage: 'El campo descripción debe tener mínimo a 1 caracteres y máximo 20 caracteres',
            options: { min: 1, max: 20},
        },        
    },
    monto_mensual: {
        isDecimal: {
            errorMessage: 'El monto mensual debe ser un número decimal válido.'
        }
      
    },
    /*activo: {
        isBoolean: {
            errorCargosage: "El estado debe ser de tipo boolean [false, true]",
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
            custom: { options: idExistCargo},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistCargo} },
        activo: {
            isInt: {
                errorCargosage: "El estado debe ser entero",
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

