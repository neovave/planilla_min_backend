'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bonos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre_abreviado: {
        type: Sequelize.STRING(20)
      },
      descripcion: {
        type: Sequelize.STRING(200)
      },
      porcentaje: {
        type: Sequelize.DECIMAL(8,2)
      },
      porcen_cargo: {
        type: Sequelize.JSONB
      },
      requisitos: {
        type: Sequelize.STRING(1000)
      },
      tipo: {
        type: Sequelize.STRING(20)
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
      }, 
      deletedAt: {
        //allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bonos');
  }
};