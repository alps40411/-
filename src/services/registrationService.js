const { Registration, Event, Administrator } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

class RegistrationService {
  /**
   * 創建新報名
   */
  async createRegistration(registrationData) {
    try {
      // 檢查活動是否存在且可報名
      const event = await Event.findByPk(registrationData.event_id);
      if (!event || event.status === "cancelled") {
        return {
          success: false,
          message: "活動不存在或已取消",
        };
      }

      // 檢查報名是否仍開放
      const now = new Date();
      if (event.registration_deadline < now) {
        return {
          success: false,
          message: "報名已截止",
        };
      }

      // 檢查這個活動是否已經有其他管理員處理報名（1對1關係）
      const existingRegistration = await Registration.findOne({
        where: { 
          event_id: registrationData.event_id,
          administrator_id: { [Op.ne]: registrationData.administrator_id }
        }
      });

      if (existingRegistration) {
        return {
          success: false,
          message: "此活動已由其他管理員處理報名，每個活動只能由一位管理員負責",
        };
      }

      // 檢查活動是否已滿
      if (event.is_capacity_limited && event.current_participants >= event.max_participants) {
        return {
          success: false,
          message: "活動報名已滿",
        };
      }

      // 創建報名記錄
      const registration = await Registration.create(registrationData);

      // 更新活動當前參與人數
      await event.increment("current_participants");

      return {
        success: true,
        data: registration,
        message: "報名成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "報名失敗",
        error: error.message,
      };
    }
  }

  /**
   * 取消報名
   */
  async cancelRegistration(id, administrator_id) {
    try {
      const registration = await Registration.findOne({
        where: { 
          id, 
          administrator_id: administrator_id 
        },
      });

      if (!registration) {
        return {
          success: false,
          message: "找不到指定的報名記錄或無權限操作",
        };
      }

      // 減少活動參與人數
      const event = await Event.findByPk(registration.event_id);
      if (event && event.current_participants > 0) {
        await event.decrement("current_participants");
      }

      // 直接刪除報名記錄
      await registration.destroy();

      return {
        success: true,
        message: "報名記錄已刪除",
      };
    } catch (error) {
      return {
        success: false,
        message: "刪除報名記錄失敗",
        error: error.message,
      };
    }
  }

  /**
   * 取得特定活動的報名記錄
   */
  async getEventRegistrations(eventId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows: registrations } = await Registration.findAndCountAll({
        where: { 
          event_id: eventId
        },
        include: [
          {
            model: Administrator,
            as: "administrator",
            attributes: ["id", "username"],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["registration_time", "DESC"]],
      });

      return {
        success: true,
        data: {
          registrations,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit),
          },
        },
        message: "獲取活動報名列表成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "獲取活動報名列表失敗",
        error: error.message,
      };
    }
  }
}

module.exports = new RegistrationService();

