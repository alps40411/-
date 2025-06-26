const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [1, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    is_capacity_limited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isValidMaxParticipants(value) {
          if (this.is_capacity_limited && (value === null || value === undefined)) {
            throw new Error("當限制人數時，最大參與人數不能為空");
          }
          if (!this.is_capacity_limited && value !== null) {
            throw new Error("當不限制人數時，最大參與人數必須為空");
          }
          if (value !== null && value < 1) {
            throw new Error("最大參與人數必須大於0");
          }
        },
      },
    },
    current_participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    registration_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "upcoming",
    },
    administrator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "administrators",
        key: "id",
      },
    },
  },
  {
    tableName: "events",
    timestamps: true,
    hooks: {
      beforeValidate: (event) => {
        // 根據 is_capacity_limited 自動設置 max_participants
        if (!event.is_capacity_limited) {
          event.max_participants = null;
        } else if (event.is_capacity_limited && event.max_participants === null) {
          // 如果限制人數但沒有設置，使用預設值
          event.max_participants = 50;
        }
      },
      beforeSave: (event) => {
        // 確保 start_time 早於 end_time
        if (
          event.start_time &&
          event.end_time &&
          event.start_time >= event.end_time
        ) {
          throw new Error("活動開始時間必須早於結束時間");
        }
        // 確保報名截止時間早於活動開始時間
        if (
          event.registration_deadline &&
          event.start_time &&
          event.registration_deadline > event.start_time
        ) {
          throw new Error("報名截止時間必須早於或等於活動開始時間");
        }
        // 確保當前參與人數不超過最大人數（如果有限制）
        if (
          event.is_capacity_limited &&
          event.max_participants &&
          event.current_participants > event.max_participants
        ) {
          throw new Error("當前參與人數不能超過最大參與人數");
        }
      },
    },
  }
);

module.exports = Event;
