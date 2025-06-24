const jwt = require("jsonwebtoken");
const { Administrator } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "未提供認證令牌",
      });
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前綴

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const administrator = await Administrator.findByPk(decoded.id);

    if (!administrator || !administrator.is_active) {
      return res.status(401).json({
        success: false,
        message: "無效的認證令牌",
      });
    }

    req.user = administrator;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "無效的認證令牌",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "認證令牌已過期",
      });
    }

    console.error("認證中介軟體錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "認證處理時發生錯誤",
    });
  }
};

// 可選的認證中介軟體（用於某些不需要強制認證的 API）
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const administrator = await Administrator.findByPk(decoded.id);

      if (administrator && administrator.is_active) {
        req.user = administrator;
      }
    }

    next();
  } catch (error) {
    // 忽略認證錯誤，繼續執行
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
};
