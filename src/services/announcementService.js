const { Announcement, Administrator } = require("../models");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const moment = require("moment");

class AnnouncementService {
  // 建立公告
  async createAnnouncement(announcementData, administrator_id) {
    try {
      // 數據驗證
      if (!announcementData || !administrator_id) {
        return {
          success: false,
          message: "缺少必要的參數",
          error: "announcementData 和 administrator_id 參數為必填"
        };
      }

      // 驗證必要欄位
      if (!announcementData.title || !announcementData.content) {
        return {
          success: false,
          message: "缺少必要欄位",
          error: "標題和內容為必填欄位"
        };
      }

      const announcement = await Announcement.create({
        ...announcementData,
        administrator_id: administrator_id,
        status: announcementData.status || 'active' // 預設為 active
      });

      // 重新載入包含關聯資料
      const createdAnnouncement = await announcement.reload({
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
        data: createdAnnouncement,
        message: "建立公告成功"
      };
    } catch (error) {
      return {
        success: false,
        message: "建立公告失敗",
        error: error.message
      };
    }
  }

  // 取得所有有效公告
  async getAllAnnouncements(page = 1, limit = 10, search = "", status = "active") {
    try {
      const offset = (page - 1) * limit;
      const where = { status: status };

      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows: announcements } = await Announcement.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      return {
        success: true,
        data: {
          announcements,
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
  async updateAnnouncement(id, updateData) {
    try {
      const announcement = await Announcement.findOne({
        where: { id, status: "active" },
      });

      if (!announcement) {
        return {
          success: false,
          message: "公告不存在",
          error: "找不到指定的公告或公告已被刪除"
        };
      }

      await announcement.update(updateData);
      const updatedAnnouncement = await announcement.reload({
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
        data: updatedAnnouncement,
        message: "公告更新成功"
      };
    } catch (error) {
      return {
        success: false,
        message: "公告更新失敗",
        error: error.message
      };
    }
  }

  // 刪除公告
  async deleteAnnouncement(id) {
    try {
      const announcement = await Announcement.findOne({
        where: { id, status: "active" },
      });

      if (!announcement) {
        return {
          success: false,
          message: "公告不存在或已被刪除",
        };
      }

      await announcement.destroy();
      return { 
        success: true,
        message: "公告已永久刪除" 
      };
    } catch (error) {
      return {
        success: false,
        message: "刪除公告失敗",
        error: error.message,
      };
    }
  }
}

module.exports = new AnnouncementService();
