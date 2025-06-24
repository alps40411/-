const errorMiddleware = (err, req, res, next) => {
  console.error("錯誤:", err);

  // Sequelize 驗證錯誤
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "資料驗證失敗",
      errors: err.errors.map((error) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  // Sequelize 唯一性約束錯誤
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: "資料已存在",
      errors: err.errors.map((error) => ({
        field: error.path,
        message: `${error.path} 已存在`,
      })),
    });
  }

  // Sequelize 外鍵約束錯誤
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      success: false,
      message: "關聯資料不存在",
      errors: [
        {
          field: err.fields[0],
          message: "關聯的資料不存在",
        },
      ],
    });
  }

  // Sequelize 記錄未找到錯誤
  if (err.name === "SequelizeEmptyResultError") {
    return res.status(404).json({
      success: false,
      message: "找不到指定的資料",
    });
  }

  // JWT 錯誤
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "無效的認證令牌",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "認證令牌已過期",
    });
  }

  // 自定義業務邏輯錯誤
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }

  // 預設錯誤回應
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "伺服器內部錯誤"
      : err.message || "伺服器內部錯誤";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 自定義錯誤類別
class AppError extends Error {
  constructor(message, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 錯誤處理
const notFoundMiddleware = (req, res, next) => {
  // 忽略常見的 404 請求，不記錄為錯誤
  const ignoredPaths = ["/favicon.ico", "/robots.txt"];
  if (ignoredPaths.includes(req.originalUrl)) {
    return res.status(404).json({
      success: false,
      message: "找不到路徑",
    });
  }

  const error = new AppError(`找不到路徑: ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  errorMiddleware,
  notFoundMiddleware,
  AppError,
};
