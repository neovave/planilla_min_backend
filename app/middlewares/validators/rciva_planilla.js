const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistRcivaPlanilla, idExistMes, idExistMinSalario, idExistEscalaRciva, idExistRcivaDescargo, idExistRcivaCert, idExistPlanFecha, idExistUfv } = require('./database');

const validationSchema =  {
    id_mes: {
        isEmpty: {
            negated: true, errorMessage: "Id mes es obligatorio",
        },
        custom: { options: idExistMes}, //verificamos si existe uuid
    },
    id_minimo_nacional: {
        isEmpty: {
            negated: true, errorMessage: "Id mínimo nacional salario es obligatorio",
        },
        custom: { options: idExistMinSalario}, //verificamos si existe uuid
    },
    id_escala_rciva: {
        isEmpty: {
            negated: true, errorMessage: "Id escala rciva es obligatorio",
        },
        custom: { options: idExistEscalaRciva}, //verificamos si existe uuid
    },
    id_rciva_certificado: {
        isEmpty: {
            negated: true, errorMessage: "Id rciva certificado es obligatorio",
        },
        custom: { options: idExistRcivaCert}, //verificamos si existe uuid
    },
    id_rciva_descargo: {
        isEmpty: {
            negated: true, errorMessage: "Id rciva descargo es obligatorio",
        },
        custom: { options: idExistRcivaDescargo}, //verificamos si existe uuid
    },
    id_rciva_planilla_fecha: {
        isEmpty: {
            negated: true, errorMessage: "Id rciva planilla fecha es obligatorio",
        },
        custom: { options: idExistPlanFecha}, //verificamos si existe uuid
    },
    id_ufv_mes_anterior: {
        isEmpty: {
            negated: true, errorMessage: "Id ufv mes anterior es obligatorio",
        },
        custom: { options: idExistUfv}, //verificamos si existe uuid
    },
    id_ufv_mes_paga: {
        isEmpty: {
            negated: true, errorMessage: "Id rciva planilla fecha es obligatorio",
        },
        custom: { options: idExistUfv}, //verificamos si existe uuid
    },
    novedad: {
        isEmpty: {
            negated: true, errorMessage: "El número orden es obligatorio",
        },
        isLength: {
            errorMessage: 'El novedad debe tener mínimo a 1 caracteres y máximo 1 caracter',
            options: { min: 1, max: 1},
        },
    },
    ingreso_neto_bs: {
        isDecimal: {
            errorMessage: 'El ingreso neto Bs. debe ser un número decimal válido.'
        }        
    },
    minimo_imponible: {
        isDecimal: {
            errorMessage: 'El minimo imponible debe ser un número decimal válido.'
        }        
    },
    importe_sujeto_impuesto: {
        isDecimal: {
            errorMessage: 'El importe sujeto a impuesto debe ser un número decimal válido.'
        }        
    },
    impuesto_rciva: {
        isDecimal: {
            errorMessage: 'El impuesto rciva debe ser un número decimal válido.'
        }        
    },
    monto_porcentaje_smn: {
        isDecimal: {
            errorMessage: 'El importe rciva debe ser un número decimal válido.'
        }        
    },
    impuesto_neto: {
        isDecimal: {
            errorMessage: 'El impuesto neto debe ser un número decimal válido.'
        }        
    },
    saldo_favor_fisco: {
        isDecimal: {
            errorMessage: 'El saldo a favor de fisco debe ser un número decimal válido.'
        }        
    },
    saldo_favor_dependiente: {
        isDecimal: {
            errorMessage: 'El saldo favor del dependiente debe ser un número decimal válido.'
        }        
    },    
    total_saldo_mes_anterio: {
        isDecimal: {
            errorMessage: 'El total saldo mes anterior debe ser un número decimal válido.'
        }        
    },
    monto_saldo_actualizacion: {
        isDecimal: {
            errorMessage: 'El monto saldo actualización debe ser un número decimal válido.'
        }        
    },
    total_actualizacion: {
        isDecimal: {
            errorMessage: 'El total actualización debe ser un número decimal válido.'
        }        
    },
    saldo_utilizado: {
        isDecimal: {
            errorMessage: 'El saldo utilizado debe ser un número decimal válido.'
        }        
    },
    rciva_retendio: {
        isDecimal: {
            errorMessage: 'El rciva retenido debe ser un número decimal válido.'
        }        
    },
    saldo_rciva_dependiente: {
        isDecimal: {
            errorMessage: 'El saldo rciva dependiente debe ser un número decimal válido.'
        }        
    },
    // saldo_rciva_dependiente2: {
    //     isDecimal: {
    //         errorMessage: 'El saldo rciva dependiente debe ser un número decimal válido.'
    //     }        
    // },
    total_viaticos: {
        isDecimal: {
            errorMessage: 'El total viaticos debe ser un número decimal válido.'
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
            custom: { options: idExistRcivaPlanilla },
        },
        saldo_rciva_dependiente2: {
            optional: { options: { checkFalsy: true } },
            isDecimal: {
                errorMessage: 'El saldo rciva dependiente debe ser un número decimal válido.'
            }        
        },
        ...validationSchema}),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistRcivaPlanilla} },        
    }),
    validatedResponse
]


module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete
}

