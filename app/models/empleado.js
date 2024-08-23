'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empleado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Empleado.hasMany(models.Users,{as:'user_emplado' ,foreignKey: 'id_empleado' });
      Empleado.belongsTo(models.Lugar_expedido,{as:'empleado_ci_expedido', foreignKey:'id_expedido'});
      Empleado.belongsTo(models.Grado_academico,{as:'empleado_gradoacademico', foreignKey:'id_grado_academico'});
      Empleado.belongsTo(models.Tipo_movimiento,{as:'empleado_tipomovimiento', foreignKey:'id_tipo_movimiento'});
      Empleado.hasMany(models.Asignacion_descuento,{as:'empleado_asignaciondescuento', foreignKey:'id_empleado'});
      Empleado.hasMany(models.Asignacion_sancion,{as:'empleado_asignacionsancion', foreignKey:'id_empleado'});
      //Empleado.hasMany(models.Seguro_empleado,{as:'empleado_seguroempleado', foreignKey:'id_empleado'});
      Empleado.hasMany(models.Aporte_empleado,{as:'empleado_aporteempleado', foreignKey:'id_empleado'});
      //Empleado.hasMany(models.aporte_asignacioncargoemp,{as:'empleado_asignacioncargoemp', foreignKey:'id_empleado'});
      Empleado.hasMany(models.Asistencia,{as:'empleado_asistencia', foreignKey:'id_empleado'});
      Empleado.hasMany(models.Rciva_certificacion,{as:'empleado_rcivacertificacion', foreignKey:'id_empleado'});
      Empleado.hasMany(models.Rciva_descargo_salario,{as:'empleado_rcivadescargosalario', foreignKey:'id_empleado'});
      Empleado.hasMany(models.Salario_planilla,{as:'empleado_salarioplanilla', foreignKey:'id_empleado'});
    }
  }
  Empleado.init({
    uuid: DataTypes.TEXT,
    cod_empleado: DataTypes.INTEGER,
    numero_documento: DataTypes.STRING(10),
    complemento: DataTypes.STRING(10),
    nombre: DataTypes.STRING(20),
    otro_nombre: DataTypes.STRING(20),
    paterno:DataTypes.STRING(20),
    materno: DataTypes.STRING(20),
    ap_esposo: DataTypes.STRING(20),
    fecha_nacimiento: DataTypes.DATE,
    nacionalidad: DataTypes.STRING(100),
    sexo: DataTypes.STRING(10),
    nua: DataTypes.STRING(10),
    cuenta_bancaria: DataTypes.STRING(20),
    tipo_documento: DataTypes.STRING(2),
    cod_rciva: DataTypes.STRING(20),
    cod_rentista: DataTypes.STRING(20),
    correo: DataTypes.STRING(50),
    telefono: DataTypes.STRING(40),
    celular: DataTypes.STRING(40),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Empleado',
    tableName: 'empleados',
  });
  return Empleado;
};