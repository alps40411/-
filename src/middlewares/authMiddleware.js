const jwt = require("jsonwebtoken");
const { Administrator } = require("../models");

// 基於 LINE USER ID 的權限檢查 middleware（用於需要管理員權限的操作）
const lineAuthMiddleware = async (req, res, next) => {
  try {
    const lineUserId = req.headers["x-line-user-id"];

    if (!lineUserId) {
      return res.status(401).json({
        success: false,
        message: "未提供 LINE USER ID",
      });
    }

    // 查詢資料庫中是否存在對應的管理員
    const administrator = await Administrator.findOne({
      where: { line_id: lineUserId },
    });

    if (!administrator) {
      return res.status(401).json({
        success: false,
        message: "無效的管理員權限",
      });
    }

    // 將管理員資訊存入 req 物件中，供後續使用
    req.administrator = administrator;
    req.administratorId = administrator.id;

    next();
  } catch (error) {
    console.error("LINE 認證中介軟體錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "認證處理時發生錯誤",
    });
  }
};

// 基於 LINE USER ID 的認證 middleware（用於管理員註冊等操作）
const lineAuthOptionalMiddleware = async (req, res, next) => {
  try {
    const lineUserId = req.headers["x-line-user-id"];

    if (!lineUserId) {
      return res.status(401).json({
        success: false,
        message: "未提供 LINE USER ID",
      });
    }

    // 查詢資料庫中是否存在對應的管理員
    const administrator = await Administrator.findOne({
      where: { line_id: lineUserId },
    });

    // 即使管理員不存在，也將 LINE USER ID 存入 req 物件中
    if (administrator) {
      req.administrator = administrator;
      req.administratorId = administrator.id;
    } else {
      // 對於註冊情況，創建一個臨時物件包含 line_id
      req.administrator = { line_id: lineUserId };
    }

    next();
  } catch (error) {
    console.error("LINE 可選認證中介軟體錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "認證處理時發生錯誤",
    });
  }
};

// 原有的 JWT 認證 middleware
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
  lineAuthMiddleware,
  lineAuthOptionalMiddleware,
};
