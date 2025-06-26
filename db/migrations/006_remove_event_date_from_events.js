"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 移除 event_date 欄位的索引（如果存在）
    await queryInterface.removeIndex("events", ["event_date"]);
    
    // 移除 event_date 欄位
    await queryInterface.removeColumn("events", "event_date");
  },

  down: async (queryInterface, Sequelize) => {
    // 如果需要回滾，重新添加 event_date 欄位
    await queryInterface.addColumn("events", "event_date", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // 重新建立索引
    await queryInterface.addIndex("events", ["event_date"]);
  },
}; 