const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Administrator = sequelize.define(
  "Administrator",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 20],
      },
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("M", "F", "O"),
      allowNull: false,
      defaultValue: "M",
    },
    line_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
      },
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    line_avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500],
        isUrl: function (value) {
          if (value && !/^https?:\/\/.+/.test(value)) {
            throw new Error("LINE 大頭照連結必須是有效的 URL");
          }
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "administrators",
    timestamps: false,
  }
);

module.exports = Administrator;
