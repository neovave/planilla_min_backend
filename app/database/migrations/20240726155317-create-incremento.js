'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incrementos', {
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
      id_cargo: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'cargos',
            schema: 'public'
          },
          key: "id",
        },
      },
      monto: {
        type: Sequelize.DECIMAL(8,2)
      },
      unidad: {
        type: Sequelize.STRING(2)
      },
      porcentaje: {
        type: Sequelize.DECIMAL(8,2)
      },
      descripcion: {
        type: Sequelize.STRING(200)
      },
      fecha_habilitacion: {
        type: Sequelize.DATE
      },
      fecha_limite: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('incrementos');
  }
};