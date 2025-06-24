const { Sequelize } = require("sequelize");
require("dotenv").config();

// 根據環境變數決定使用哪種資料庫
const dbType = process.env.DB_TYPE || "postgres";

// Sequelize CLI 配置
const config = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "0000",
    database: process.env.DB_NAME || "my_event_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || (dbType === "postgres" ? 5432 : 3306),
    dialect: dbType,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    timezone: "+08:00",
    dialectOptions: {
      connectTimeout: 60000,
      statement_timeout: 60000,
    },
  },
  production: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "0000",
    database: process.env.DB_NAME || "my_event_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || (dbType === "postgres" ? 5432 : 3306),
    dialect: dbType,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    timezone: "+08:00",
    dialectOptions: {
      connectTimeout: 60000,
      statement_timeout: 60000,
    },
  },
};

// 為應用程式創建 Sequelize 實例
let sequelize;
if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
  sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
      host: config.development.host,
      port: config.development.port,
      dialect: config.development.dialect,
      logging: config.development.logging,
      pool: config.development.pool,
      timezone: config.development.timezone,
      dialectOptions: config.development.dialectOptions,
    }
  );
} else {
  sequelize = new Sequelize(
    config.production.database,
    config.production.username,
    config.production.password,
    {
      host: config.production.host,
      port: config.production.port,
      dialect: config.production.dialect,
      logging: config.production.logging,
      pool: config.production.pool,
      timezone: config.production.timezone,
      dialectOptions: config.production.dialectOptions,
    }
  );
}

// 導出配置供 Sequelize CLI 使用
module.exports = config;

// 導出 sequelize 實例供應用程式使用
module.exports.sequelize = sequelize;
