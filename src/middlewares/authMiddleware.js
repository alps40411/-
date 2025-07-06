const jwt = require("jsonwebtoken");
const { Administrator } = require("../models");
const AdministratorModel = require("../models/Administrator");

// 原有的 JWT 認證 middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "未提供認證 Token",
      });
    }

    const token = authHeader.split(" ")[1];

    // 使用 LINE ID (token) 查找管理員
    const administrator = await AdministratorModel.findOne({
      where: { line_id: token },
    });

    if (!administrator) {
      return res.status(401).json({
        success: false,
        message: "無效的認證 Token 或非管理員",
      });
    }

    // 將管理員資訊添加到請求對象中
    req.administrator = administrator;
    req.administratorId = administrator.id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "認證過程發生錯誤",
      error: error.message,
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
