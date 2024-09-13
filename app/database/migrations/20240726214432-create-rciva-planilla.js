'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rciva_planillas', {
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
      id_minimo_nacional: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'minimo_nacional_salarios',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_escala_rciva: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'escala_rciva_salarios',
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
      id_rciva_certificado: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'rciva_certificaciones',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_rciva_decargo: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'rciva_descargo_salarios',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_rciva_planilla_fecha: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'planilla_fechas',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_ufv_mes_anterio: {        
          type: Sequelize.INTEGER
      },
      id_ufv_mes_paga: {
        type: Sequelize.INTEGER,        
      },
      novedad: {
        type: Sequelize.STRING(1)
      },
      ingreso_neto_bs: {
        type: Sequelize.DECIMAL(8,2)
      },
      minimo_imponible: {
        type: Sequelize.DECIMAL(8,2)
      },
      importe_sujeto_impuesto: {
        type: Sequelize.DECIMAL(8,2)
      },
      impuesto_rciva: {
        type: Sequelize.DECIMAL(8,2)
      },
      monto_porcentaje_smn: {
        type: Sequelize.DECIMAL(8,2)
      },
      impuesto_neto: {
        type: Sequelize.DECIMAL(8,2)
      },
      saldo_favor_fisco: {
        type: Sequelize.DECIMAL(8,2)
      },
      saldo_favor_dependiente: {
        type: Sequelize.DECIMAL(8,2)
      },
      total_salado_mes_anterior: {
        type: Sequelize.DECIMAL(8,2)
      },
      monto_saldo_actualizacion: {
        type: Sequelize.DECIMAL(8,2)
      },
      total_actualizacion: {
        type: Sequelize.DECIMAL(8,2)
      },
      saldo_utilizado: {
        type: Sequelize.DECIMAL(8,2)
      },
      rciva_retenido: {
        type: Sequelize.DECIMAL(8,2)
      },
      saldo_rciva_dependiente: {
        type: Sequelize.DECIMAL(8,2)
      },
      saldo_rciva_dependiente2: {
        type: Sequelize.DECIMAL(8,2)
      },
      total_viaticos: {
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
    await queryInterface.dropTable('rciva_planillas');
  }
};