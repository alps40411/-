/**
 * 驗證輔助工具函數
 */

// 驗證電子郵件格式
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 驗證手機號碼格式（台灣）
const isValidPhone = (phone) => {
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone);
};

// 驗證密碼強度
const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`密碼長度至少需要 ${minLength} 個字元`);
  }

  if (!hasUpperCase) {
    errors.push("密碼需要包含至少一個大寫字母");
  }

  if (!hasLowerCase) {
    errors.push("密碼需要包含至少一個小寫字母");
  }

  if (!hasNumbers) {
    errors.push("密碼需要包含至少一個數字");
  }

  if (!hasSpecialChar) {
    errors.push("密碼需要包含至少一個特殊字元");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 驗證使用者名稱格式
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

// 驗證數字範圍
const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

// 驗證字串長度
const isValidLength = (str, min, max) => {
  return str && str.length >= min && str.length <= max;
};

// 驗證必填欄位
const validateRequired = (data, requiredFields) => {
  const errors = [];

  requiredFields.forEach((field) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      errors.push(`${field} 為必填欄位`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 清理字串（移除多餘空格）
const sanitizeString = (str) => {
  return str ? str.trim().replace(/\s+/g, " ") : "";
};

// 驗證分頁參數
const validatePagination = (page, limit, maxLimit = 100) => {
  const errors = [];

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    errors.push("頁碼必須為正整數");
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > maxLimit) {
    errors.push(`每頁筆數必須在 1 到 ${maxLimit} 之間`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    page: pageNum || 1,
    limit: limitNum || 10,
  };
};

module.exports = {
  isValidEmail,
  isValidPhone,
  validatePasswordStrength,
  isValidUsername,
  isInRange,
  isValidLength,
  validateRequired,
  sanitizeString,
  validatePagination,
};
