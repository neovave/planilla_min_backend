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
      id_organismo: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'organismos',
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
      codigo: {
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
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