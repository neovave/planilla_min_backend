'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salario_planilla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Salario_planilla.belongsTo(models.Mes,{as:'salarioplanilla_mes', foreignKey:'id_mes'});
      Salario_planilla.belongsTo(models.Empleado,{as:'salarioplanilla_empleado', foreignKey:'id_empleado'});
      Salario_planilla.hasMany(models.Rciva_planilla,{as:'salarioplanilla_rcivaplanilla', foreignKey:'id_salario_planilla'});
      Salario_planilla.belongsTo(models.Asignacion_cargo_empleado,{as:'salarioplanilla_asignacioncargoemp', foreignKey:'id_asig_cargo'});
    }
  }
  Salario_planilla.init({
    asistencia: DataTypes.JSONB,
    id_asig_emp: DataTypes.STRING,
    edad_empleado: DataTypes.INTEGER,
    haber_basico_dia: DataTypes.DECIMAL(8,2),
    antiguedad: DataTypes.DECIMAL(8,2),
    total_ganado: DataTypes.DECIMAL(8,2),
    total_iva: DataTypes.DECIMAL(8,2),
    aporte_laboral_afp: DataTypes.JSONB,
    total_afp: DataTypes.DECIMAL(8,2),
    aporte_patronal: DataTypes.JSONB,
    total_patronal: DataTypes.DECIMAL(8,2),
    aporte_solidario: DataTypes.JSONB,
    total_ap_solidario: DataTypes.DECIMAL(8,2),
    descuento_adm: DataTypes.JSONB,
    total_descuento: DataTypes.DECIMAL(8,2),
    sanciones_adm: DataTypes.JSONB,
    total_sanciones: DataTypes.DECIMAL(8,2),
    sancion_asistencia: DataTypes.DECIMAL(8,2),
    otros_descuentos: DataTypes.DECIMAL(8,2),
    liquido_pagable: DataTypes.DECIMAL(8,2),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Salario_planilla',
    tableName: 'salario_planillas',
  });
  return Salario_planilla;
};