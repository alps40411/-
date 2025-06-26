'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 移除 participant_phone 欄位
    await queryInterface.removeColumn('event_registrations', 'participant_phone');
    
    // 移除 participant_email 欄位
    await queryInterface.removeColumn('event_registrations', 'participant_email');
    
    // 移除 participant_line_id 欄位
    await queryInterface.removeColumn('event_registrations', 'participant_line_id');
  },

  async down(queryInterface, Sequelize) {
    // 重新添加 participant_phone 欄位
    await queryInterface.addColumn('event_registrations', 'participant_phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    
    // 重新添加 participant_email 欄位
    await queryInterface.addColumn('event_registrations', 'participant_email', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    
    // 重新添加 participant_line_id 欄位
    await queryInterface.addColumn('event_registrations', 'participant_line_id', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  }
}; 