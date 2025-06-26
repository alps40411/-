'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 移除 registration_status 欄位
    await queryInterface.removeColumn('event_registrations', 'registration_status');
  },

  async down(queryInterface, Sequelize) {
    // 重新添加 registration_status 欄位
    await queryInterface.addColumn('event_registrations', 'registration_status', {
      type: Sequelize.ENUM("registered", "cancelled", "attended"),
      allowNull: false,
      defaultValue: "registered",
    });
  }
}; 