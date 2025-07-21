const { Event, Administrator, Registration } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const { convertTimeFieldsToTaipei } = require("../utils/dateHelper");

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
        status,
        ...cleanData
      } = eventData;

      const event = await Event.create({
        ...cleanData,
        administrator_id: administrator_id,
      });

      // 重新載入資料
      const createdEvent = await event.reload();

      return {
        success: true,
        data: convertTimeFieldsToTaipei(createdEvent.toJSON()),
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
        order: [["createdAt", "DESC"]],
      });

      return {
        success: true,
        data: {
          events: convertTimeFieldsToTaipei(
            events.map((event) => event.toJSON())
          ),
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
        where: { id },
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
        status,
        ...cleanUpdateData
      } = updateData;

      await event.update(cleanUpdateData);
      const updatedEvent = await event.reload();

      return {
        success: true,
        data: convertTimeFieldsToTaipei(updatedEvent.toJSON()),
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
        where: { id },
      });

      if (!event) {
        return {
          success: false,
          message: "活動不存在",
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

  /**
   * 取得單一活動報名資訊
   */
  async getEventRegistrationInfo(eventId) {
    try {
      const event = await Event.findByPk(eventId);

      if (!event) {
        return {
          success: false,
          message: "活動不存在",
        };
      }

      // 計算實際報名統計
      const registrationCount = await Registration.count({
        where: { event_id: eventId },
      });

      // 同步 current_participants 與實際報名數
      if (event.current_participants !== registrationCount) {
        await event.update({ current_participants: registrationCount });
      }

      const eventData = convertTimeFieldsToTaipei(event.toJSON());
      
      return {
        success: true,
        data: {
          event_id: eventData.id,
          event_title: eventData.title,
          location: eventData.location,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          max_participants: eventData.max_participants,
          current_participants: registrationCount, // 使用實際計算的數值
          is_capacity_limited: eventData.is_capacity_limited,
          registration_deadline: eventData.registration_deadline,
          is_full: eventData.is_capacity_limited && registrationCount >= eventData.max_participants,
          available_slots: eventData.is_capacity_limited 
            ? Math.max(0, eventData.max_participants - registrationCount)
            : null,
        },
        message: "獲取活動報名資訊成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "獲取活動報名資訊失敗",
        error: error.message,
      };
    }
  }
}

module.exports = new EventService();
