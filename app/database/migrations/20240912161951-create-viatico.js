'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('viaticos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      numero: {
        type: Sequelize.STRING(10)
      },
      memo: {
        type: Sequelize.STRING(20)
      },
      detalle: {
        type: Sequelize.STRING(500)
      },
      importe: {
        type: Sequelize.DECIMAL(8,2)
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
    await queryInterface.dropTable('viaticos');
  }
};