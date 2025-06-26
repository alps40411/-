"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("event_registrations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      participant_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      participant_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      participant_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      participant_line_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      registration_status: {
        type: Sequelize.ENUM("registered", "cancelled", "attended"),
        allowNull: false,
        defaultValue: "registered",
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.addIndex("event_registrations", ["event_id"]);
    await queryInterface.addIndex("event_registrations", ["participant_line_id"]);
    await queryInterface.addIndex("event_registrations", ["registration_status"]);
    
    // 建立複合唯一索引，防止同一人重複報名同一活動
    await queryInterface.addIndex("event_registrations", 
      ["event_id", "participant_line_id"], 
      { unique: true }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("event_registrations");
  },
};
