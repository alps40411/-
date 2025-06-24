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
        phone: "0911111111",
        birth: "1995-05-15",
        gender: "M",
        line_id: "zhang123",
        registration_time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
      },
      {
        event_id: 1,
        participant_name: "李小華",
        phone: "0922222222",
        birth: "1993-08-20",
        gender: "F",
        line_id: "li456",
        registration_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
      },
      {
        event_id: 2,
        participant_name: "王小美",
        phone: "0933333333",
        birth: "1990-12-10",
        gender: "F",
        line_id: "wang789",
        registration_time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
      },
      {
        event_id: 2,
        participant_name: "陳小強",
        phone: "0944444444",
        birth: "1988-03-25",
        gender: "M",
        line_id: "chen101",
        registration_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
      },
      {
        event_id: 3,
        participant_name: "林小芳",
        phone: "0955555555",
        birth: "1992-07-08",
        gender: "F",
        line_id: "lin202",
        registration_time: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
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
