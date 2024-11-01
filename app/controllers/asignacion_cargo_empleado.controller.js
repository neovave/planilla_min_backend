
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_cargo_empleado, Empleado, Tipo_movimiento, Reparticion,Destino, Users, sequelize, Mes} = require('../database/config');
const xlsx = require('xlsx');
const paginate = require('../helpers/paginate');
const { fileMoveAndRemoveOld } = require('../helpers/file-upload');
const moment = require('moment');
const path = require('path');

const getAsigCargoEmpPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_cargo,id, id_empleado, estado} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_cargo? {id_cargo} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}, estado? {estado}:{}
                ],
                
            },
            include: [
                { association: 'asignacioncargoemp_empleado',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'asignacioncargoemp_cargo',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                { association: 'asignacioncargoemp_reparticion',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                { association: 'asignacioncargoemp_destino',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let asigCargoEmp = await paginate(Asignacion_cargo_empleado, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asigCargoEmp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}


const newAsigCargoEmp = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        
        // const tipoMovDB = await Empleado.findOne({ where: {   [Op.and]:[
        //     nombre?{nombre: { [Op.eq]: 'INGRESO' }}:{} 
        // ],  } });
        body.activo = 1;
        
        //actualiza el campo tipo movimiento de la tabla empleado
        let id = body.id_empleado;
        console.log("id_empleado", body.id_empleado);
        const bodyEmp = { id_tipo_movimiento: body.id_tipo_movimiento };
        const updateEmp = await Empleado.findOne({ where: { id } });
        await updateEmp.update(bodyEmp, { transaction: t });

        //si el moviemiento es distinto de Ingreso
        const mov = await Tipo_movimiento.findOne({where: { id: body.id_tipo_movimiento } });
        console.log("timo de movimiento:", mov);
        if( mov.nombre != 'INGRESO'){
            //buscar la ultima asignacion
            const asigAnt = await Asignacion_cargo_empleado.findOne({where : {
                //[Op.and]:[ {activo: { [Op.eq]: 1, } }, {id_empleado:{[Op.eq]:body.id_empleado } } ]
                activo: 1,
                id_empleado:body.id_empleado
            },
            order: [['id', 'DESC']],
            limit: 1
            });
            
            //restar un dia a la fecha inicio
            const fecha_limite = moment(body.fecha_inicio).subtract(1, 'day');
            await asigAnt.update({estado:'CE', fecha_limite: fecha_limite}, { transaction: t });

            //console.log("ultima asig:", asigAnt);
        }
        
        //actulizar asignación
        const asigCargoEmpew = await Asignacion_cargo_empleado.create(body, { transaction : t});
        
        await t.commit();
        return res.status(201).json({
            ok: true,
            asigCargoEmpew
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAsigCargoEmp = async (req = request, res = response) => {
    
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const asigCargoEmp = await Asignacion_cargo_empleado.findOne({where: {id}} );
        await asigCargoEmp.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Asignación cargo al empleado modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateRetiroAsigCargoEmp = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const body = req.body;
        let id_empleado = body.id_empleado;


        //const capacitacion = await Capacitacion.findByPk(id);
        const asigCargoEmp = await Asignacion_cargo_empleado.findOne({where: {id}} );
        await asigCargoEmp.update(body, { transaction : t});
        
        await Asignacion_cargo_empleado.update(
            { estado: 'CE' },
            {
              where: {
                id_empleado: id_empleado,
              }, transaction: t

            },
            
          );
        await Empleado.update(
            { id_tipo_movimiento: body.id_tipo_movimiento },
            {
              where: {
                id: id_empleado,
              }, transaction: t

            },
            
          );
        await t.commit();
        return res.status(201).json({
            ok: true,
            msg: 'Asignación cargo al empleado modificada exitosamente'
        });   
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAsigCargoEmp = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const asigCargoEmp = await Asignacion_cargo_empleado.findByPk(id);
        await asigCargoEmp.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Asignación cargo al empleado se activado exitosamente' : 'Asignación cargo al empleado se inactivo exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const importarAsigCargoDestino = async (req = request, res = response ) => {
    //const t = await sequelize.transaction();
    try {
        //let {id_mes }= req.query;
        const  body  = req.body;
        //console.log("solicitudu.............:",req);
        const user = await Users.findByPk(req.userAuth.id)
        const fileExcel = req.files.file.data; //req.files['file'][0];
        const fileImage = req.files.file2;//req.files['file2'][0];
        
         
        //console.log("archivo guardado 1",fileExcel, "archivo guardado 2:", fileImage);
        // Llamar al helper para guardar el archivo
        //const nombreFile2 = await saveFile(fileImage);
        //const nombreFile2 = await fileMoveAndRemoveOld(fileImage,'','destino','destino');
        //const nombreFile2 = await fileMoveAndRemoveOld(fileImage,'','destino','destino');
        const nombreFile2 = await fileMoveAndRemoveOld(fileImage,'','asig_dest','asigDestinos');
        const observacion = await processExcel(fileExcel, 1, body.id_mes, user, nombreFile2);
        
        //console.log("...............observaciones:", observacion);
        if( observacion.length > 1){
            // Crear un nuevo libro de trabajo
            const workbook = xlsx.utils.book_new();

            // Crear una hoja a partir de los datos
            const worksheet = xlsx.utils.aoa_to_sheet(observacion);

            // Agregar la hoja al libro de trabajo
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

            // Guardar el archivo Excel temporalmente
            const nameFile = 'observacion_asginacion.xlsx';//`${uuidv4()}.pdf`;
            // const outputFileName = 'public/upload/'+nameFile;
            const filePath = path.join(__dirname, '../../public/upload/', nameFile);  // Ruta al archivo PDF en el servidor

            //const excelPath = path.join(__dirname, 'observaciones.xlsx');
            xlsx.writeFile(workbook, filePath);

            // Escribir el archivo Excel en un buffer
            //const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

            // Configurar las cabeceras para la descarga
            // res.setHeader('Content-Disposition', 'attachment; filename="observaciones.xlsx"');
            // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            // console.log("enviar archivo...........");
            // // Enviar el buffer como respuesta para que el cliente descargue el archivo
            // //res.send(buffer);
            // res.sendFile(filePath, (err) => {
            //     if (err) {
            //       console.error('Error enviando archivo:', err);
            //     }
            //     // Eliminar el archivo temporal después de enviarlo
            //     fs.unlinkSync(filePath);
            //   });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="observaciones_asignacion.xlsx"');
            
            // Enviar el archivo
            res.sendFile(filePath, (err) => {
            if (err) {
                console.log('Error al enviar el archivo:', err);
                res.status(500).send('Error al descargar el archivo.');
            }else{
                console.log("se envio");
            }
            });
            console.log("respuesta:",res.header);
        
        }else{
        // body.activo = 1;
        // const empleadoNew = await Empleado.create(body);
        //wait t.commit();
            res.json({ message: 'Archivo procesado con éxito, sin observaciones.' });
            // res.status(201).json({
            //     ok: true,
            //     message: 'Archivo procesado con éxito, sin observaciones.'
            //     //empleadoNew            
            // });
        }
        
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
function processExcel(excelBuffer, t, id_mes, user, nombreFile) {

    const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
    // Cargar el archivo Excel desde la ubicación temporal
    //const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const options = {
        header: 1,
        // raw: false, 
        // dateNF: 'yyyy-mm-dd', // Specify the date format string here
        
      };
    const excelData = xlsx.utils.sheet_to_json(worksheet, options );
    
    return insertExcelIntoDatabase(excelData,  id_mes, user, nombreFile);

}

async function insertExcelIntoDatabase(data, id_mes, user, nombre_file) {
    
    try{
        
        const meses = await Mes.findOne({where: { id: id_mes }} );
        const periodoIni = moment(meses.fecha_inicio);
        const periodoLimit = moment(meses.fecha_limite);

        let observados = [['codigo empleado','codigo reparticion', 'destino','codigo destino', 'kardex_1','kardex_2','ci','empleado', 'Observación']];
        let obs = "";
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            //console.log("fila excel:", row );
            //datos
            if( row[0] ){
                let codigo = parseInt(row[1]);
                let nombreDestino = row[2];
                let codReparticion = row[3];
                let codDestino = row[4];
                let kardex1 = row[5];
                let kardex2 = row[6];
                
                
                const fechaBase = moment('1900-01-01');
                
                const fechaDesde = fechaBase.add(row[7] - 2, 'days');
                let dateIni = fechaDesde;//fechaDesde.subtract(1, 'days');;
                const periodoLimitAntAsig = fechaDesde.clone().subtract(1, 'days');
                const existEmpleado = await Empleado.findOne( { where: { cod_empleado:  codigo }, include: [{ association: 'empleado_asignacioncargoemp',  attributes: {exclude: ['createdAt'] }, order: [['id', 'DESC']], where:{ activo:1, estado:'AC' } },] } );
                const existReparticion = await Reparticion.findOne( { where: { codigo:  codReparticion } } );
                const existDestino = await Destino.findOne( { where: { codigo:  codDestino },  } );
                
                if(existEmpleado && existReparticion && existDestino){
                    //verificar y registrar empleado
                    const asignacionCargo = {
                        id_gestion: meses.id_gestion,
                        id_empleado: existEmpleado.id,
                        id_cargo: existEmpleado.empleado_asignacioncargoemp[0].id_cargo,
                        id_tipo_movimiento: 4, //destino id 4
                        id_organismo: existEmpleado.empleado_asignacioncargoemp[0].id_organismo,
                        id_reparticion: existReparticion.id ,
                        id_destino: existDestino.id,
                        ci_empleado: existEmpleado.numero_documento,
                        fecha_inicio:fechaDesde,
                        motivo: kardex1,
                        referencia: kardex2,
                        nombre_file: nombre_file.newFileName,
                        nro_item: existEmpleado.empleado_asignacioncargoemp[0].nro_item,
                        estado: 'AC',
                        activo: 1,
                        id_user_create: user.id                        
                    };

                    const existAsignacionCargo = await Asignacion_cargo_empleado.findOne( { where: { 
                        id_gestion: meses.id_gestion, id_empleado: existEmpleado.id,
                        id_cargo: existEmpleado.empleado_asignacioncargoemp[0].id_cargo,
                        id_tipo_movimiento: 4, id_organismo: existEmpleado.empleado_asignacioncargoemp[0].id_organismo, id_reparticion: existReparticion.id ,
                        id_destino: existDestino.id, ci_empleado: existEmpleado.numero_documento,
                        fecha_inicio:periodoIni, activo:1
                     } } );
                
                    if(!existAsignacionCargo){
                        const asignacionCargoNew = await Asignacion_cargo_empleado.create( asignacionCargo );
                        const asigCargoEmp = await Asignacion_cargo_empleado.findByPk( existEmpleado.empleado_asignacioncargoemp[0].id );
                        await asigCargoEmp.update({ estado:'CE', fecha_limite:periodoLimitAntAsig });

                        

                    }else{
                        obs = "Existe registro";
                        observados.push(
                            [codigo, codReparticion, nombreDestino, codDestino, kardex1, kardex2, existEmpleado.numero_documento, existEmpleado.nombre+' '+existEmpleado.paterno, obs]
                        );                    
                          
                    }
                }else{
                    obs = existEmpleado?( existReparticion ? "No existe destino": "No existe reparticion" ) :"No existe el empleado/ No existe una asignación de cargo" ;  

                    observados.push(
                        [codigo, codReparticion, nombreDestino, codDestino, kardex1, kardex2, existEmpleado?.numero_documento, existEmpleado?.nombre+' '+existEmpleado?.paterno, obs]
                    );
                }      
            }
            obs = ""; 
        }
        
        return observados;
        
    } catch (error) {
        console.log("Error", error);
        //await t.rollback();
    }
}


module.exports = {
    getAsigCargoEmpPaginate,
    newAsigCargoEmp,
    updateAsigCargoEmp,
    activeInactiveAsigCargoEmp,
    updateRetiroAsigCargoEmp,
    importarAsigCargoDestino
};