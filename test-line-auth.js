const express = require("express");
const { lineAuthMiddleware } = require("./src/middlewares/authMiddleware");

const app = express();
app.use(express.json());

// 測試路由
app.post("/test-auth", lineAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "認證成功",
    administratorId: req.administratorId,
    administrator: req.administrator,
  });
});

// 啟動測試伺服器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`測試伺服器運行在 http://localhost:${PORT}`);
  console.log("請使用以下方式測試：");
  console.log("1. 使用有效的 LINE USER ID:");
  console.log("   curl -X POST http://localhost:3001/test-auth \\");
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -H "X-Line-User-Id: U1234567890abcdef"');
  console.log("");
  console.log("2. 不使用 LINE USER ID:");
  console.log("   curl -X POST http://localhost:3001/test-auth \\");
  console.log('     -H "Content-Type: application/json"');
  console.log("");
  console.log("3. 使用無效的 LINE USER ID:");
  console.log("   curl -X POST http://localhost:3001/test-auth \\");
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -H "X-Line-User-Id: invalid_user_id"');
});
