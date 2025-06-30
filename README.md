# 扶輪社活動管理系統

一個功能完整的活動與公告管理後端 API，支援活動 CRUD、公告 CRUD、活動報名與報名名單查詢，並具備管理員管理功能。所有 API 都需要 LINE 用戶身份驗證。

## 功能特色

- 📢 **公告管理** - 完整的公告 CRUD 操作
- 🎉 **活動管理** - 活動建立、更新、刪除與查詢
- 📝 **報名系統** - 活動報名與報名名單管理
- 👥 **管理員系統** - 管理員資料管理
- 🔐 **LINE 身份驗證** - 基於 LINE 用戶 ID 的身份驗證機制
- 📊 **分頁查詢** - 支援分頁的資料查詢
- 🛡️ **安全防護** - 速率限制、CORS、Helmet 等安全措施

## 技術架構

- **後端框架**: Node.js + Express.js
- **資料庫**: SQLite (預設) / PostgreSQL / MySQL
- **ORM**: Sequelize
- **驗證**: Joi
- **安全**: Helmet, CORS, Rate Limiting
- **API 文檔**: Swagger

## 專案結構

```
/
├── src/
│   ├── config/
│   │   └── database.js          # 資料庫配置
│   ├── controllers/
│   │   ├── administratorController.js
│   │   ├── announcementController.js
│   │   ├── eventController.js
│   │   └── registrationController.js
│   ├── models/
│   │   ├── Administrator.js
│   │   ├── Announcement.js
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   └── index.js
│   ├── routes/
│   │   ├── administratorRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── services/
│   │   ├── administratorService.js
│   │   ├── announcementService.js
│   │   ├── eventService.js
│   │   └── registrationService.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── utils/
│   │   ├── responseHelper.js
│   │   ├── dateHelper.js
│   │   └── validationHelper.js
│   ├── app.js
│   └── server.js
├── db/
│   ├── migrations/
│   │   └── 001_create_database_structure.js
│   └── seeders/
│       ├── 001_demo_administrators.js
│       ├── 002_demo_announcements.js
│       ├── 003_demo_events.js
│       └── 004_demo_registrations.js
├── database.sqlite
├── env.example
├── package.json
└── README.md
```

## 安裝與設定

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境設定

複製環境變數範例檔案：

```bash
cp env.example .env
```

編輯 `.env` 檔案，設定您的資料庫連線資訊：

```env
# 資料庫設定
DB_TYPE=sqlite

# 方法 1: 使用 Neon 提供的 DATABASE_URL (PostgreSQL)
# DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require

# 方法 2: 分別設定各個參數 (PostgreSQL)
# DB_HOST=ep-xxx-xxx.us-east-1.aws.neon.tech
# DB_PORT=5432
# DB_NAME=your-database-name
# DB_USER=your-username
# DB_PASSWORD=your-password
# DB_SSL=true

# 本地開發資料庫設定
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_event_db
DB_USER=postgres
DB_PASSWORD=0000

# 伺服器設定
PORT=3000
NODE_ENV=development
```

### 3. 資料庫設定

#### SQLite (預設)

無需額外設定，系統會自動建立 `database.sqlite` 檔案。

#### PostgreSQL

```bash
# 建立資料庫
CREATE DATABASE my_event_db;
```

#### MySQL

```bash
# 建立資料庫
CREATE DATABASE my_event_db;
```

### 4. 執行資料庫遷移

```bash
# 執行遷移
npm run migrate

# 執行種子資料
npm run seed
```

### 5. 啟動伺服器

```bash
# 開發模式
npm run dev

# 生產模式
npm start
```

## 身份驗證機制

### LINE 用戶身份驗證

所有 API 都需要在請求 header 中提供 LINE 用戶 ID：

```javascript
headers: {
  'x-line-user-id': 'your-line-user-id'
}
```

### 驗證流程

1. **lineAuthMiddleware**: 嚴格驗證，要求用戶必須是已註冊的管理員
2. **lineAuthOptionalMiddleware**: 寬鬆驗證，允許未註冊的 LINE 用戶（用於註冊流程）

### 錯誤回應

```json
{
  "success": false,
  "message": "未提供 LINE USER ID"
}
```

或

```json
{
  "success": false,
  "message": "無效的管理員權限"
}
```

## API 文檔

### 基礎資訊

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **認證**: 所有 API 都需要 `x-line-user-id` header

### 管理員 API

#### 取得管理員列表

```http
GET /api/administrators?page=1&limit=10
Headers:
  x-line-user-id: your-line-user-id
```

**回應範例:**

```json
{
  "success": true,
  "data": {
    "administrators": [
      {
        "id": 1,
        "username": "admin1",
        "name": "管理員一",
        "phone": "0912345678",
        "birth": "1990-01-01",
        "gender": "M",
        "line_id": "line123",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

#### 建立管理員

```http
POST /api/administrators
Headers:
  x-line-user-id: your-line-user-id
Content-Type: application/json

{
  "username": "newadmin",
  "name": "新管理員",
  "phone": "0912345678",
  "birth": "1990-01-01",
  "gender": "M"
}
```

#### 刪除管理員

```http
DELETE /api/administrators/1
Headers:
  x-line-user-id: your-line-user-id
```

### 公告 API

#### 取得公告列表

```http
GET /api/announcements?page=1&limit=10
Headers:
  x-line-user-id: your-line-user-id
```

#### 建立公告

```http
POST /api/announcements
Headers:
  x-line-user-id: your-line-user-id
Content-Type: application/json

{
  "title": "重要公告",
  "content": "這是一個重要的公告內容"
}
```

#### 更新公告

```http
PUT /api/announcements/1
Headers:
  x-line-user-id: your-line-user-id
Content-Type: application/json

{
  "title": "更新的公告標題",
  "content": "更新的公告內容"
}
```

#### 刪除公告

```http
DELETE /api/announcements/1
Headers:
  x-line-user-id: your-line-user-id
```

### 活動 API

#### 取得活動列表

```http
GET /api/events?page=1&limit=10
Headers:
  x-line-user-id: your-line-user-id
```

#### 建立活動

```http
POST /api/events
Headers:
  x-line-user-id: your-line-user-id
Content-Type: application/json

{
  "title": "扶輪社年度聚會",
  "description": "年度聚會活動",
  "start_time": "2024-12-25T18:00:00.000Z",
  "end_time": "2024-12-25T22:00:00.000Z",
  "registration_deadline": "2024-12-20T23:59:59.000Z",
  "location": "台北市信義區",
  "is_capacity_limited": true,
  "max_participants": 50
}
```

#### 更新活動

```http
PUT /api/events/1
Headers:
  x-line-user-id: your-line-user-id
Content-Type: application/json

{
  "title": "更新的活動標題",
  "description": "更新的活動描述",
  "start_time": "2024-12-25T18:00:00.000Z",
  "end_time": "2024-12-25T22:00:00.000Z",
  "registration_deadline": "2024-12-20T23:59:59.000Z",
  "location": "台北市信義區",
  "is_capacity_limited": true,
  "max_participants": 60
}
```

#### 刪除活動

```http
DELETE /api/events/1
Headers:
  x-line-user-id: your-line-user-id
```

### 報名 API

#### 取得活動報名名單

```http
GET /api/registrations?event_id=1&page=1&limit=10
Headers:
  x-line-user-id: your-line-user-id
```

#### 報名活動

```http
POST /api/registrations
Headers:
  x-line-user-id: your-line-user-id
Content-Type: application/json

{
  "event_id": 1,
  "participant_name": "張三",
  "remark": "素食者"
}
```

#### 取消報名

```http
DELETE /api/registrations/1
Headers:
  x-line-user-id: your-line-user-id
```

## 資料模型

### Administrator (管理員)

- `id`: 主鍵
- `username`: 用戶名
- `name`: 姓名
- `phone`: 電話
- `birth`: 生日
- `gender`: 性別 (M/F/O)
- `line_id`: LINE 用戶 ID
- `is_active`: 是否啟用
- `createdAt`: 建立時間
- `updatedAt`: 更新時間

### Announcement (公告)

- `id`: 主鍵
- `title`: 標題
- `content`: 內容
- `created_by`: 建立者 ID
- `is_active`: 是否啟用
- `createdAt`: 建立時間
- `updatedAt`: 更新時間

### Event (活動)

- `id`: 主鍵
- `title`: 標題
- `description`: 描述
- `start_time`: 開始時間
- `end_time`: 結束時間
- `registration_deadline`: 報名截止時間
- `location`: 地點
- `is_capacity_limited`: 是否限制人數
- `max_participants`: 最大參與人數
- `administrator_id`: 建立者 ID
- `status`: 狀態 (upcoming/ongoing/completed/cancelled)
- `createdAt`: 建立時間
- `updatedAt`: 更新時間

### Registration (報名)

- `id`: 主鍵
- `event_id`: 活動 ID
- `administrator_id`: 管理員 ID
- `participant_name`: 參與者姓名
- `remark`: 備註
- `registration_time`: 報名時間
- `createdAt`: 建立時間
- `updatedAt`: 更新時間

## 錯誤處理

### 常見錯誤碼

- `400`: 請求資料驗證失敗
- `401`: 未授權的操作
- `403`: 沒有權限
- `404`: 資源不存在
- `409`: 衝突（如重複報名）
- `500`: 伺服器內部錯誤

### 錯誤回應格式

```json
{
  "success": false,
  "message": "錯誤訊息",
  "errors": [
    {
      "field": "fieldName",
      "message": "欄位錯誤訊息"
    }
  ]
}
```

## 開發指令

```bash
# 啟動開發伺服器
npm run dev

# 測試資料庫連線
npm run test-db

# 執行資料庫遷移
npm run migrate

# 執行種子資料
npm run seed

# 回滾遷移
npm run migrate:undo

# 回滾種子資料
npm run seed:undo
```

## 部署

### 環境變數設定

生產環境請設定以下環境變數：

```env
NODE_ENV=production
PORT=3000
DB_TYPE=postgres
DATABASE_URL=your-production-database-url
```

### 資料庫備份

```bash
# SQLite
cp database.sqlite backup.sqlite

# PostgreSQL
pg_dump your_database > backup.sql

# MySQL
mysqldump your_database > backup.sql
```

## 貢獻

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 聯絡資訊

如有任何問題或建議，請透過以下方式聯絡：

- 專案 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 電子郵件: your-email@example.com
