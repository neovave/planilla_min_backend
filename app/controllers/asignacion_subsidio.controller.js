
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_subsidio, sequelize, Tipo_descuento_sancion, Beneficiario_acreedor, Users, Municipio, Empleado } = require('../database/config');
const paginate = require('../helpers/paginate');
const { fileMoveAndRemoveOld } = require('../helpers/file-upload');

const getAsigSubsidioPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_tipo_descuento,id, id_empleado, grupo} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            include: [
                {
                    model: Empleado,
                    as: 'asignacionsubsidio_empleado', // Alias de relación si fue definido en el modelo
                    required: false // LEFT OUTER JOIN
                  },
                  {
                    model: Tipo_descuento_sancion,
                    as: 'asigancionsubsidio_tipodes', // Alias de relación si fue definido en el modelo
                    required: false, // LEFT OUTER JOIN
                    where: {
                        [Op.and]: [ { activo }, grupo? {grupo}:{}]
                    }
                  },
                  {
                    model: Beneficiario_acreedor,
                    as: 'asignacionsubsidio_beneficiario', // Alias de relación si fue definido en el modelo
                    required: false // LEFT OUTER JOIN
                  },
                  {
                    model: Municipio,
                    as: 'asignacionsubsidio_municipio', // Alias de relación si fue definido en el modelo
                    required: false // LEFT OUTER JOIN
                  }
            ],
            where: { 
                [Op.and]: [
                    { activo }, id_tipo_descuento? {id_tipo_descuento} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}, 
                    //grupo? { '$asigancionsubsidio_tipodes.grupo$': { [Op.eq]: grupo } }:{}
                    /*type =='capacitacion_curso.codigo' ? {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    }:{},                    */
                ],
                 
            },
        };
        if(type?.includes('.')){
            type = null;
        }
        let asigSubsidio = await paginate(Asignacion_subsidio, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asigSubsidio
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAsigSubsidio = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const user = await Users.findByPk(req.userAuth.id);
        const file = req.files.file;
        //console.log("prueba de subisdio:",file);
        const nombreFile = await fileMoveAndRemoveOld(file,'','sub','subsidio');
        //const nombreFile = await saveFile(fileExcel,'../uploads/subsidio');

        const  body  = req.body;
        let asig_subsidio = {
            id_tipo_descuento: body.id_tipo_descuento, 
            id_empleado:    body.id_empleado, 
            monto:          body.monto, 
            unidad:         body.unidad, 
            tipo_pago:      body.tipo_pago, 
            fecha_inicio:   body.fecha_inicio, 
            fecha_limite:   body.fecha_limite, 
            memo_nro:       body.memo_nro, 
            memo_detalle:   body.memo_detalle,
            id_municipio:   body.id_municipio,
            numero_cuota:   body.numero_cuota,
            referencia:     body.referencia,
            nombre_archivo: nombreFile?.filePath,
            fecha_control:   body.fecha_control, 
            fecha_presentacion:   body.fecha_presentacion, 
            estado:         body.estado, 
            activo:         body.activo,
            id_user_create: user.id
         };
        let id = body.id_tipo_descuento;
        const asigSubsidioNew = await Asignacion_subsidio.create(asig_subsidio, { transaction : t});
        const tdesc = await Tipo_descuento_sancion.findOne({ where: { id } });
                    
        if(tdesc.con_beneficiario){
            let benef_acre = { 
                id_asig_subsidio: asigSubsidioNew.id, 
                detalle_ruc:    body.detalle_ruc, 
                ci_ruc:         body.ci_ruc, 
                //tipo:           body.tipo, 
                descripcion:    body.descripcion, 
                nro_cuenta:     body.nro_cuenta,
                activo:         body.activo,
                id_user_create: user.id
             };

            const benefAcreedorNew = await Beneficiario_acreedor.create(benef_acre, { transaction : t});
        }
        
        await t.commit()
        ;
        return res.status(201).json({
            ok: true,
            asigSubsidioNew
        });
    } catch (error) {
        console.log(error);
        await t.rollback()
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAsigSubsidio = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { id, id_beneficiario  } = req.params;
        console.log("id asignacion:", id, "id beneficiario:",id_beneficiario);
        const body = req.body;
        const user = await Users.findByPk(req.userAuth.id);
        const file = req.files.file;
        console.log("prueba de sistemas:", file);
        const nombreFile = await fileMoveAndRemoveOld(file,'','sub','subsidio');

        let asig_subsidio = { 
            id_tipo_descuento: body.id_tipo_descuento, 
            id_empleado:    body.id_empleado, 
            cod_empleado:   body.cod_empleado, 
            monto:          body.monto, 
            unidad:         body.unidad, 
            tipo_pago:      body.tipo_pago, 
            fecha_inicio:   body.fecha_inicio, 
            fecha_limite:   body.fecha_limite, 
            memo_nro:       body.memo_nro, 
            memo_detalle:   body.memo_detalle,
            id_municipio:   body.id_municipio,
            referencia:     body.referencia,
            numero_cuota:   body.numero_cuota,
            nombre_archivo: nombreFile?.filePath,
            fecha_control:   body.fecha_control, 
            fecha_presentacion:   body.fecha_presentacion, 
            estado:         body.estado, 
            activo:         body.activo ,
            id_user_mod:    user.id
            };
        //let id = body.id_tipo_descuento;
        const tdesc = await Tipo_descuento_sancion.findOne({ where: { id:body.id_tipo_descuento } });

        //const capacitacion = await Capacitacion.findByPk(id);
        const asigSubsidio = await Asignacion_subsidio.findOne({where: {id}} );
        await asigSubsidio.update(asig_subsidio,  { transaction : t});

        if(tdesc.con_beneficiario){
            let benef_acre = { 
                id_asig_subsidio: id, 
                detalle_ruc:    body.detalle_ruc, 
                ci_ruc:         body.ci_ruc, 
                //tipo:           body.tipo, 
                descripcion:    body.descripcion,
                nro_cuenta:     body.nro_cuenta,
                activo:         body.activo,
                id_user_mod:    user.id };

                
                const asigBeneficiario = await Beneficiario_acreedor.findOne({where: {id: id_beneficiario}} );
                await asigBeneficiario.update(benef_acre,  { transaction : t});    
        }
        
        
        
        await t.commit()

        return res.status(201).json({
            ok: true,
            msg: 'Asignación subsidio modificada exitosamente'
        });   
    } catch (error) {
        await t.rollback()
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAsigSubsidio = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const user = await Users.findByPk(req.userAuth.id);
        const asigSubsidio = await Asignacion_subsidio.findByPk(id);
        await asigSubsidio.update({estado, id_user_delete:user.id});
        res.status(201).json({
            ok: true,
            msg: estado ==="AC"? 'Asignación subsidio se activado exitosamente' : 'Asignación subsidio se inactivo exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const importarSubsidio = async (req = request, res = response ) => {
    //const t = await sequelize.transaction();
    try {
        //let {id_mes }= req.query;
        const  body  = req.body;
        const user = await Users.findByPk(req.userAuth.id)
        const excelBuffer = req.files.file.data;
        const fileImagen = req.files.file2;
        const observacion = await processExcel(excelBuffer, 1, body.id_mes, user);
        const nombreFile = await fileMoveAndRemoveOld(fileImagen,'','sub','subsidio');

        if( observacion.length > 1){
            // Crear un nuevo libro de trabajo
            const workbook = xlsx.utils.book_new();

            // Crear una hoja a partir de los datos
            const worksheet = xlsx.utils.aoa_to_sheet(observacion);

            // Agregar la hoja al libro de trabajo
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

            // Guardar el archivo Excel temporalmente
            const nameFile = 'observaciones.xlsx';//`${uuidv4()}.pdf`;
            const outputFileName = '../uploads/tmp/'+nameFile;
            const filePath = path.join(__dirname, outputFileName); 

            //const excelPath = path.join(__dirname, 'observaciones.xlsx');
            xlsx.writeFile(workbook, filePath);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="observaciones.xlsx"');
            
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
        
            res.json({ message: 'Archivo procesado con éxito, sin observaciones.' });
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
function processExcel(excelBuffer, t, id_mes, user) {

    const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const options = {
        header: 1,
        // raw: false, 
        // dateNF: 'yyyy-mm-dd', // Specify the date format string here
        
      };
    const excelData = xlsx.utils.sheet_to_json(worksheet, options );
  
    return insertExcelIntoDatabase(excelData,  id_mes, user);

}

async function insertExcelIntoDatabase(data, id_mes, user) {
        
    try{
        
        const meses = await Mes.findOne({where: { id: id_mes }} );
        const periodoIni = moment(meses.fecha_inicio);
        const periodoLimit = moment(meses.fecha_limite);
        let observados = [['codigo_empleado', 'concepto', 'monto','unidad', 'periodo','observación']];
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            //console.log("fila excel:", row );
            //datos
            if( row[0] ){
                
                let codigo = parseFloat(row[1]);
                let codDesc = parseInt(row[2]);
                let monto = parseFloat(row[6]);
                const existEmpleado = await Empleado.findOne( { where: { cod_empleado:  codigo } } );
                const existDescuento = await Tipo_descuento_sancion.findOne( { where: { codigo:  codDesc } } );

                if(existEmpleado && existDescuento){
                    //verificar y registrar empleado
                    const asignacionDescuento = {
                        id_tipo_descuento: existDescuento.id,
                        id_empleado: existEmpleado.id,
                        cod_empleado: codigo,
                        monto: monto,
                        unidad: row[5]=='B'? 'BS': (row[5]=='$'? '$':'%'),
                        //institucion: null,
                        fecha_inicio: periodoIni,
                        fecha_limite: periodoLimit,
                        memo_nro: 0,
                        memo_detalle: 'importacion masiva',
                        referencia: null,
                        estado: 'AC',
                        id_user_create: user.id,
                        activo: 1
                        //createdAt: new Date()
                        
                    };
                    const existAsignacion = await Asignacion_descuento.findOne( { where: { id_tipo_descuento:existDescuento.id, id_empleado: existEmpleado.id, fecha_inicio: periodoIni, fecha_limite: periodoLimit, monto: row[6] } } );
                
                    if(!existAsignacion){
                        const asignacionDescNew = await Asignacion_descuento.create( asignacionDescuento );
                        //console.log("No existe empleado.................:", existEmp);
                        
                    }else{
                        //console.log("existe empleado.................:", existEmp.id);
                        observados.push(
                            [codigo,codDesc,monto,row[5],periodoIni,'Existe registro en la base de datos']
                        );                    
                    }
                }else{
                    observados.push(
                        [codigo,codDesc,monto,row[5],periodoIni, existEmpleado?'No existe el tipo descuento':'No existe el empleado']
                    );
                }               
            }
            
        }
        
        return observados;
        
    } catch (error) {
        console.log("Error", error);
        //await t.rollback();
    }
}

module.exports = {
    getAsigSubsidioPaginate,
    newAsigSubsidio,
    updateAsigSubsidio,
    activeInactiveAsigSubsidio,
    importarSubsidio
};