
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Beneficiario_acreedor, sequelize } = require('../database/config');
const paginate = require('../helpers/paginate');

const getBenefAcreedorPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_asig_descuento,id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_asig_descuento? {id_asig_descuento} : {}, id? {id}:{}
                ],
            },
            include: [
                { association: 'Asignacion_descuento',  attributes: {exclude: ['createdAt']},                  
                }, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let benAcreedor = await paginate(Beneficiario_acreedor, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            benAcreedor
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newBenefAcreedor = async (req = request, res = response ) => {
    try {
        const body = req.body;
        const beneAcreedorNew = await Beneficiario_acreedor.create(body);
        return res.status(201).json({
            ok: true,
            beneAcreedorNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateBenefAcreedor = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const benefAcreedor = await Beneficiario_acreedor.findOne({where: {id}} );
        await benefAcreedor.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Beneficiario modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveBenefAcreedor = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const benefAcreedor = await Beneficiario_acreedor.findByPk(id);
        await benefAcreedor.update({estado});
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

module.exports = {
    getBenefAcreedorPaginate,
    newBenefAcreedor,
    updateBenefAcreedor,
    activeInactiveBenefAcreedor
};