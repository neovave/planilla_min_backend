const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistSalarioPlanilla, idExistEmpleado, idExistAsigCargoEmp,idExistMes, idExistIncremento } = require('./database');

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
    id_incremento: {
        optional: { options: { checkFalsy: true } },
        isInt: {
            errorMessage: 'El campo tiene que número entero',
        },        
        custom: { options: idExistIncremento}, //verificamos si existe uuid
    },
    id_asistencia: {
        isEmpty: {
            negated: true, errorMessage: "La asistencia es obligatorio",
        },
        custom: { options: idExistEmpleado}, //verificamos si existe uuid
    },
    id_asig_cargo: {
        isEmpty: {
            negated: true, errorMessage: "Id asigancion cargo es obligatorio",
        },
        custom: { options: idExistAsigCargoEmp}, //verificamos si existe uuid
    },
    edad_empleado: {
        isInt: {
            errorMessage: 'Los La edad debe ser un número entero válido.'
        }
    },
    haber_basico_dia: {
        isInt: {
            errorMessage: 'El haber basico debe ser un número entero válido.'
        }
    },
    antiguedad: {
        isNumeric: {
            errorMessage: 'La antiguedad debe ser un número decimal válido.'
        }
    },
    total_ganado: {
        isNumeric: {
            errorMessage: 'El total ganado debe ser un número decimal válido.'
        }
    },
    total_iva: {
        isNumeric: {
            errorMessage: 'El total iva debe ser un número decimal válido.'
        }
    },
    aporte_laboral_afp: {
        isEmpty: {
            negated: true, errorSeguroEmpsage: "El campo aporte laboral es obligatorio",
        },
    },
    total_afp: {
        isNumeric: {
            errorMessage: 'El aporte debe ser un número decimal válido.'
        }
    },
    aporte_patronal: {
        isEmpty: {
            negated: true, errorSeguroEmpsage: "El campo aporte laboral es obligatorio",
        },
    },
    total_patronal: {
        isNumeric: {
            errorMessage: 'El total patronal debe ser un número decimal válido.'
        }
    },
    aporte_solidario: {
        isEmpty: {
            negated: true, errorSeguroEmpsage: "El campo aporte laboral es obligatorio",
        },
    },
    total_ap_solidario: {
        isNumeric: {
            errorMessage: 'El total aporte solidario debe ser un número decimal válido.'
        }
    },
    descuento_adm: {
        isEmpty: {
            negated: true, errorSeguroEmpsage: "El campo aporte laboral es obligatorio",
        },
    },
    total_descuento: {
        isNumeric: {
            errorMessage: 'El total descuento debe ser un número decimal válido.'
        }
    },
    sanciones_adm: {
        isEmpty: {
            negated: true, errorSeguroEmpsage: "El campo sanción administrativo es obligatorio",
        },
    },
    total_sanciones: {
        isNumeric: {
            errorMessage: 'El total sanciones administrativas debe ser número decimal válido.'
        }
    },
    sancion_asistencia: {
        isNumeric: {
            errorMessage: 'El total sanción asistencia debe ser un número decimal válido.'
        }
    },
    otros_descuentos: {
        isNumeric: {
            errorMessage: 'El total otros descuento debe ser un número decimal válido.'
        }
    },
    liquido_pagable: {
        isNumeric: {
            errorMessage: 'El total liquido pagable debe ser un número decimal válido.'
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
            custom: { options: idExistSalarioPlanilla },
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistSalarioPlanilla} },
    
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

