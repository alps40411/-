"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 檢查是否已存在會員資料
    const existingMembers = await queryInterface.sequelize.query(
      "SELECT username FROM administrators WHERE username IN ('member1', 'member2', 'member3')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingUsernames = existingMembers.map((member) => member.username);

    const memberData = [
      {
        username: "member1",
        phone: "0945678901",
        birth: "1993-04-04",
        gender: "F",
        line_id: "member1_line_id",
        is_admin: false,
        createdAt: new Date(),
      },
      {
        username: "member2",
        phone: "0956789012",
        birth: "1994-05-05",
        gender: "M",
        line_id: "member2_line_id",
        is_admin: false,
        createdAt: new Date(),
      },
      {
        username: "member3",
        phone: "0967890123",
        birth: "1995-06-06",
        gender: "O",
        line_id: "member3_line_id",
        is_admin: false,
        createdAt: new Date(),
      },
    ];

    // 只插入不存在的記錄
    const newMembers = memberData.filter(
      (member) => !existingUsernames.includes(member.username)
    );

    if (newMembers.length > 0) {
      return queryInterface.bulkInsert("administrators", newMembers, {});
    } else {
      console.log("所有會員資料已存在，跳過插入");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("administrators", {
      username: ["member1", "member2", "member3"],
    });
  },
}; 