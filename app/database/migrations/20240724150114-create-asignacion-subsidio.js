'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asignacion_subsidios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_tipo_descuento: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'tipo_descuento_sanciones',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_empleado: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'empleados',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_municipio: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'municipios',
            schema: 'public'
          },
          key: "id",
        },
      },
      monto: {
        type: Sequelize.DECIMAL(8,2)
      },
      unidad: {
        type: Sequelize.STRING(2)
      },
      tipo_pago:{
        type: Sequelize.STRING(20)
      },
      fecha_inicio: {
        type: Sequelize.DATE
      },
      fecha_limite: {
        type: Sequelize.DATE
      },
      memo_nro: {
        type: Sequelize.STRING(10)
      },
      memo_detalle: {
        type: Sequelize.STRING(200)
      },
      numero_cuota: {
        type: Sequelize.INTEGER
      },
      nombre_archivo: {
        type: Sequelize.STRING(50)
      },
      estado: {
        type: Sequelize.STRING(2)
      },
      activo: {
        type: Sequelize.BIGINT
      },
      id_user_create: {
        type: Sequelize.INTEGER
      },
      id_user_mod: {
        type: Sequelize.INTEGER
      },
      id_user_delete: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asignacion_subsidios');
  }
};