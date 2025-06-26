"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("events", "start_time", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("events", "end_time", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // 建立索引以優化查詢效能
    await queryInterface.addIndex("events", ["start_time"]);
    await queryInterface.addIndex("events", ["end_time"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("events", "start_time");
    await queryInterface.removeColumn("events", "end_time");
  },
}; 