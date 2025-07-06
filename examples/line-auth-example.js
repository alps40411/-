// LINE 認證系統使用範例

// 0. 管理員註冊
async function registerAdministrator() {
  const response = await fetch("http://localhost:3000/api/administrators", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Line-User-Id": "U1234567890abcdef", // 從 LINE 登入取得
    },
    body: JSON.stringify({
      username: "admin001",
      name: "張管理員",
      phone: "0912345678",
      birth: "1990-01-01",
      gender: "M",
      // 注意：不需要傳遞 line_id，會自動從 header 中取得
    }),
  });

  const result = await response.json();
  console.log("管理員註冊結果:", result);
}

// 1. 建立公告
async function createAnnouncement() {
  const response = await fetch("http://localhost:3000/api/announcements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Line-User-Id": "U1234567890abcdef", // 從 LINE 登入取得
    },
    body: JSON.stringify({
      title: "重要公告",
      content: "這是一個重要的公告內容",
    }),
  });

  const result = await response.json();
  console.log("建立公告結果:", result);
}

// 2. 建立活動
async function createEvent() {
  const response = await fetch("http://localhost:3000/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Line-User-Id": "U1234567890abcdef",
    },
    body: JSON.stringify({
      title: "扶輪社聚會",
      description: "每月例行聚會",
      start_time: "2024-01-15T18:00:00Z",
      end_time: "2024-01-15T20:00:00Z",
      registration_deadline: "2024-01-14T23:59:59Z",
      location: "台北市信義區",
      is_capacity_limited: true,
      max_participants: 50,
    }),
  });

  const result = await response.json();
  console.log("建立活動結果:", result);
}

// 3. 建立報名
async function createRegistration() {
  const response = await fetch("http://localhost:3000/api/registrations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Line-User-Id": "U1234567890abcdef",
    },
    body: JSON.stringify({
      event_id: 1,
      participant_name: "張三",
      remark: "素食者",
    }),
  });

  const result = await response.json();
  console.log("建立報名結果:", result);
}

// 4. 更新公告
async function updateAnnouncement(announcementId) {
  const response = await fetch(
    `http://localhost:3000/api/announcements/${announcementId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Line-User-Id": "U1234567890abcdef",
      },
      body: JSON.stringify({
        title: "更新後的公告標題",
        content: "更新後的公告內容",
      }),
    }
  );

  const result = await response.json();
  console.log("更新公告結果:", result);
}

// 5. 刪除報名
async function cancelRegistration(registrationId) {
  const response = await fetch(
    `http://localhost:3000/api/registrations/${registrationId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Line-User-Id": "U1234567890abcdef",
      },
    }
  );

  const result = await response.json();
  console.log("取消報名結果:", result);
}

// 錯誤處理範例
async function handleAuthError() {
  try {
    // 不提供 LINE USER ID
    const response = await fetch("http://localhost:3000/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 缺少 X-Line-User-Id
      },
      body: JSON.stringify({
        title: "測試公告",
        content: "測試內容",
      }),
    });

    if (response.status === 401) {
      console.log("認證失敗: 未提供 LINE USER ID");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

// 使用無效的 LINE USER ID
async function handleInvalidLineId() {
  try {
    const response = await fetch("http://localhost:3000/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Line-User-Id": "invalid_user_id",
      },
      body: JSON.stringify({
        title: "測試公告",
        content: "測試內容",
      }),
    });

    if (response.status === 401) {
      console.log("認證失敗: 無效的 LINE USER ID");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

// 匯出函數供其他模組使用
module.exports = {
  registerAdministrator,
  createAnnouncement,
  createEvent,
  createRegistration,
  updateAnnouncement,
  cancelRegistration,
  handleAuthError,
  handleInvalidLineId,
};

// 如果直接執行此檔案，則執行範例
if (require.main === module) {
  console.log("LINE 認證系統使用範例");
  console.log("請確保伺服器正在運行，並且資料庫中有對應的管理員記錄");
  console.log("");

  // 執行範例
  registerAdministrator();
  createAnnouncement();
  createEvent();
  createRegistration();
  handleAuthError();
  handleInvalidLineId();
}
