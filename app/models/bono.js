'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bono extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bono.hasMany(models.Asignacion_bono,{as:'bono_asignacionbono', foreignKey:'id_bono'});
    }
  }
  Bono.init({
    
    nombre_abreviado: DataTypes.STRING(20),
    descripcion: DataTypes.STRING(200),
    porcentaje: DataTypes.DECIMAL(8,2),
    requisitos: DataTypes.STRING(300),
    tipo: DataTypes.STRING(20),
    activo: DataTypes.BIGINT

  }, {
    sequelize,
    modelName: 'Bono',
    tableName: 'bonos',
  });
  return Bono;
};