"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 移除舊的唯一索引
    await queryInterface.removeIndex(
      "event_registrations",
      "unique_event_administrator_registration"
    );

    // 建立新的複合唯一索引，包含參與者姓名
    await queryInterface.addIndex(
      "event_registrations",
      ["event_id", "administrator_id", "participant_name"],
      {
        unique: true,
        name: "unique_event_administrator_participant_registration",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // 移除新的唯一索引
    await queryInterface.removeIndex(
      "event_registrations",
      "unique_event_administrator_participant_registration"
    );

    // 恢復舊的唯一索引
    await queryInterface.addIndex(
      "event_registrations",
      ["event_id", "administrator_id"],
      {
        unique: true,
        name: "unique_event_administrator_registration",
      }
    );
  },
}; 