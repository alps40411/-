"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("events", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      event_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      max_participants: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      current_participants: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      registration_deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("upcoming", "ongoing", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "upcoming",
      },
      administrator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "administrators",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 建立索引
    await queryInterface.addIndex("events", ["administrator_id"]);
    await queryInterface.addIndex("events", ["status"]);
    await queryInterface.addIndex("events", ["event_date"]);
    await queryInterface.addIndex("events", ["registration_deadline"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("events");
  },
};
