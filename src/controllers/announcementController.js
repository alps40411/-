const announcementService = require("../services/announcementService");

class AnnouncementController {
  // 建立公告
  async createAnnouncement(req, res, next) {
    try {
      const { created_by, ...announcementData } = req.body;
      const announcement = await announcementService.createAnnouncement(
        announcementData,
        created_by
      );

      res.status(201).json({
        success: true,
        message: "公告建立成功",
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得所有公告
  async getAllAnnouncements(req, res, next) {
    try {
      const { page = 1, limit = 10, created_by } = req.query;
      const result = await announcementService.getAllAnnouncements(
        parseInt(page),
        parseInt(limit),
        created_by ? parseInt(created_by) : null
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得指定公告
  async getAnnouncementById(req, res, next) {
    try {
      const { id } = req.params;
      const announcement = await announcementService.getAnnouncementById(id);

      res.status(200).json({
        success: true,
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  }

  // 更新公告
  async updateAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const { updated_by, ...updateData } = req.body;
      const announcement = await announcementService.updateAnnouncement(
        id,
        updateData,
        updated_by
      );

      res.status(200).json({
        success: true,
        message: "公告更新成功",
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  }

  // 刪除公告
  async deleteAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const { force, deleted_by } = req.body;

      let result;
      if (force === "true") {
        result = await announcementService.forceDeleteAnnouncement(
          id,
          deleted_by
        );
      } else {
        result = await announcementService.deleteAnnouncement(id, deleted_by);
      }

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // 搜尋公告
  async searchAnnouncements(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "請提供搜尋關鍵字",
        });
      }

      const result = await announcementService.searchAnnouncements(
        q,
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

  // 取得公告統計
  async getAnnouncementStats(req, res, next) {
    try {
      const { adminId } = req.params;
      const stats = await announcementService.getAnnouncementStats(adminId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnnouncementController();
