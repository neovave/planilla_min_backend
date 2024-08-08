'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preventivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Preventivo.belongsTo(models.Tipo_planilla,{as:'preventivo_tipoplanilla',foreignKey:'id_tipo_planilla'});
    }
  }
  Preventivo.init({    
    num_preventivo: DataTypes.STRING(10),
    glosa: DataTypes.STRING(200),
    cod_unidad_org: DataTypes.STRING(5),
    desc_area_org: DataTypes.STRING(100),
    fuente_organismo: DataTypes.STRING(7),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Preventivo',
    tableName: 'preventivos',
  });
  return Preventivo;
};