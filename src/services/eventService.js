const { Event, Administrator, Registration } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

class EventService {
  /**
   * 創建新活動
   */
  async createEvent(eventData) {
    try {
      const event = await Event.create(eventData);
      const createdEvent = await Event.findByPk(event.id, {
        include: [
          {
            model: Administrator,
            as: "creator",
            attributes: ["id", "username", "name"],
          },
        ],
      });

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

      await event.update(updateData);
      const updatedEvent = await Event.findByPk(id, {
        include: [
          {
            model: Administrator,
            as: "creator",
            attributes: ["id", "username", "name"],
          },
        ],
      });

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
