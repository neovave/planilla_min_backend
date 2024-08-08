'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cargos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'categoria_cargos',
            schema: 'public'
          },
          key: "id",
        },
      },
      codigo: {
        type: Sequelize.STRING(10)
      },
      descripcion: {
        type: Sequelize.STRING(200)
      },
      monto: {
        type: Sequelize.DECIMAL(8,2)
      },
      nivel: {
        type: Sequelize.INTEGER
      },
      cantidad_item: {
        type: Sequelize.INTEGER
      },
      tipo: {
        type: Sequelize.STRING(20)
      },
      monto_mensual: {
        type: Sequelize.DECIMAL(8,2)
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
    await queryInterface.dropTable('cargos');
  }
};