
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Rciva_descargo_salario, Empleado ,sequelize, Planilla_fecha,Rciva_planilla} = require('../database/config');
const paginate = require('../helpers/paginate');
const xlsx = require('xlsx');


const getRcivaDescargoPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_mes,id, id_empleado} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_mes? {id_mes} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}
                ],
                
            },
            include: [
                { association: 'rcivadescargosalario_mes',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'rcivadescargosalario_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let rcivaDescargo = await paginate(Rciva_descargo_salario, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            rcivaDescargo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newRcivaDescargo = async (req = request, res = response ) => {
    
    try {
        const  body  = req.body;
        const rcivaDescargo = await Rciva_descargo_salario.create(body);
        
        return res.status(201).json({
            ok: true,
            rcivaDescargo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateRcivaDescargo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const rcivaDescargo = await Rciva_descargo_salario.findOne({where: {id}} );
        await rcivaDescargo.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Descargo rciva modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveRcivaDescargo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const rcivaDescargo = await Rciva_descargo_salario.findByPk(id);
        await rcivaDescargo.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Descargo rciva se activado exitosamente' : 'Descargo rciva se inactivo exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const migrarSaldoDescargo = async (req = request, res = response ) => {
    //const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        let idMesAnt = body.id_mes -1 ;
        //const excelBuffer = req.files['file'][0].buffer;
        const fileExcel = req.files.file.data;
        const file2Excel = req.files.file2.data;
        console.log(file2Excel, "id mes:", body.id_mes);
        await processExcel(fileExcel, file2Excel,1, body.id_mes, idMesAnt);

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
function processExcel(fileExcel, file2Excel, t, id_mes, idMesAnt) {

    const workbook = xlsx.read(fileExcel, { type: 'buffer' });
    const workbook2 = xlsx.read(file2Excel, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const options = {
        header: 1
      };
    const excelData = xlsx.utils.sheet_to_json(worksheet, options );

    const sheetName2 = workbook2.SheetNames[0];
    const worksheet2 = workbook2.Sheets[sheetName2];
    const excelData2 = xlsx.utils.sheet_to_json(worksheet2, options );
  
    insertExcelSaldoDatabase(excelData2,  idMesAnt);
    insertExcelDescargoDatabase(excelData,  id_mes);
}

async function insertExcelDescargoDatabase(data, id_mes) {
    //const columns = data[0];
    //const t = await sequelize.transaction();
    try{
            
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            
            

            //datos
            let id_empleado = 0;
            if( row[0] ){
                
                let ci_emp = parseFloat(row[1]);
                const existEmp = await Empleado.findOne({where: { numero_documento: String( ci_emp ) } } );
                if(existEmp){
                    id_empleado = existEmp.id;
                    const dataRciva = {
                        id_mes:id_mes,
                        id_empleado:id_empleado,
                        id_rciva_certificado:null,
                        importe_rciva:row[2],
                        activo: 1,
                        id_user_create: 0,
                    };    

                    const rcivaDescargoNew = await Rciva_descargo_salario.create(dataRciva );
                }else{
                    console.log("No existe empleado.................:");
                    
                }
                
                
            }
        
        }
        
    } catch (error) {
        console.log("Error", error);
        //await t.rollback();
    }
}


async function insertExcelSaldoDatabase(data, id_mes) {
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


module.exports = {
    getRcivaDescargoPaginate,
    newRcivaDescargo,
    updateRcivaDescargo,
    activeInactiveRcivaDescargo,
    migrarSaldoDescargo
};

