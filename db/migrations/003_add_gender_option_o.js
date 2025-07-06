"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 修改 administrators 表的 gender 欄位，添加 "O" 選項
    await queryInterface.changeColumn("administrators", "gender", {
      type: Sequelize.ENUM("M", "F", "O"),
      allowNull: false,
      defaultValue: "M",
    });
  },

  async down(queryInterface, Sequelize) {
    // 恢復原來的 gender 欄位設定，只有 "M" 和 "F"
    await queryInterface.changeColumn("administrators", "gender", {
      type: Sequelize.ENUM("M", "F"),
      allowNull: false,
      defaultValue: "M",
    });
  },
};
