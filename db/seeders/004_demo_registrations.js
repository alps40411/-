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
        participant_name: "張小明",
        participant_phone: "0911111111",
        participant_email: "zhang@example.com",
        participant_line_id: "zhang123",
        registration_status: "registered",
        notes: "對 Node.js 技術很有興趣",
        createdAt: now,
        updatedAt: now,
      },
      {
        event_id: 1,
        participant_name: "李小華",
        participant_phone: "0922222222",
        participant_email: "li@example.com",
        participant_line_id: "li456",
        registration_status: "registered",
        notes: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        event_id: 2,
        participant_name: "王小美",
        participant_phone: "0933333333",
        participant_email: "wang@example.com",
        participant_line_id: "wang789",
        registration_status: "registered",
        notes: "希望能學到創業經驗",
        createdAt: now,
        updatedAt: now,
      },
      {
        event_id: 2,
        participant_name: "陳小強",
        participant_phone: "0944444444",
        participant_email: "chen@example.com",
        participant_line_id: "chen101",
        registration_status: "registered",
        notes: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        event_id: 3,
        participant_name: "林小芳",
        participant_phone: "0955555555",
        participant_email: "lin@example.com",
        participant_line_id: "lin202",
        registration_status: "registered",
        notes: "對 UI/UX 設計很感興趣",
        createdAt: now,
        updatedAt: now,
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
