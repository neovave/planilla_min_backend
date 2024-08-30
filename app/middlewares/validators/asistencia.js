const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistAsistencia, idExistEmpleado, idExistCargo, idExistAsigCargoEmp,idExistMes } = require('./database');

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
    id_asig_cargo: {
        isEmpty: {
            negated: true, errorMessage: "Id asigancion cargo es obligatorio",
        },
        custom: { options: idExistAsigCargoEmp}, //verificamos si existe uuid
    },
    id_cargo: {
        isEmpty: {
            negated: true, errorMessage: "Id cargo es obligatorio",
        },
        custom: { options: idExistCargo}, //verificamos si existe uuid
    },    
    dias_trabajados: {
        isInt: {
            errorMessage: 'Los dias trabajados debe ser un número entero válido.'
        }
    },
    dias_sancionados: {
        isInt: {
            errorMessage: 'Los dias sancionados debe ser un número entero válido.'
        }
    },
    // activo: {
    //     isBoolean: {
    //         errorMessage: "El estado debe ser de tipo bigint [0,1]",
    //     }
    // },
    
};
const validationGenerarSchema =  {
    id_mes: {
        isEmpty: {
            negated: true, errorMessage: "Id mes es obligatorio",
        },
        custom: { options: idExistMes}, //verificamos si existe uuid
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
            custom: { options: idExistAsistencia },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistAsistencia} },
    
        // activo: {
        //     isBoolean: {
        //         errorMessage: "El estado debe ser de tipo boolean [0, 1]",
        //     }
        // }
    }),
    validatedResponse
];
const getValidateGenerarAsis = [
    checkSchema(validationGenerarSchema),
    validatedResponse
];


module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete,
    getValidateGenerarAsis
}

