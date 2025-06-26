const announcementService = require("../services/announcementService");

class AnnouncementController {
  // 建立公告
  async createAnnouncement(req, res, next) {
    try {
      const { administrator_id, ...announcementData } = req.body;
      const result = await announcementService.createAnnouncement(
        announcementData,
        administrator_id
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得所有公告
  async getAllAnnouncements(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await announcementService.getAllAnnouncements(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 更新公告
  async updateAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const { ...updateData } = req.body;
      const result = await announcementService.updateAnnouncement(
        id,
        updateData
      );

      if (!result.success) {
        const statusCode = result.message.includes("不存在") ? 404 : 
                          result.message.includes("沒有權限") ? 403 : 400;
        return res.status(statusCode).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  // 刪除公告
  async deleteAnnouncement(req, res, next) {
    try {
      const { id } = req.params;

      let result = await announcementService.deleteAnnouncement(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnnouncementController();
