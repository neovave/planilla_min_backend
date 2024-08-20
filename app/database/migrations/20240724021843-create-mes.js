'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('meses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_gestion: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'gestiones',
            schema: 'public'
          },
          key: "id",
        },
      },
      mes_literal: {
        type: Sequelize.STRING(15)
      },
      fecha_inicio: {
        type: Sequelize.DATE
      },
      fecha_limite: {
        type: Sequelize.DATE
      },
      id_user_cierre: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.STRING(2)
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
    await queryInterface.dropTable('meses');
  }
};