
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Gestion, Mes , sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getGestionPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo }, id?{id}:{}
                ],
                
            },
            include: [
                { association: 'gestiones_mese',  attributes: {exclude: ['createdAt']},  
                    /*where: type == 'capacitacion_curso.nombre' ? {
                        nombre: {[Op.iLike]: `%${filter}%`}
                    }:type =='capacitacion_curso.tipo' ? {
                        tipo:{[Op.iLike]: `%${filter}%`}
                    }:{}, */
                    where: {
                        [Op.and]:[
                            { activo } ,
                            
                        ]
                    }
                },
            ],
        };
        let gestiones = await paginate(Gestion, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            gestiones
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newGestion = async (req = request, res = response ) => {

    const t = await sequelize .transaction();
    try {
        const { gestiones } = req.body;
        
        let gestion = { gestiones: gestiones };
        //console-log ("gestiones------------------:",gestion);
        gestion.activo = '1';
        // Crear la fecha de inicio de la gestión
        const fecha_inicio = moment(`${gestion.gestiones}-01-01`, 'YYYY-MM-DD');
        // Calcular la fecha de inicio de la siguiente gestión para obtener el fin
        const fechaInicioSiguienteGestion = moment(fecha_inicio).add(1, 'years');
        const fecha_limite = moment(fechaInicioSiguienteGestion).subtract(1, 'day');
        gestion.fecha_inicio = fecha_inicio;
        gestion.fecha_limite = fecha_limite;

        const gestionNew = await Gestion.create(gestion, { transaction : t});
        let a = JSON.stringify( gestionNew );
        let b = JSON.parse(a);

        const mesesData = generarMesesConFechas(gestion.gestiones, b.id);
        const mesNew = await Mes.bulkCreate(mesesData, { transaction : t});
        await t.commit();
        return res.status(201).json({
            ok: true,
            gestionNew
        });
    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
function generarMesesConFechas(year, id) {
    // const meses = [];
    // for (let i = 1; i <= 12; i++) {
    //     const inicioMes = moment(`${gestion}-${i}-01 00:00:00`, 'YYYY-MM-DD');
    //     const finMes = inicioMes.clone().endOf('month');

    //     meses.push({
    //         mes_literal: inicioMes.format('MMMM'),
    //         id_gestion: id,
    //         fecha_inicio: inicioMes.format('YYYY-MM-DD'),
    //         fecha_limite: finMes.format('YYYY-MM-DD'),
    //         activo:1 
    //     });
    // }
    // return meses;
    
        let meses = [];
        const meses_literal = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        for (let mes = 0; mes < 12; mes++) {
            let inicioMes = moment({ year, month: mes }).startOf('month').toDate();
            let finMes = moment({ year, month: mes }).endOf('month').toDate();
            meses.push({
                mes_literal: meses_literal[mes], //moment({ month: mes }).format('MMMM'),
                id_gestion: id,
                fecha_inicio: inicioMes,
                fecha_limite: finMes
            });
        }
        return meses;
    
}
const updateGestion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const gestiones = await Gestion.findOne({where: {id}} );
        await gestiones.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Gestion modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveGestion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo, motivo_cierre } = req.body;
        const gestiones = await Gestion.findByPk(id);
        await gestiones.update({motivo_cierre,activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Gestion activada exitosamente' : 'Gestion inactiva exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

module.exports = {
    getGestionPaginate,
    newGestion,
    updateGestion,
    activeInactiveGestion
};