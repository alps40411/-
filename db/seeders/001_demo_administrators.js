"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 檢查是否已存在管理員資料
    const existingAdmins = await queryInterface.sequelize.query(
      "SELECT username FROM administrators WHERE username IN ('admin', 'moderator1', 'moderator2')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingUsernames = existingAdmins.map((admin) => admin.username);

    const adminData = [
      {
        username: "admin",
        phone: "0912345678",
        birth: "1990-01-01",
        gender: "M",
        line_id: "admin_line_id",
        is_admin: true,
        createdAt: new Date(),
      },
      {
        username: "moderator1",
        phone: "0923456789",
        birth: "1991-02-02",
        gender: "F",
        line_id: "moderator1_line_id",
        is_admin: true,
        createdAt: new Date(),
      },
      {
        username: "moderator2",
        phone: "0934567890",
        birth: "1992-03-03",
        gender: "M",
        line_id: "moderator2_line_id",
        is_admin: true,
        createdAt: new Date(),
      },
    ];

    // 只插入不存在的記錄
    const newAdmins = adminData.filter(
      (admin) => !existingUsernames.includes(admin.username)
    );

    if (newAdmins.length > 0) {
      return queryInterface.bulkInsert("administrators", newAdmins, {});
    } else {
      console.log("所有管理員資料已存在，跳過插入");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("administrators", null, {});
  },
};
