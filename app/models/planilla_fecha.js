'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Planilla_fecha extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Planilla_fecha.belongsTo(models.Mes,{as:'planillafecha_mes', foreignKey:'id_mes'});
      Planilla_fecha.hasMany(models.Rciva_planilla,{as:'planillafecha_rcivaplanilla', foreignKey:'id_rciva_planilla_fecha'});      
    }
  }
  Planilla_fecha.init({
    fecha_limite: DataTypes.DATE,
    tipo: DataTypes.STRING,
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Planilla_fecha',
    tableName: 'planilla_fechas',
  });
  return Planilla_fecha;
};