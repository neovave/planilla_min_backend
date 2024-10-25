'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reparticiones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      codigo: {
        type: Sequelize.STRING(10)
      },
      sigla: {
        type: Sequelize.STRING(20)
      },
      nombre: {
        type: Sequelize.STRING(200)
      },
      nombre_abreviado: {
        type: Sequelize.STRING(100)
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
    await queryInterface.dropTable('reparticiones');
  }
};