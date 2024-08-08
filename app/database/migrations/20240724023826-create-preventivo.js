'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preventivos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_tipo_planilla: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'tipo_planillas',
            schema: 'public'
          },
          key: "id",
        },
      },
      num_preventivo: {
        type: Sequelize.STRING(10)
      },
      glosa: {
        type: Sequelize.STRING(200)
      },
      cod_unidad_org: {
        type: Sequelize.STRING(5)
      },
      desc_area_org: {
        type: Sequelize.STRING(100)
      },
      fuente_organismo: {
        type: Sequelize.STRING(7)
      },
      id_user_create: {
        type: Sequelize.INTEGER
      },
      id_user_mod: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('preventivos');
  }
};