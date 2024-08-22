'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('empleados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        //primaryKey: true,
        type: Sequelize.DataTypes.UUID,        
        //defaultValue: Sequelize.UUIDV4, CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        defaultValue: Sequelize.literal( 'uuid_generate_v4()' ),        
        allowNull: false
      },
      cod_empleado: {
        type: Sequelize.INTEGER
      },
      id_expedido: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'lugar_expedidos',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_grado_academico: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'grado_academicos',
            schema: 'public'
          },
          key: "id",
        },
      },
      numero_documento: {
        type: Sequelize.STRING(10)
      },
      complemento: {
        type: Sequelize.STRING(10)
      },
      nombre: {
        type: Sequelize.STRING(20)
      },
      otro_nombre: {
        type: Sequelize.STRING(20)
      },
      paterno: {
        type: Sequelize.STRING(20)
      },
      materno: {
        type: Sequelize.STRING(20)
      },
      ap_esposo: {
        type: Sequelize.STRING(20)
      },
      fecha_nacimiento: {
        type: Sequelize.DATE
      },
      nacionalidad: {
        type: Sequelize.STRING(100)
      },
      sexo: {
        type: Sequelize.STRING(10)
      },
      nua: {
        type: Sequelize.STRING(10)
      },
      cuenta_bancaria: {
        type: Sequelize.STRING(20)
      },
      tipo_documento: {
        type: Sequelize.STRING(2)
      },
      cod_rciva: {
        type: Sequelize.STRING(20)
      },
      cod_rentista: {
        type: Sequelize.STRING(20)
      },
      correo: {
        type: Sequelize.STRING(50)
      },
      telefono: {
        type: Sequelize.STRING(40)
      },
      celular: {
        type: Sequelize.STRING(40)
      },
      activo: {
        type: Sequelize.BIGINT
      },      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('empleados');
  }
};