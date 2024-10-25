'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asignacion_cargo_empleados', {
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
      id_tipo_movimiento: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'tipo_movimientos',
            schema: 'public'
          },
          key: "id",
        },
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
      id_reparticion: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'reparticiones',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_destino: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'destinos',
            schema: 'public'
          },
          key: "id",
        },
      },
      ci_empleado: {
        type: Sequelize.STRING(15)
      },
      fecha_inicio: {
        type: Sequelize.DATE
      },
      fecha_limite: {
        type: Sequelize.DATE
      },
      motivo: {
        type: Sequelize.STRING(300)
      },
      referencia: {
        type: Sequelize.STRING(300)
      },
      nombre_file: {
        type: Sequelize.STRING(200)
      },
      nro_item: {
        type: Sequelize.INTEGER
      },
      ingreso: {
        type: Sequelize.BOOLEAN
      },
      retiro: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('asignacion_cargo_empleados');
  }
};