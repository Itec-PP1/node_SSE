'use strict';
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await bcrypt.hash('admin', 10);
    return queryInterface.bulkInsert('users', [{
      firstname: 'Admin',
      lastname: 'Admin',
      username: 'admin',
      password: password,
      born: '2021-05-22',
      email: 'admin@admin.com',
      phone: '081234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  }
};
