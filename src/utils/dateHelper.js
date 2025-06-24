/**
 * 日期輔助工具函數
 */
const moment = require("moment");

// 格式化日期
const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return moment(date).format(format);
};

// 檢查日期是否有效
const isValidDate = (date) => {
  return moment(date).isValid();
};

// 檢查日期是否在未來
const isFutureDate = (date) => {
  return moment(date).isAfter(moment());
};

// 檢查日期是否在過去
const isPastDate = (date) => {
  return moment(date).isBefore(moment());
};

// 取得當前時間戳
const getCurrentTimestamp = () => {
  return moment().toDate();
};

// 計算兩個日期之間的差異（天數）
const getDaysDifference = (date1, date2) => {
  return moment(date2).diff(moment(date1), "days");
};

// 檢查活動時間是否有效
const isValidEventTime = (startTime, endTime, registrationDeadline) => {
  const now = moment();
  const start = moment(startTime);
  const end = moment(endTime);
  const deadline = moment(registrationDeadline);

  // 檢查開始時間是否在未來
  if (!start.isAfter(now)) {
    return { valid: false, message: "活動開始時間必須在未來" };
  }

  // 檢查結束時間是否晚於開始時間
  if (!end.isAfter(start)) {
    return { valid: false, message: "活動結束時間必須晚於開始時間" };
  }

  // 檢查報名截止時間是否早於活動開始時間
  if (!deadline.isBefore(start)) {
    return { valid: false, message: "報名截止時間必須早於活動開始時間" };
  }

  return { valid: true };
};

// 檢查報名是否仍在開放期間
const isRegistrationOpen = (registrationDeadline) => {
  return moment().isBefore(moment(registrationDeadline));
};

// 取得相對時間描述
const getRelativeTime = (date) => {
  return moment(date).fromNow();
};

module.exports = {
  formatDate,
  isValidDate,
  isFutureDate,
  isPastDate,
  getCurrentTimestamp,
  getDaysDifference,
  isValidEventTime,
  isRegistrationOpen,
  getRelativeTime,
};
