'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salario_planillas', {
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
      id_empleado: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'empleados',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_incremento: {
        type: Sequelize.STRING
      },
      id_asistencia: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'asistencias',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_asig_emp: {
        type: Sequelize.STRING
      },
      edad_empleado: {
        type: Sequelize.INTEGER
      },
      haber_basico_dia: {
        type: Sequelize.DECIMAL(8,2)
      },
      antiguedad: {
        type: Sequelize.DECIMAL(8,2)
      },
      total_ganado: {
        type: Sequelize.DECIMAL(8,2)
      },
      total_iva: {
        type: Sequelize.DECIMAL(8,2)
      },
      aporte_laboral_afp: {
        type: Sequelize.JSONB
      },
      total_afp: {
        type: Sequelize.DECIMAL(8,2)
      },
      aporte_patronal: {
        type: Sequelize.JSONB
      },
      total_patronal: {
        type: Sequelize.DECIMAL(8,2)
      },
      aporte_solidario: {
        type: Sequelize.JSONB
      },
      total_ap_solidario: {
        type: Sequelize.DECIMAL(8,2)
      },
      descuento_adm: {
        type: Sequelize.JSONB
      },
      total_descuento: {
        type: Sequelize.DECIMAL(8,2)
      },
      sanciones_adm: {
        type: Sequelize.JSONB
      },
      total_sanciones: {
        type: Sequelize.DECIMAL(8,2)
      },
      sancion_asistencia: {
        type: Sequelize.DECIMAL(8,2)
      },
      otros_descuentos: {
        type: Sequelize.DECIMAL(8,2)
      },
      liquido_pagable: {
        type: Sequelize.DECIMAL(8,2)
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
    await queryInterface.dropTable('salario_planillas');
  }
};