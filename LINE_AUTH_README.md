# LINE 認證系統實作說明

## 概述

本系統已實作基於 LINE USER ID 的權限檢查機制，所有需要管理員權限的 API 都會自動檢查請求中的 LINE USER ID，並驗證對應的管理員權限。

## 實作細節

### 1. Middleware 實作

- **檔案位置**: `src/middlewares/authMiddleware.js`
- **主要功能**:
  - `lineAuthMiddleware`: 用於需要管理員權限的操作
  - `lineAuthOptionalMiddleware`: 用於管理員註冊等操作
- **檢查流程**:
  1. 從請求 header 中取得 `X-Line-User-Id`
  2. 查詢本地資料庫中的 `administrators` 資料表
  3. 驗證 LINE USER ID 是否存在對應的管理員記錄
  4. 如果驗證成功，將管理員資訊存入 `req.administrator` 和 `req.administratorId`

### 2. 權限檢查流程

```
前端請求 → 檢查 X-Line-User-Id Header → 查詢資料庫 → 驗證管理員權限 → 自動填入 administrator_id 和 line_id
```

### 3. 已更新的 API 端點

#### 管理員管理

- `POST /api/administrators` - 管理員註冊（自動填入 line_id）

#### 公告管理

- `POST /api/announcements` - 建立公告
- `PUT /api/announcements/:id` - 更新公告
- `DELETE /api/announcements/:id` - 刪除公告

#### 活動管理

- `POST /api/events` - 建立活動

#### 報名管理

- `POST /api/registrations` - 建立報名
- `DELETE /api/registrations/:id` - 取消報名

### 4. 前端使用方式

#### 設定 Header

所有需要管理員權限的 API 請求都必須在 header 中包含 LINE USER ID：

```javascript
// 使用 fetch
fetch("/api/announcements", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Line-User-Id": "U1234567890abcdef", // LINE USER ID
  },
  body: JSON.stringify({
    title: "公告標題",
    content: "公告內容",
  }),
});

// 使用 axios
axios.post(
  "/api/announcements",
  {
    title: "公告標題",
    content: "公告內容",
  },
  {
    headers: {
      "X-Line-User-Id": "U1234567890abcdef",
    },
  }
);
```

#### 請求格式變更

**管理員註冊** (自動填入 line_id):

```json
{
  "username": "admin001",
  "name": "張管理員",
  "phone": "0912345678",
  "birth": "1990-01-01",
  "gender": "M"
}
```

**建立公告** (自動填入 administrator_id):

```json
{
  "title": "公告標題",
  "content": "公告內容"
}
```

**建立活動** (自動填入 administrator_id):

```json
{
  "title": "活動標題",
  "description": "活動描述",
  "start_time": "2024-01-15T18:00:00Z",
  "end_time": "2024-01-15T20:00:00Z",
  "registration_deadline": "2024-01-14T23:59:59Z",
  "location": "台北市信義區",
  "is_capacity_limited": true,
  "max_participants": 50
}
```

**建立報名** (自動填入 administrator_id):

```json
{
  "event_id": 1,
  "participant_name": "張三",
  "remark": "素食者"
}
```

### 5. 錯誤處理

#### 401 Unauthorized 錯誤

- 未提供 `X-Line-User-Id` header
- LINE USER ID 在資料庫中找不到對應的管理員記錄

#### 400 Bad Request 錯誤

- 管理員註冊時，LINE 帳號已經存在
- 無法取得 LINE USER ID

#### 403 Forbidden 錯誤

- 嘗試修改非自己建立的資源（公告、活動等）

### 6. 資料庫要求

確保 `administrators` 資料表中有 `line_id` 欄位，用於儲存 LINE USER ID：

```sql
CREATE TABLE administrators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  birth DATE NOT NULL,
  gender ENUM('M', 'F') NOT NULL DEFAULT 'M',
  line_id VARCHAR(50) NOT NULL UNIQUE,  -- LINE USER ID
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 7. 測試

可以使用提供的測試檔案來驗證認證功能：

```bash
node test-line-auth.js
```

然後使用 curl 測試：

```bash
# 管理員註冊
curl -X POST http://localhost:3000/api/administrators \
  -H "Content-Type: application/json" \
  -H "X-Line-User-Id: U1234567890abcdef" \
  -d '{
    "username": "admin001",
    "name": "張管理員",
    "phone": "0912345678",
    "birth": "1990-01-01",
    "gender": "M"
  }'

# 有效認證
curl -X POST http://localhost:3000/api/announcements \
  -H "Content-Type: application/json" \
  -H "X-Line-User-Id: U1234567890abcdef" \
  -d '{
    "title": "測試公告",
    "content": "測試內容"
  }'

# 無效認證
curl -X POST http://localhost:3000/api/announcements \
  -H "Content-Type: application/json" \
  -H "X-Line-User-Id: invalid_user_id" \
  -d '{
    "title": "測試公告",
    "content": "測試內容"
  }'

# 缺少認證
curl -X POST http://localhost:3000/api/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "測試公告",
    "content": "測試內容"
  }'
```

## 注意事項

1. **安全性**: 此實作僅檢查 LINE USER ID 是否存在於資料庫中，不進行 LINE 官方 API 驗證
2. **權限控制**: 管理員只能修改自己建立的資源
3. **向後相容**: 原有的 JWT 認證系統仍然保留，可與新的 LINE 認證並存
4. **資料完整性**: 所有 POST 請求都會自動填入對應的 `administrator_id` 和 `line_id`
5. **管理員註冊**: 首次註冊時需要提供 LINE USER ID，系統會自動檢查是否已存在

## 遷移指南

1. 確保資料庫中有 `line_id` 欄位
2. 更新前端程式碼，在需要管理員權限的 API 請求中加入 `X-Line-User-Id` header
3. 移除請求體中的 `administrator_id` 和 `line_id` 欄位
4. 測試所有相關 API 端點
5. 對於管理員註冊，確保提供正確的 LINE USER ID
