const app = require("./app");
const { sequelize } = require("./config/database");
require("./models"); // 載入模型關聯

const PORT = process.env.PORT || 3000;

// 資料庫連線測試
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ 資料庫連線成功");
  } catch (error) {
    console.error("❌ 資料庫連線失敗:", error);
    process.exit(1);
  }
}

// 啟動伺服器
async function startServer() {
  try {
    // 測試資料庫連線
    await testDatabaseConnection();

    // 啟動 HTTP 伺服器
    app.listen(PORT, () => {
      console.log(`🚀 伺服器已啟動`);
      console.log(`📍 監聽端口: ${PORT}`);
      console.log(`🌍 環境: ${process.env.NODE_ENV || "development"}`);
      console.log("swagger: http://localhost:3000/api-docs");
    });
  } catch (error) {
    console.error("❌ 伺服器啟動失敗:", error);
    process.exit(1);
  }
}

// 優雅關閉
process.on("SIGINT", async () => {
  console.log("\n🛑 關閉伺服器...");
  try {
    await sequelize.close();
    console.log("✅ 資料庫連線已關閉");
    process.exit(0);
  } catch (error) {
    console.error("❌ 關閉資料庫連線時發生錯誤:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 關閉...");
  try {
    await sequelize.close();
    console.log("✅ 資料庫連線已關閉");
    process.exit(0);
  } catch (error) {
    console.error("❌ 關閉資料庫連線時發生錯誤:", error);
    process.exit(1);
  }
});

// 未處理的 Promise 拒絕
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ 未處理的 Promise 拒絕:", reason);
  console.error("Promise:", promise);
});

// 未捕獲的異常
process.on("uncaughtException", (error) => {
  console.error("❌ 未捕獲的異常:", error);
  process.exit(1);
});

// 啟動伺服器
startServer();
