'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      
      Gestion.hasMany(models.Mes,{as:'gestiones_mese' ,foreignKey: 'id_gestion' });
      Gestion.hasMany(models.Asignacion_cargo_empleado,{as:'gestion_asignacioncargoemp' ,foreignKey: 'id_gestion'});
      Gestion.hasMany(models.Incremento,{as:'gestion_incremento' ,foreignKey: 'id_gestion'});
    }
  }
  Gestion.init({
    gestiones: DataTypes.STRING(4),
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    motivo_cierre: DataTypes.STRING(200),
    id_user_cierre: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Gestion',
    tableName: 'gestiones',
  });
  return Gestion;
};