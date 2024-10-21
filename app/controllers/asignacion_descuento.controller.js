
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_descuento, sequelize, Tipo_descuento_sancion, Beneficiario_acreedor, Empleado } = require('../database/config');
const paginate = require('../helpers/paginate');

const getAsigDescuentoPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_tipo_descuento,id, id_empleado, grupo} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            
            include: [
                { association: 'asiganciondescuento_tipodes',  attributes: {exclude: ['createdAt']},  
                    // where: type == 'capacitacion_curso.nombre' ? {
                    //     nombre: {[Op.iLike]: `%${filter}%`}
                    // }:type =='capacitacion_curso.tipo' ? {
                    //     tipo:{[Op.iLike]: `%${filter}%`}
                    // }:{},
                    // where: {
                    //     [Op.and]:[
                    //         tipo? tipo:{},
                    //         //{tipo:{[Op.iLike]: `%${filter}%`}}
                    //     ]
                    // }
                }, 
                { association: 'asignaciondescuento_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                // { association: 'asignaciondescuento_beneficiario',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                
            ],
            where: { 
                [Op.and]: [
                    { activo }, id_tipo_descuento? {id_tipo_descuento} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}, 
                    grupo? { '$asiganciondescuento_tipodes.grupo$': { [Op.eq]: grupo } }:{}
                    /*type =='capacitacion_curso.codigo' ? {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    }:{},                    */
                ],
                 
            },
        };
        if(type?.includes('.')){
            type = null;
        }
        let asigDesc = await paginate(Asignacion_descuento, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asigDesc
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAsigDescuento = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        let asig_desc = { 
            id_tipo_descuento: body.id_tipo_descuento, 
            id_empleado:    body.id_empleado, 
            cod_empleado:   body.cod_empleado, 
            monto:          body.monto, 
            unidad:         body.unidad, 
            institucion:    body.institucion, 
            fecha_inicio:   body.fecha_inicio, 
            fecha_limite:   body.fecha_limite, 
            memo_nro:       body.memo_nro, 
            memo_detalle:   body.memo_detalle,
            id_municipio:   body.id_municipio,
            estado:         body.estado, 
            activo:         body.activo };
        let id = body.id_tipo_descuento;
        const asigDescuentoNew = await Asignacion_descuento.create(asig_desc, { transaction : t});
        const tdesc = await Tipo_descuento_sancion.findOne({ where: { id } });
                    
        if(tdesc.con_beneficiario){
            let benef_acre = { 
                id_asig_descuento: asigDescuentoNew.id, 
                detalle_ruc:    body.detalle_ruc, 
                ci_ruc:         body.ci_ruc, 
                tipo:           body.tipo, 
                descripcion:    body.descripcion, 
                activo:         body.activo };

            const benefAcreedorNew = await Beneficiario_acreedor.create(benef_acre, { transaction : t});
        }
        
        await t.commit()
        ;
        return res.status(201).json({
            ok: true,
            asigDescuentoNew
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

const updateAsigDescuento = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { id, id_beneficiario  } = req.params;
        const body = req.body;

        let asig_desc = { 
            id_tipo_descuento: body.id_tipo_descuento, 
            id_empleado:    body.id_empleado, 
            cod_empleado:   body.cod_empleado, 
            monto:          body.monto, 
            unidad:         body.unidad, 
            institucion:    body.institucion, 
            fecha_inicio:   body.fecha_inicio, 
            fecha_limite:   body.fecha_limite, 
            memo_nro:       body.memo_nro, 
            memo_detalle:   body.memo_detalle,
            id_municipio:   body.id_municipio,
            estado:         body.estado, 
            activo:         body.activo };
        //let id = body.id_tipo_descuento;
        const tdesc = await Tipo_descuento_sancion.findOne({ where: { id:body.id_tipo_descuento } });

        //const capacitacion = await Capacitacion.findByPk(id);
        const asigDescuento = await Asignacion_descuento.findOne({where: {id}} );
        await asigDescuento.update(asig_desc,  { transaction : t});

        if(tdesc.con_beneficiario){
            let benef_acre = { 
                id_asig_descuento: id, 
                detalle_ruc:    body.detalle_ruc, 
                ci_ruc:         body.ci_ruc, 
                tipo:           body.tipo, 
                descripcion:    body.descripcion, 
                activo:         body.activo };

                console.log("beneficiario:", body );

                const asigBeneficiario = await Beneficiario_acreedor.findOne({where: {id: id_beneficiario}} );
                await asigBeneficiario.update(benef_acre,  { transaction : t});    
        }
        
        
        
        await t.commit()

        return res.status(201).json({
            ok: true,
            msg: 'Asignación descuento modificada exitosamente'
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

const activeInactiveAsigDescuento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const asigDescuento = await Asignacion_descuento.findByPk(id);
        await asigDescuento.update({estado});
        res.status(201).json({
            ok: true,
            msg: estado ==="AC"? 'Asignación descuento se activado exitosamente' : 'Asignación descuento se inactivo exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}


const importarDescuento = async (req = request, res = response ) => {
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
    try{
            
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            //datos
            let id_empleado = 0;
            let existeEmpleado = false;
            if( row[0] ){
                
                let ci_emp = parseFloat(row[1]);
                const existEmpleado = await Empleado.findOne( { where: { cod_empleado:  ci_emp  } } );
                
                    
            

                //verificar y registrar empleado
                const empleado = {
                    cod_empleado: existEmpleado,
                    monto: DataTypes.DECIMAL(8,2),
                    unidad: DataTypes.STRING(2),
                    institucion: DataTypes.STRING(8),
                    fecha_inicio: DataTypes.DATE,
                    fecha_limite: DataTypes.DATE,
                    memo_nro: DataTypes.STRING(10),
                    memo_detalle: DataTypes.STRING(200),
                    referencia: DataTypes.STRING(200),
                    estado: DataTypes.STRING(2),
                    id_user_create: DataTypes.INTEGER,
                    id_user_mod: DataTypes.INTEGER,
                    id_user_delete: DataTypes.INTEGER,
                    activo: DataTypes.BIGINT


                    cod_empleado: Number( row[3] ),
                    numero_documento: Number( row[5] ),
                    complemento: null,
                    nombre: nombre,
                    otro_nombre: otro_nombre,
                    paterno: apellidoPaterno,
                    materno: apellidoMaterno,
                    ap_esposo: null,
                    fecha_nacimiento: fechaNac, 
                    nacionalidad: 'BOLIVIANA',
                    sexo: null,
                    nua: Number( row[8]),
                    cuenta_bancaria: Number(row[9]),
                    tipo_documento: 'ci',
                    cod_rciva: null,//DataTypes.STRING(20),
                    cod_rentista: null,
                    correo: null,
                    telefono: null,
                    celular: null,
                    id_expedido: extension?extension.id:null,
                    id_grado_academico:null,
                    id_tipo_movimiento:1,
                    id_user_create: 0,
                    activo:1
                };
                const existEmp = await Empleado.findOne({where: { numero_documento: String( row[5] ) } } );
                
                if(!existEmp){
                    const empleadoNew = await Empleado.create(empleado );
                    id_empleado = empleadoNew.id;
                    console.log("No existe empleado.................:", existEmp);
                    
                }else{
                    console.log("existe empleado.................:", existEmp.id);
                    id_empleado = existEmp.id;
                    existeEmpleado = true;
                }
                
                //asisgnacion de cargo empleado
                const cargo = await Cargo.findOne({where: { abreviatura: formatearTexto( row[17] ) } } );
                const meses = await Mes.findOne({where: { id:id_mes }} );
                const reparticion = await Reparticion.findOne({where: { nombre: formatearTexto( row[1] ) }} );
                const destino = await Destino.findOne({where: { nombre: formatearTexto( row[2] ) }} );
                const esBaja = row[16]? true:false;
                const partFecha = row[15].split('/');
                const fechaFormated = `${partFecha[2]}-${partFecha[1]}-${partFecha[0]}`;
                const fechaIng = moment(fechaFormated, 'YY-MM-DD');
                console.log("fecha de ingreso.......................:,",fechaIng);
                const dataAsignacion = {
                    id_gestion:meses.id_gestion,
                    id_empleado:id_empleado,
                    id_cargo:cargo.id,
                    id_tipo_movimiento: 1,
                    id_reparticion: reparticion.id,
                    id_destino: destino.id,
                    ci_empleado: empleado.numero_documento,
                    fecha_inicio: fechaIng.format('YYYY-MM-DD'),
                    fecha_limite: esBaja? Date(row[16]):null,
                    motivo: esBaja? 'Baja':null,
                    nro_item: Number(row[4]),
                    ingreso: true,
                    retiro: esBaja?true:null,
                    activo: 1,
                    id_user_create: 0,
                    estado: 'AC',
                };
                
                
                
            }
        
        }
        
    } catch (error) {
        console.log("Error", error);
        //await t.rollback();
    }
}


module.exports = {
    getAsigDescuentoPaginate,
    newAsigDescuento,
    updateAsigDescuento,
    activeInactiveAsigDescuento,
    importarDescuento
};