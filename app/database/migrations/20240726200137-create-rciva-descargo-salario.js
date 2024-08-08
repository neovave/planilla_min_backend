'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rciva_descargo_salarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_mes: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'meses',
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
      nro_orden: {
        type: Sequelize.STRING(20)
      },
      total_facturas: {
        type: Sequelize.DECIMAL(8,2)
      },
      importe_cod26: {
        type: Sequelize.DECIMAL(8,2)
      },
      total_cod113: {
        type: Sequelize.DECIMAL(8,2)
      },
      importe_cod113: {
        type: Sequelize.DECIMAL(8,2)
      },
      importe_rciva: {
        type: Sequelize.DECIMAL(8,2)
      },
      importe_cod464: {
        type: Sequelize.DECIMAL(8,2)
      },
      importe_cod465: {
        type: Sequelize.DECIMAL(8,2)
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
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        //allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rciva_descargo_salarios');
  }
};