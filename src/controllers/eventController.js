const eventService = require("../services/eventService");

class EventController {
  // 建立活動
  async createEvent(req, res, next) {
    try {
      const { administrator_id, ...eventData } = req.body;
      
      const finalEventData = {
        ...eventData,
        administrator_id: administrator_id,
      };
      
      const event = await eventService.createEvent(finalEventData);

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
      const { ...updateData } = req.body;
      const event = await eventService.updateEvent(id, updateData);

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
      const result = await eventService.deleteEvent(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
