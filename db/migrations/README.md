# 資料庫 Migration 說明

## 最終資料庫結構

本專案已整理為單一最終資料庫結構，包含以下四個主要表格：

### 1. administrators (管理員表)
- `id`: 主鍵，自動遞增
- `username`: 用戶名，唯一，最大50字符
- `name`: 姓名，最大100字符
- `phone`: 手機號，唯一，最大20字符
- `birth`: 生日，日期格式
- `gender`: 性別，枚舉('M', 'F')，預設'M'
- `line_id`: Line ID，唯一，最大50字符
- `createdAt`: 創建時間

### 2. announcements (公告表)
- `id`: 主鍵，自動遞增
- `title`: 公告標題，最大200字符
- `content`: 公告內容，文本格式
- `status`: 狀態，枚舉('active', 'inactive')，預設'active'
- `administrator_id`: 創建者ID，外鍵關聯到administrators表
- `createdAt`: 創建時間
- `updatedAt`: 更新時間

### 3. events (活動表)
- `id`: 主鍵，自動遞增
- `title`: 活動標題，最大200字符
- `description`: 活動描述，文本格式（可為空）
- `start_time`: 活動開始時間
- `end_time`: 活動結束時間
- `location`: 活動地點，最大200字符（可為空）
- `is_capacity_limited`: 是否限制人數，布爾值，預設true
- `max_participants`: 最大參與人數（可為空）
- `current_participants`: 當前參與人數，預設0
- `registration_deadline`: 報名截止時間
- `status`: 活動狀態，枚舉('upcoming', 'ongoing', 'completed', 'cancelled')，預設'upcoming'
- `administrator_id`: 創建者ID，外鍵關聯到administrators表
- `createdAt`: 創建時間
- `updatedAt`: 更新時間

### 4. event_registrations (活動報名表)
- `id`: 主鍵，自動遞增
- `event_id`: 活動ID，外鍵關聯到events表
- `administrator_id`: 報名者ID，外鍵關聯到administrators表
- `participant_name`: 參與者姓名，最大100字符
- `remark`: 備註，文本格式（可為空）
- `registration_time`: 報名時間

## 資料表關聯關係

1. **Administrator → Announcements**: 一對多關係
   - 一個管理員可以創建多個公告

2. **Administrator → Events**: 一對多關係
   - 一個管理員可以創建多個活動

3. **Event → Registrations**: 一對多關係
   - 一個活動可以有多個報名記錄

4. **Administrator → Registrations**: 一對多關係
   - 一個管理員可以有多個報名記錄

## 使用 Migration

### 執行 Migration
```bash
# 執行資料庫migration
npx sequelize-cli db:migrate
```

### 撤銷 Migration
```bash
# 撤銷migration（刪除所有表格）
npx sequelize-cli db:migrate:undo:all
```

### 重新建立資料庫
```bash
# 完全重置資料庫
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

## 索引設計

為了提升查詢效能，已在以下欄位建立索引：

### administrators 表
- `username` (單一索引)
- `line_id` (單一索引)

### announcements 表
- `administrator_id` (單一索引)
- `status` (單一索引)

### events 表
- `administrator_id` (單一索引)
- `status` (單一索引)
- `start_time` (單一索引)
- `registration_deadline` (單一索引)

### event_registrations 表
- `event_id` (單一索引)
- `administrator_id` (單一索引)
- `registration_time` (單一索引)
- `event_id, administrator_id` (複合唯一索引，防止重複報名)

## 注意事項

1. **外鍵約束**: 所有外鍵都設定了 `CASCADE` 更新和刪除，確保資料一致性
2. **唯一約束**: 防止同一管理員重複報名同一活動
3. **資料驗證**: 模型層包含額外的業務邏輯驗證
4. **時間戳**: 部分表格使用自定義時間戳欄位以符合業務需求

## Migration 檔案

目前只包含一個完整的migration檔案：
- `001_create_database_structure.js` - 完整的資料庫結構（包含所有表格、索引和約束）

這個單一migration文件包含了所有必要的資料庫結構，無需額外的增量更新。 