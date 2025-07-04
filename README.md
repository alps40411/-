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

# 環境設定

## 環境變數
1. 複製 `.env.example` 到 `.env`：
```bash
cp .env.example .env
```

2. 設定環境變數：
- 開發環境：
  ```env
  NODE_ENV=development
  API_URL=https://your-ngrok-url.ngrok.io  # 設定 Base URL
  ```

- 生產環境：
  ```env
  NODE_ENV=production
  API_URL=https://your-domain.com  # 設定為您的正式網域
  ```

## API 文件
- 開發環境：http://localhost:3000/api-docs
- 生產環境：https://your-domain.com/api-docs

## 注意事項
- 使用 ngrok 進行本地測試時，請將 `API_URL` 更新為 ngrok 提供的 URL
- 部署到正式環境時，請將 `API_URL` 更新為您的正式網域
- API 文件會自動使用 `API_URL` 作為基礎 URL
