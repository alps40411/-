const { Event, Administrator, Registration } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

class EventService {
  /**
   * 創建新活動
   */
  async createEvent(eventData, administrator_id) {
    try {
      // 數據驗證
      if (!eventData || !administrator_id) {
        return {
          success: false,
          message: "缺少必要的參數",
          error: "eventData 和 administrator_id 參數為必填",
        };
      }

      // 過濾掉不應該由客戶端設定的欄位
      const {
        id: _id,
        createdAt,
        updatedAt,
        creator,
        administrator_id: _administrator_id,
        current_participants,
        ...cleanData
      } = eventData;

      const event = await Event.create({
        ...cleanData,
        administrator_id: administrator_id,
        status: cleanData.status || "upcoming", // 預設為 upcoming
      });

      // 重新載入資料
      const createdEvent = await event.reload();

      return {
        success: true,
        data: createdEvent,
        message: "活動創建成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "創建活動失敗",
        error: error.message,
      };
    }
  }

  /**
   * 獲取所有活動列表（分頁）
   */
  async getAllEvents(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows: events } = await Event.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["start_time", "ASC"]],
      });

      return {
        success: true,
        data: {
          events,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit),
          },
        },
        message: "獲取活動列表成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "獲取活動列表失敗",
        error: error.message,
      };
    }
  }

  /**
   * 更新活動
   */
  async updateEvent(id, updateData, administrator_id) {
    try {
      const event = await Event.findOne({
        where: { id, status: { [Op.ne]: "cancelled" } },
      });

      if (!event) {
        return {
          success: false,
          message: "找不到指定的活動",
        };
      }

      // 檢查權限：只有建立者可以更新
      if (event.administrator_id !== administrator_id) {
        return {
          success: false,
          message: "沒有權限更新此活動",
          error: "只有建立者可以更新活動",
        };
      }

      // 過濾掉不應該由客戶端更新的欄位
      const {
        id: _id,
        createdAt,
        updatedAt,
        creator,
        administrator_id: _administrator_id,
        current_participants,
        ...cleanUpdateData
      } = updateData;

      await event.update(cleanUpdateData);
      const updatedEvent = await event.reload();

      return {
        success: true,
        data: updatedEvent,
        message: "活動更新成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "更新活動失敗",
        error: error.message,
      };
    }
  }

  /**
   * 刪除活動
   */
  async deleteEvent(id, administrator_id) {
    try {
      const event = await Event.findOne({
        where: { id, status: { [Op.ne]: "cancelled" } },
      });

      if (!event) {
        return {
          success: false,
          message: "活動不存在或已被取消",
        };
      }

      // 檢查權限：只有建立者可以刪除
      if (event.administrator_id !== administrator_id) {
        return {
          success: false,
          message: "沒有權限刪除此活動",
          error: "只有建立者可以刪除活動",
        };
      }

      await event.destroy();
      return {
        success: true,
        message: "活動已永久刪除",
      };
    } catch (error) {
      return {
        success: false,
        message: "刪除活動失敗",
        error: error.message,
      };
    }
  }
}

module.exports = new EventService();
