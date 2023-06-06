'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      firstname: 'Admin',
      lastname: 'Admin',
      username: 'admin',
      password: 'admin',
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
