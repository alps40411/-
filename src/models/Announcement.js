const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Announcement = sequelize.define(
  "Announcement",
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: "announcements",
    timestamps: true,
    timezone: "+08:00",
  }
);

module.exports = Announcement;
