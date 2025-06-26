'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 重命名 notes 欄位為 remark
    await queryInterface.renameColumn('event_registrations', 'notes', 'remark');
    
    // 將 participant_phone 設為可選
    await queryInterface.changeColumn('event_registrations', 'participant_phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    
    // 將 participant_line_id 設為可選
    await queryInterface.changeColumn('event_registrations', 'participant_line_id', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 回復 remark 欄位為 notes
    await queryInterface.renameColumn('event_registrations', 'remark', 'notes');
    
    // 將 participant_phone 設回必填
    await queryInterface.changeColumn('event_registrations', 'participant_phone', {
      type: Sequelize.STRING(20),
      allowNull: false,
    });
    
    // 將 participant_line_id 設回必填
    await queryInterface.changeColumn('event_registrations', 'participant_line_id', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  }
}; 