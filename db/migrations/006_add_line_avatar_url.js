"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("administrators", "line_avatar_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: "LINE 大頭照連結",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("administrators", "line_avatar_url");
  },
};
