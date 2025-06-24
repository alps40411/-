"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 檢查是否已存在公告資料
    const existingAnnouncements = await queryInterface.sequelize.query(
      "SELECT title FROM announcements WHERE title IN ('歡迎使用活動管理系統', '系統維護通知', '新功能上線')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingTitles = existingAnnouncements.map(
      (announcement) => announcement.title
    );

    const announcementData = [
      {
        title: "歡迎使用活動管理系統",
        description:
          "這是一個功能完整的活動與公告管理系統，支援活動 CRUD、公告 CRUD、活動報名與報名名單查詢等功能。",
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "系統維護通知",
        description:
          "系統將於每週日凌晨 2:00-4:00 進行例行維護，期間可能無法正常使用，敬請見諒。",
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "新功能上線",
        description:
          "活動報名功能已正式上線，現在可以為活動設定報名截止時間和最大參與人數。",
        created_by: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 只插入不存在的記錄
    const newAnnouncements = announcementData.filter(
      (announcement) => !existingTitles.includes(announcement.title)
    );

    if (newAnnouncements.length > 0) {
      return queryInterface.bulkInsert("announcements", newAnnouncements, {});
    } else {
      console.log("所有公告資料已存在，跳過插入");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("announcements", null, {});
  },
};
