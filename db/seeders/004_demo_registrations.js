"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 檢查是否已存在報名資料 - 改為檢查 event_id 和 administrator_id 組合
    const existingRegistrations = await queryInterface.sequelize.query(
      "SELECT event_id, administrator_id FROM event_registrations",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingCombinations = new Set(
      existingRegistrations.map(reg => `${reg.event_id}-${reg.administrator_id}`)
    );

    const registrationData = [
      {
        event_id: 1,
        administrator_id: 1,
        participant_name: "張小明",
        remark: "對 Node.js 技術很有興趣",
        registration_time: now,
      },
      {
        event_id: 1,
        administrator_id: 2, // 改為不同的 administrator_id
        participant_name: "李小華",
        remark: null,
        registration_time: now,
      },
      {
        event_id: 2,
        administrator_id: 1,
        participant_name: "王小美",
        remark: "希望能學到創業經驗",
        registration_time: now,
      },
      {
        event_id: 2,
        administrator_id: 3, // 改為不同的 administrator_id
        participant_name: "陳小強",
        remark: null,
        registration_time: now,
      },
      {
        event_id: 3,
        administrator_id: 2, // 改為不同的 administrator_id
        participant_name: "林小芳",
        remark: "對 UI/UX 設計很感興趣",
        registration_time: now,
      },
    ];

    // 只插入不存在的記錄 - 基於 event_id 和 administrator_id 組合
    const newRegistrations = registrationData.filter(
      (registration) => !existingCombinations.has(`${registration.event_id}-${registration.administrator_id}`)
    );

    if (newRegistrations.length > 0) {
      return queryInterface.bulkInsert(
        "event_registrations",
        newRegistrations,
        {}
      );
    } else {
      console.log("所有報名資料已存在，跳過插入");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("event_registrations", null, {});
  },
};
