
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Rciva_descargo_salario, Empleado ,sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');
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

module.exports = {
    getRcivaDescargoPaginate,
    newRcivaDescargo,
    updateRcivaDescargo,
    activeInactiveRcivaDescargo,
    migrarSaldoDescargo
};