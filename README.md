# 扶輪社活動管理系統

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

### 活動報名 API

#### 建立活動報名
- **POST** `/api/registrations`
- **描述**: 允許多個管理員報名同一活動
- **回應格式**: 直接回傳服務層的結果，包含成功/失敗狀態和訊息

#### 取得活動報名資訊
- **GET** `/api/events/{id}/registration-info`
- **描述**: 取得單一活動的報名資訊，包含是否額滿、剩餘名額等
- **回應範例**:
```json
{
  "success": true,
  "data": {
    "event_id": 1,
    "event_title": "扶輪社年度大會",
    "max_participants": 100,
    "current_participants": 85,
    "is_capacity_limited": true,
    "registration_deadline": "2024-12-31T23:59:59.000Z",
    "is_full": false,
    "available_slots": 15
  }
}
```

### 公告 API

#### 取得單一公告
- **GET** `/api/announcements/{id}`
- **描述**: 取得指定ID的公告詳細資訊
- **回應範例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "重要公告",
    "content": "公告內容",
    "administrator_id": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 管理員/會員 API

#### 建立管理員或會員
- **POST** `/api/administrators`
- **描述**: 建立新的管理員或會員帳號
- **認證**: 需要在Authorization header中提供Bearer token (LINE ID)
- **請求範例**:
```json
{
  "username": "新用戶",
  "phone": "0912345678",
  "birth": "1990-01-01",
  "gender": "M",
  "is_admin": false
}
```
- **回應範例**:
```json
{
  "success": true,
  "message": "會員創建成功",
  "data": {
    "id": 1,
    "username": "新用戶",
    "phone": "0912345678",
    "birth": "1990-01-01",
    "gender": "M",
    "line_id": "U1234567890abcdef",
    "is_admin": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 確認 LINE ID 註冊狀態
- **GET** `/api/administrators/check-registration`
- **描述**: 確認bearer token中的LINE ID是否已註冊為管理員或會員
- **認證**: 需要在Authorization header中提供Bearer token (LINE ID)
- **回應範例 (已註冊)**:
```json
{
  "is_registered": true,
  "administrator_id": 1,
  "username": "用戶名稱",
  "line_id": "U1234567890abcdef",
  "is_admin": false
}
```
- **回應範例 (未註冊)**:
```json
{
  "is_registered": false,
  "line_id": "U1234567890abcdef"
}
```


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
