"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 移除 announcements 表的 status 索引
    await queryInterface.removeIndex("announcements", ["status"]);

    // 移除 events 表的 status 索引
    await queryInterface.removeIndex("events", ["status"]);

    // 移除 announcements 表的 status 欄位
    await queryInterface.removeColumn("announcements", "status");

    // 移除 events 表的 status 欄位
    await queryInterface.removeColumn("events", "status");
  },

  async down(queryInterface, Sequelize) {
    // 恢復 announcements 表的 status 欄位
    await queryInterface.addColumn("announcements", "status", {
      type: Sequelize.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    });

    // 恢復 events 表的 status 欄位
    await queryInterface.addColumn("events", "status", {
      type: Sequelize.ENUM("upcoming", "ongoing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "upcoming",
    });

    // 恢復 announcements 表的 status 索引
    await queryInterface.addIndex("announcements", ["status"]);

    // 恢復 events 表的 status 索引
    await queryInterface.addIndex("events", ["status"]);
  },
};
