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
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    registration_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    place: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    is_capacity_limited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "administrators",
        key: "id",
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "events",
    timestamps: true,
    hooks: {
      beforeValidate: (event) => {
        // 確保結束時間晚於開始時間
        if (
          event.start_time &&
          event.end_time &&
          event.start_time >= event.end_time
        ) {
          throw new Error("結束時間必須晚於開始時間");
        }
        // 確保報名截止時間早於活動開始時間
        if (
          event.registration_deadline &&
          event.start_time &&
          event.registration_deadline > event.start_time
        ) {
          throw new Error("報名截止時間必須早於或等於活動開始時間");
        }
        // 如果有設定人數上限，則max_participants不能為空
        if (event.is_capacity_limited && !event.max_participants) {
          throw new Error("設定人數上限時，必須指定最大參與人數");
        }
      },
    },
  }
);

module.exports = Event;
