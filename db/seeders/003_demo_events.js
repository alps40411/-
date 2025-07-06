"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const threeWeeksLater = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

    // 檢查是否已存在活動資料
    const existingEvents = await queryInterface.sequelize.query(
      "SELECT title FROM events WHERE title IN ('技術研討會：Node.js 最佳實踐', '創業分享會：從0到1的創業歷程', '設計工作坊：UI/UX 設計實戰')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingTitles = existingEvents.map((event) => event.title);

    const eventData = [
      {
        title: "技術研討會：Node.js 最佳實踐",
        description:
          "深入探討 Node.js 開發中的最佳實踐，包括效能優化、安全性、測試策略等主題。適合中高級開發者參加。",
        start_time: new Date(oneWeekLater.getTime() + 9 * 60 * 60 * 1000), // 上午9點開始
        end_time: new Date(oneWeekLater.getTime() + 17 * 60 * 60 * 1000), // 下午5點結束
        location: "台北市信義區松仁路100號 台北101大樓 89樓會議廳",
        is_capacity_limited: true,
        max_participants: 50,
        current_participants: 0,
        registration_deadline: new Date(
          oneWeekLater.getTime() - 24 * 60 * 60 * 1000
        ), // 1天前
        administrator_id: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "創業分享會：從0到1的創業歷程",
        description:
          "邀請成功創業家分享從零開始創業的經驗，包括市場分析、團隊組建、資金籌措等實戰經驗。",
        start_time: new Date(twoWeeksLater.getTime() + 14 * 60 * 60 * 1000), // 下午2點開始
        end_time: new Date(twoWeeksLater.getTime() + 17 * 60 * 60 * 1000), // 下午5點結束
        location:
          "台北市大安區復興南路一段390號 台灣大學管理學院一號館 國際會議廳",
        is_capacity_limited: false,
        max_participants: null,
        current_participants: 0,
        registration_deadline: new Date(
          twoWeeksLater.getTime() - 2 * 24 * 60 * 60 * 1000
        ), // 2天前
        administrator_id: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "設計工作坊：UI/UX 設計實戰",
        description:
          "實作導向的設計工作坊，學習現代 UI/UX 設計原則，並實際設計一個完整的用戶介面。",
        start_time: new Date(threeWeeksLater.getTime() + 10 * 60 * 60 * 1000), // 上午10點開始
        end_time: new Date(threeWeeksLater.getTime() + 16 * 60 * 60 * 1000), // 下午4點結束
        location: "台北市中山區南京東路二段125號 台北市立美術館 多媒體會議室",
        is_capacity_limited: true,
        max_participants: 25,
        current_participants: 0,
        registration_deadline: new Date(
          threeWeeksLater.getTime() - 3 * 24 * 60 * 60 * 1000
        ), // 3天前
        administrator_id: 3,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 只插入不存在的記錄
    const newEvents = eventData.filter(
      (event) => !existingTitles.includes(event.title)
    );

    if (newEvents.length > 0) {
      return queryInterface.bulkInsert("events", newEvents, {});
    } else {
      console.log("所有活動資料已存在，跳過插入");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("events", null, {});
  },
};
