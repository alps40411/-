"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 檢查是否已存在報名資料
    const existingRegistrations = await queryInterface.sequelize.query(
      "SELECT id FROM event_registrations WHERE event_id IN (1, 2, 3)",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingRegistrationIds = existingRegistrations.map(
      (registration) => registration.id
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
        administrator_id: 1,
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
        administrator_id: 1,
        participant_name: "陳小強",
        remark: null,
        registration_time: now,
      },
      {
        event_id: 3,
        administrator_id: 1,
        participant_name: "林小芳",
        remark: "對 UI/UX 設計很感興趣",
        registration_time: now,
      },
    ];

    // 只插入不存在的記錄
    const newRegistrations = registrationData.filter(
      (registration) => !existingRegistrationIds.includes(registration.id)
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
