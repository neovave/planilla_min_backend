'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mes.belongsTo(models.Gestion,{as:'mes_gestion', foreignKey:'id_gestion'});
      Mes.hasMany(models.Asistencia,{as:'mes_asistencia', foreignKey:'id_mes'});
      Mes.hasMany(models.Ufv,{as:'mes_ufv', foreignKey:'id_mes'});
      Mes.hasMany(models.Rciva_certificacion,{as:'mes_rcivacertificacion', foreignKey:'id_mes'});
      Mes.hasMany(models.Rciva_descargo_salario,{as:'mes_rcivadescargosalario', foreignKey:'id_mes'});
      Mes.hasMany(models.Rciva_planilla,{as:'mes_rcivaplanilla', foreignKey:'id_mes'});
      Mes.hasMany(models.Salario_planilla,{as:'mes_salarioplanilla', foreignKey:'id_mes'});
    }
  }
  Mes.init({
    mes_literal: DataTypes.STRING(15),
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    id_user_cierre: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Mes',
    tableName: 'meses',
  });
  return Mes;
};