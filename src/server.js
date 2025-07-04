require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./config/database");
require("./models"); // 載入模型關聯

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// 資料庫連線測試
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("資料庫連線成功！");
  } catch (error) {
    console.error("無法連線到資料庫:", error);
    process.exit(1);
  }
}

// 啟動伺服器
async function startServer() {
  await testConnection();
  
  app.listen(PORT, HOST, () => {
    console.log(`伺服器運行在 http://${HOST}:${PORT}`);
    console.log(`Swagger 文檔可在 http://${HOST}:${PORT}/api-docs 查看`);
    
    // 如果有設定 API_URL，顯示外部訪問地址
    if (process.env.API_URL) {
      console.log(`外部訪問地址: ${process.env.API_URL}`);
    }
  });
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
