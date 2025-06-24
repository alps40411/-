/**
 * 回應輔助工具函數
 */

// 成功回應
const successResponse = (
  res,
  data = null,
  message = "操作成功",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// 錯誤回應
const errorResponse = (
  res,
  message = "操作失敗",
  statusCode = 400,
  errors = null
) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// 分頁回應
const paginatedResponse = (res, data, pagination, message = "查詢成功") => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
};

// 列表回應
const listResponse = (res, data, message = "查詢成功") => {
  return res.status(200).json({
    success: true,
    message,
    data,
    count: Array.isArray(data) ? data.length : 0,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  listResponse,
};
