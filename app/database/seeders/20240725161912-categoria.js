'use strict';

const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync();
const userDataPath = path.join(__dirname, '../data/categoria.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let usersData =  JSON.parse(fs.readFileSync(userDataPath));
    usersData.forEach(resp => {
        resp.createdAt = new Date(),
        resp.updatedAt = new Date()
        //resp.deletedAt = new Date()        
      });
    await queryInterface.bulkInsert('categoria_cargos', usersData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('categoria_cargos', null, {});
  }
};