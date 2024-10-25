
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Rciva_planilla, Empleado, Planilla_fecha, Mes ,sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const xlsx = require('xlsx');

const getRcivaPlanillaPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_mes,id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_mes? {id_mes} : {}, id? {id} : {}, 
                ],
                
            },
            include: [
                { association: 'rcivaplanilla_mes',  attributes: {include: ['mes_literal']},  
                }, 
                { association: 'rcivaplanilla_minimonacsal',  attributes: {include: ['monto_bs']},}, 
                { association: 'rcivaplanilla_escalarciva',  attributes: {include: ['totalganado']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let rcivaPlanilla = await paginate(Rciva_planilla, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            rcivaPlanilla
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newRcivaPlanilla = async (req = request, res = response ) => {
    
    try {
        const { body } = req.body;
        const rcivaPlanilla = await Rciva_planilla.create(body);
        
        return res.status(201).json({
            ok: true,
            rcivaPlanilla
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateRcivaPlanilla = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const rcivaPlanilla = await Rciva_planilla.findOne({where: {id}} );
        await rcivaPlanilla.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Planilla rciva modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveRcivaPlanilla = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const rcivaPlanilla = await Rciva_planilla.findByPk(id);
        await rcivaPlanilla.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Planilla rciva se activado exitosamente' : 'Planilla rciva se inactivo exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const migrarSaldoRciva = async (req = request, res = response ) => {
    //const t = await sequelize.transaction();
    try {
        let {id_mes }= req.query;
        const excelBuffer = req.files['file'][0].buffer;
        await processExcel(excelBuffer, 1, id_mes);

        // body.activo = 1;
        // const empleadoNew = await Empleado.create(body);
        //wait t.commit();
        res.status(201).json({
            ok: true,
            //empleadoNew            
        });
        
    } catch (error) {
        console.log(error);
        //await t.rollback();
        return res.status(500).json({
            ok: false,
            errors: [{
                msg: `Ocurrió un imprevisto interno | hable con soporte`
            }],
        });
    }
}
function processExcel(excelBuffer, t, id_mes) {

    const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const options = {
        header: 1,
        // raw: false, 
        // dateNF: 'yyyy-mm-dd', // Specify the date format string here
        
      };
    const excelData = xlsx.utils.sheet_to_json(worksheet, options );
  
    insertExcelIntoDatabase(excelData,  id_mes);
}

async function insertExcelIntoDatabase(data, id_mes) {
    //const columns = data[0];
    //const t = await sequelize.transaction();
    try{
        
            
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            
            

            //datos
            let id_empleado = -1;
            let existeEmpleado = false;
            if( row[0] ){
                
                let ci_emp = parseFloat(row[5]);
                let dataRciva;
                const existEmp = await Empleado.findOne({ where: { numero_documento: String( ci_emp ) } } );
                const planillaFecha = await Planilla_fecha.findOne({where: {  id_mes:id_mes } } );
                if(existEmp){
                    id_empleado = existEmp.id;
                    dataRciva = {
                        id_mes:id_mes,
                        //id_minimo_nacional:null,
                        //id_escala_rciva:null,
                        id_empleado:id_empleado,
                        //id_rciva_certificado:null,
                        //id_rciva_descargo:null,
                        id_rciva_planilla_fecha:planillaFecha ? planillaFecha.id: null ,
                        saldo_rciva_dependiente:row[19],
                        novedad: 'V',
                        activo: 1,
                        id_user_create: 0,
                    };

                    const existRciva = await Rciva_planilla.findOne({where: { id_empleado: id_empleado, id_mes:id_mes } } );
                    
                    if(!existRciva){

                        const rcivaSaldoNew = await Rciva_planilla.create( dataRciva );
                    }else{
                        const dataRciva = {
                            id_mes:id_mes,
                            //id_minimo_nacional:null,
                            //id_escala_rciva:null,
                            id_empleado:id_empleado,
                            //id_rciva_certificado:null,
                            //id_rciva_descargo:null,
                            id_rciva_planilla_fecha:planillaFecha ? planillaFecha.id: null ,
                            novedad: 'V',
                            saldo_rciva_dependiente:row[19],
                            //activo: 1,
                            id_user_update: 0,
                        };
                        await existRciva.update( dataRciva );
                        console.log("se ha actualizado correctamente********************************************************************",existRciva);
                    }
                    
                }else{
                    console.log("No existe empleado.................:", ci_emp);
                    
                }
                
                
                
            }
        
        }
        
    } catch (error) {
        console.log("Error", error);
        //await t.rollback();
    }
}
function formatearTexto(texto) {
    // Convertir a mayúsculas:
    const textoMayusculas = texto.toUpperCase();
  
    // Eliminar espacios en blanco al inicio y final:
    const textoSinEspacios = textoMayusculas.trim();
  
    return textoSinEspacios;
}

module.exports = {
    getRcivaPlanillaPaginate,
    newRcivaPlanilla,
    updateRcivaPlanilla,
    activeInactiveRcivaPlanilla,
    migrarSaldoRciva
};