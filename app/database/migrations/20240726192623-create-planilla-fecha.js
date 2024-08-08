'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('planilla_fechas', {
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
      fecha_limite: {
        type: Sequelize.DATE
      },
      tipo: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('planilla_fechas');
  }
};