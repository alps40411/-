# 扶輪社活動管理系統

一個功能完整的活動與公告管理後端 API，支援活動 CRUD、公告 CRUD、活動報名與報名名單查詢，並具備管理員管理功能。

## 功能特色

- 📢 **公告管理** - 完整的公告 CRUD 操作
- 🎉 **活動管理** - 活動建立、更新、刪除與查詢
- 📝 **報名系統** - 活動報名與報名名單管理
- 👥 **管理員系統** - 管理員資料管理
- 🔍 **搜尋功能** - 公告與活動搜尋
- 📊 **統計功能** - 各種統計數據查詢
- 📄 **匯出功能** - 報名名單匯出
- 🛡️ **安全防護** - 速率限制、CORS、Helmet 等安全措施

## 技術架構

- **後端框架**: Node.js + Express.js
- **資料庫**: PostgreSQL (可配置)
- **ORM**: Sequelize
- **驗證**: Joi
- **安全**: Helmet, CORS, Rate Limiting

## 專案結構

```
my-event-api/
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
│   └── seeders/
├── .env
├── .sequelizerc
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
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_event_db
DB_USER=root
DB_PASSWORD=password

# 伺服器設定
PORT=3000
NODE_ENV=development
```

### 3. 資料庫設定

#### PostgreSQL

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

## API 文檔

### 基礎資訊

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`

### 管理員 API

#### 取得管理員列表

```http
GET /api/administrators?page=1&limit=10
```

#### 取得管理員資料

```http
GET /api/administrators/1
```

#### 建立管理員

```http
POST /api/administrators
Content-Type: application/json

{
  "username": "newadmin",
  "name": "新管理員",
  "phone": "0912345678",
  "birth": "1990-01-01",
  "gender": "M",
  "line_id": "line123"
}
```

#### 更新管理員

```http
PUT /api/administrators/1
Content-Type: application/json

{
  "name": "更新的管理員姓名",
  "phone": "0987654321",
  "gender": "F"
}
```

#### 刪除管理員

```http
DELETE /api/administrators/1
```

#### 依 Line ID 查詢管理員

```http
GET /api/administrators/line/line123
```

### 公告 API

#### 取得公告列表

```http
GET /api/announcements?page=1&limit=10&created_by=1
```

#### 建立公告

```http
POST /api/announcements
Content-Type: application/json

{
  "title": "重要公告",
  "description": "這是一個重要的公告內容",
  "created_by": 1
}
```

#### 搜尋公告

```http
GET /api/announcements/search?q=關鍵字&page=1&limit=10
```

#### 更新公告

```http
PUT /api/announcements/1
Content-Type: application/json

{
  "title": "更新的公告標題",
  "description": "更新的公告內容"
}
```

#### 刪除公告

```http
DELETE /api/announcements/1
```

### 活動 API

#### 取得活動列表

```http
GET /api/events?page=1&limit=10
```

#### 建立活動

```http
POST /api/events
Content-Type: application/json

{
  "title": "技術研討會",
  "description": "深入探討最新技術趨勢",
  "start_time": "2024-01-15T09:00:00Z",
  "end_time": "2024-01-15T17:00:00Z",
  "registration_deadline": "2024-01-10T23:59:59Z",
  "place": "台北市信義區松仁路100號",
  "max_participants": 50,
  "created_by": 1
}
```

#### 搜尋活動

```http
GET /api/events/search?q=技術&page=1&limit=10
```

#### 檢查活動報名狀態

```http
GET /api/events/1/registration-status
```

#### 取得活動報名名單

```http
GET /api/events/1/registrations
```

### 報名 API

#### 報名活動

```http
POST /api/registrations
Content-Type: application/json

{
  "event_id": 1,
  "participant_name": "張小明",
  "phone": "0912345678",
  "birth": "1995-05-15",
  "gender": "M",
  "line_id": "zhang123"
}
```

#### 取得報名列表

```http
GET /api/registrations?event_id=1&page=1&limit=10
```

#### 取消報名

```http
DELETE /api/registrations/1
```

#### 匯出報名名單

```http
GET /api/registrations/export/event/1
```

## 資料庫結構

### 管理員表 (administrators)

- `id`: 主鍵
- `username`: 使用者名稱 (唯一)
- `name`: 姓名
- `phone`: 電話
- `birth`: 生日
- `gender`: 性別 (M/F)
- `line_id`: Line ID

### 公告表 (announcements)

- `id`: 主鍵
- `title`: 標題
- `description`: 內容
- `created_by`: 建立者 ID (外鍵)
- `created_at`: 建立時間
- `updated_at`: 更新時間

### 活動表 (events)

- `id`: 主鍵
- `title`: 標題
- `description`: 內容
- `start_time`: 開始時間
- `end_time`: 結束時間
- `registration_deadline`: 報名截止時間
- `place`: 地點
- `max_participants`: 最大參與人數
- `created_by`: 建立者 ID (外鍵)
- `created_at`: 建立時間
- `updated_at`: 更新時間

### 報名表 (event_registrations)

- `id`: 主鍵
- `event_id`: 活動 ID (外鍵)
- `participant_name`: 參與者姓名
- `phone`: 電話
- `birth`: 生日
- `gender`: 性別 (M/F)
- `line_id`: Line ID
- `registration_time`: 報名時間
- `created_at`: 建立時間
- `updated_at`: 更新時間

## 開發指令

```bash
# 開發模式
npm run dev

# 測試 API
npm run test

# 測試伺服器
npm run test-server

# 資料庫遷移
npm run migrate

# 執行種子資料
npm run seed

# 回滾遷移
npm run migrate:undo

# 回滾種子資料
npm run seed:undo
```

## 錯誤處理

API 使用統一的錯誤回應格式：

```json
{
  "success": false,
  "message": "錯誤訊息",
  "errors": [
    {
      "field": "欄位名稱",
      "message": "欄位錯誤訊息"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 安全措施

- **速率限制**: 防止暴力攻擊和 DDoS
- **CORS 設定**: 控制跨域請求
- **Helmet**: 設定安全標頭
- **輸入驗證**: 使用 Joi 進行嚴格的輸入驗證

## 部署

### 生產環境設定

1. 設定 `NODE_ENV=production`
2. 設定適當的資料庫連線
3. 使用 PM2 或類似工具管理程序
4. 設定反向代理 (Nginx)

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 授權

MIT License
