const eventService = require("../services/eventService");

class EventController {
  // 建立活動
  async createEvent(req, res, next) {
    try {
      // 從 middleware 中取得管理員 ID
      const administratorId = req.administratorId;
      const result = await eventService.createEvent(req.body, administratorId);

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

  // 取得所有活動
  async getAllEvents(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await eventService.getAllEvents(
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

  // 更新活動
  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const administratorId = req.administratorId;
      const result = await eventService.updateEvent(
        id,
        req.body,
        administratorId
      );

      if (!result.success) {
        // 根據錯誤訊息判斷適當的狀態碼
        if (result.message.includes("找不到")) {
          return res.status(404).json(result);
        } else if (result.message.includes("沒有權限")) {
          return res.status(403).json(result);
        } else {
          return res.status(400).json(result);
        }
      }

      res.status(200).json({
        success: true,
        message: "活動更新成功",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 刪除活動
  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      const administratorId = req.administratorId;
      const result = await eventService.deleteEvent(id, administratorId);

      if (!result.success) {
        // 根據錯誤訊息判斷適當的狀態碼
        if (result.message.includes("不存在")) {
          return res.status(404).json(result);
        } else if (result.message.includes("沒有權限")) {
          return res.status(403).json(result);
        } else {
          return res.status(400).json(result);
        }
      }

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得單一活動報名資訊
  async getEventRegistrationInfo(req, res, next) {
    try {
      const { id } = req.params;
      const result = await eventService.getEventRegistrationInfo(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
