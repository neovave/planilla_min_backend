'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tipo_descuento_sanciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // id_acreedor: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: {
      //       tableName: 'beneficiario_acreedores',
      //       schema: 'public'
      //     },
      //     key: "id",
      //   },
      // },
      id_grupodescuento: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'grupo_descuentos',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_acreedor:{
        type: Sequelize.INTEGER
      },
      codigo:{
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(120)
      },
      nombre_abreviado: {
        type: Sequelize.STRING(20)
      },
      grupo: {
        type: Sequelize.STRING(10)
      },
      tipo: {
        type: Sequelize.STRING(100)
      },
      descripcion: {
        type: Sequelize.STRING(200)
      },
      unidad: {
        type: Sequelize.STRING(3)
      },
      con_beneficiario: {
        type: Sequelize.BOOLEAN
      },
      servicio: {
        type: Sequelize.STRING(20)
      },
      // grupo_suma: {
      //   type: Sequelize.INTEGER
      // },
      // grupo_nombre: {
      //   type: Sequelize.STRING(200)
      // },
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
    await queryInterface.dropTable('tipo_descuento_sanciones');
  }
};