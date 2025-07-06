"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // PostgreSQL 需要使用原生 SQL 來修改 ENUM 類型
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_administrators_gender\" ADD VALUE 'O'"
    );
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL 不支援直接移除 ENUM 值，需要重新創建
    // 1. 創建新的臨時 ENUM 類型
    await queryInterface.sequelize.query(
      "CREATE TYPE \"enum_administrators_gender_temp\" AS ENUM ('M', 'F')"
    );

    // 2. 修改欄位使用新的 ENUM 類型
    await queryInterface.sequelize.query(
      'ALTER TABLE administrators ALTER COLUMN gender TYPE "enum_administrators_gender_temp" USING gender::text::"enum_administrators_gender_temp"'
    );

    // 3. 刪除舊的 ENUM 類型
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_administrators_gender"'
    );

    // 4. 重命名新的 ENUM 類型
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_administrators_gender_temp" RENAME TO "enum_administrators_gender"'
    );
  },
};
