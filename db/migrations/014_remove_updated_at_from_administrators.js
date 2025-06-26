'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 移除 administrators 表的 updatedAt 欄位
    await queryInterface.removeColumn('administrators', 'updatedAt');
  },

  async down(queryInterface, Sequelize) {
    // 重新添加 updatedAt 欄位
    await queryInterface.addColumn('administrators', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  }
}; 