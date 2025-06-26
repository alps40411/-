'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 重命名 createdAt 為 registration_time
    await queryInterface.renameColumn('event_registrations', 'createdAt', 'registration_time');
    
    // 移除 updatedAt 欄位
    await queryInterface.removeColumn('event_registrations', 'updatedAt');
  },

  async down(queryInterface, Sequelize) {
    // 重新添加 updatedAt 欄位
    await queryInterface.addColumn('event_registrations', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    
    // 重命名 registration_time 回 createdAt
    await queryInterface.renameColumn('event_registrations', 'registration_time', 'createdAt');
  }
}; 