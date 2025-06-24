const eventService = require("../services/eventService");

class EventController {
  // 建立活動
  async createEvent(req, res, next) {
    try {
      const { created_by, ...eventData } = req.body;
      const event = await eventService.createEvent(eventData, created_by);

      res.status(201).json({
        success: true,
        message: "活動建立成功",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得所有活動
  async getAllEvents(req, res, next) {
    try {
      const { page = 1, limit = 10, registration_open } = req.query;
      const result = await eventService.getAllEvents(
        parseInt(page),
        parseInt(limit),
        registration_open === "true"
          ? true
          : registration_open === "false"
          ? false
          : null
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得指定活動
  async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  // 更新活動
  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const { updated_by, ...updateData } = req.body;
      const event = await eventService.updateEvent(id, updateData, updated_by);

      res.status(200).json({
        success: true,
        message: "活動更新成功",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  // 刪除活動
  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      const { deleted_by } = req.body;
      const result = await eventService.deleteEvent(id, deleted_by);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得活動報名名單
  async getEventRegistrations(req, res, next) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const result = await eventService.getEventRegistrations(
        id,
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

  // 搜尋活動
  async searchEvents(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "請提供搜尋關鍵字",
        });
      }

      const result = await eventService.searchEvents(
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

  // 取得活動統計
  async getEventStats(req, res, next) {
    try {
      const stats = await eventService.getEventStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得管理員的活動統計
  async getEventStatsByAdmin(req, res, next) {
    try {
      const { adminId } = req.params;
      const stats = await eventService.getEventStatsByAdmin(adminId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // 檢查活動報名狀態
  async checkEventRegistrationStatus(req, res, next) {
    try {
      const { id } = req.params;
      const status = await eventService.checkEventRegistrationStatus(id);

      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
