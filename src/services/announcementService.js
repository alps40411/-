const { Announcement, Administrator } = require("../models");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const moment = require("moment");
const { convertTimeFieldsToTaipei } = require("../utils/dateHelper");

class AnnouncementService {
  // 建立公告
  async createAnnouncement(announcementData, administrator_id) {
    try {
      // 數據驗證
      if (!announcementData || !administrator_id) {
        return {
          success: false,
          message: "缺少必要的參數",
          error: "announcementData 和 administrator_id 參數為必填",
        };
      }

      // 驗證必要欄位
      if (!announcementData.title || !announcementData.content) {
        return {
          success: false,
          message: "缺少必要欄位",
          error: "標題和內容為必填欄位",
        };
      }

      // 過濾掉不應該由客戶端設定的欄位
      const {
        id: _id,
        is_active,
        createdAt,
        updatedAt,
        creator,
        created_by,
        status,
        ...cleanData
      } = announcementData;

      const announcement = await Announcement.create({
        ...cleanData,
        administrator_id: administrator_id,
      });

      // 重新載入資料
      const createdAnnouncement = await announcement.reload();

      return {
        success: true,
        data: convertTimeFieldsToTaipei(createdAnnouncement.toJSON()),
        message: "建立公告成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "建立公告失敗",
        error: error.message,
      };
    }
  }

  // 取得所有公告
  async getAllAnnouncements(page = 1, limit = 10, search = "") {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows: announcements } = await Announcement.findAndCountAll(
        {
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["createdAt", "DESC"]],
        }
      );

      return {
        success: true,
        data: {
          announcements: convertTimeFieldsToTaipei(
            announcements.map((announcement) => announcement.toJSON())
          ),
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit),
          },
        },
        message: "獲取公告列表成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "獲取公告列表失敗",
        error: error.message,
      };
    }
  }

  // 更新公告
  async updateAnnouncement(id, updateData, administrator_id) {
    try {
      const announcement = await Announcement.findOne({
        where: { id },
      });

      if (!announcement) {
        return {
          success: false,
          message: "公告不存在",
          error: "找不到指定的公告或公告已被刪除",
        };
      }

      // 檢查權限：只有建立者可以更新
      if (announcement.administrator_id !== administrator_id) {
        return {
          success: false,
          message: "沒有權限更新此公告",
          error: "只有建立者可以更新公告",
        };
      }

      // 過濾掉不應該由客戶端更新的欄位
      const {
        id: _id,
        is_active,
        createdAt,
        updatedAt,
        creator,
        created_by,
        administrator_id: _administrator_id,
        status,
        ...cleanUpdateData
      } = updateData;

      await announcement.update(cleanUpdateData);
      const updatedAnnouncement = await announcement.reload();

      return {
        success: true,
        data: convertTimeFieldsToTaipei(updatedAnnouncement.toJSON()),
        message: "公告更新成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "公告更新失敗",
        error: error.message,
      };
    }
  }

  // 刪除公告
  async deleteAnnouncement(id, administrator_id) {
    try {
      const announcement = await Announcement.findOne({
        where: { id },
      });

      if (!announcement) {
        return {
          success: false,
          message: "公告不存在或已被刪除",
        };
      }

      // 檢查權限：只有建立者可以刪除
      if (announcement.administrator_id !== administrator_id) {
        return {
          success: false,
          message: "沒有權限刪除此公告",
          error: "只有建立者可以刪除公告",
        };
      }

      await announcement.destroy();
      return {
        success: true,
        message: "公告已永久刪除",
      };
    } catch (error) {
      return {
        success: false,
        message: "刪除公告失敗",
        error: error.message,
      };
    }
  }

  // 取得單一公告
  async getAnnouncement(id) {
    try {
      const announcement = await Announcement.findByPk(id);

      if (!announcement) {
        return {
          success: false,
          message: "公告不存在",
        };
      }

      return {
        success: true,
        data: convertTimeFieldsToTaipei(announcement.toJSON()),
        message: "獲取公告成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "獲取公告失敗",
        error: error.message,
      };
    }
  }
}

module.exports = new AnnouncementService();
