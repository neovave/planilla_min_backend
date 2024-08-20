'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gestiones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gestiones: {
        type: Sequelize.STRING(4)
      },
      fecha_inicio: {
        type: Sequelize.DATE
      },
      fecha_limite: {
        type: Sequelize.DATE
      },
      motivo_cierre: {
        type: Sequelize.STRING(200)
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
    await queryInterface.dropTable('gestiones');
  }
};