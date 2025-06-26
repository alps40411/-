"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 添加 is_capacity_limited 欄位
    await queryInterface.addColumn("events", "is_capacity_limited", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    // 修改 max_participants 欄位允許 null
    await queryInterface.changeColumn("events", "max_participants", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });

    // 更新現有記錄：當 is_capacity_limited 為 false 時，設 max_participants 為 null
    await queryInterface.sequelize.query(
      "UPDATE events SET max_participants = NULL WHERE is_capacity_limited = false"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // 回滾時，先將 null 的 max_participants 設為預設值
    await queryInterface.sequelize.query(
      "UPDATE events SET max_participants = 50 WHERE max_participants IS NULL"
    );

    // 恢復 max_participants 為不允許 null
    await queryInterface.changeColumn("events", "max_participants", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 50,
    });

    // 移除 is_capacity_limited 欄位
    await queryInterface.removeColumn("events", "is_capacity_limited");
  },
}; 