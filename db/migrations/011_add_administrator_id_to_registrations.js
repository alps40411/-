'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 添加 administrator_id 欄位
    await queryInterface.addColumn('event_registrations', 'administrator_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // 為現有記錄設置預設值
      references: {
        model: "administrators",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // 建立索引
    await queryInterface.addIndex("event_registrations", ["administrator_id"]);
  },

  async down(queryInterface, Sequelize) {
    // 移除 administrator_id 欄位
    await queryInterface.removeColumn('event_registrations', 'administrator_id');
  }
}; 