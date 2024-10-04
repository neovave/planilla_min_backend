'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('beneficiario_acreedores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_asig_descuento: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'asignacion_descuentos',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_asig_subsidio: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'asignacion_subsidios',
            schema: 'public'
          },
          key: "id",
        },
      },
      detalle_ruc: {
        type: Sequelize.STRING(100)
      },
      ci_ruc: {
        type: Sequelize.STRING(20)
      },
      tipo: {
        type: Sequelize.STRING(30)
      },
      descripcion: {
        type: Sequelize.STRING(200)
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
    await queryInterface.dropTable('beneficiario_acreedores');
  }
};