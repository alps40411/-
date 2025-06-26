"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 修改 description 欄位為可選
    await queryInterface.changeColumn("events", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });

    // 修改 location 欄位為可選
    await queryInterface.changeColumn("events", "location", {
      type: Sequelize.STRING(200),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滾時，先將 null 值設為預設值
    await queryInterface.sequelize.query(
      "UPDATE events SET description = '待補充說明' WHERE description IS NULL"
    );
    
    await queryInterface.sequelize.query(
      "UPDATE events SET location = '待確認地點' WHERE location IS NULL"
    );

    // 恢復為必填欄位
    await queryInterface.changeColumn("events", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.changeColumn("events", "location", {
      type: Sequelize.STRING(200),
      allowNull: false,
    });
  },
}; 