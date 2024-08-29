'use strict';

const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync();
const userDataPath = path.join(__dirname, '../data/configuracion_minimo_nacionales.json');

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
      });
    await queryInterface.bulkInsert('configuracion_minimo_nacionales', usersData);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('configuracion_minimo_nacionales', null, {});
  }
};