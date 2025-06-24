const registrationService = require("../services/registrationService");

class RegistrationController {
  // 建立活動報名
  async createRegistration(req, res, next) {
    try {
      const registration = await registrationService.createRegistration(
        req.body
      );

      res.status(201).json({
        success: true,
        message: "活動報名成功",
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得活動報名名單
  async getEventRegistrations(req, res, next) {
    try {
      const { event_id, page = 1, limit = 10 } = req.query;
      const result = await registrationService.getEventRegistrations(
        event_id,
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

  // 取得指定報名記錄
  async getRegistrationById(req, res, next) {
    try {
      const { id } = req.params;
      const registration = await registrationService.getRegistrationById(id);

      res.status(200).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取消報名
  async cancelRegistration(req, res, next) {
    try {
      const { id } = req.params;
      const { administrator_id } = req.body;
      const result = await registrationService.cancelRegistration(
        id,
        administrator_id
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // 搜尋報名記錄
  async searchRegistrations(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "請提供搜尋關鍵字",
        });
      }

      const result = await registrationService.searchRegistrations(
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

  // 取得報名統計
  async getRegistrationStats(req, res, next) {
    try {
      const stats = await registrationService.getRegistrationStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得特定活動的報名統計
  async getEventRegistrationStats(req, res, next) {
    try {
      const { eventId } = req.params;
      const stats = await registrationService.getEventRegistrationStats(
        eventId
      );

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // 匯出活動報名名單
  async exportEventRegistrations(req, res, next) {
    try {
      const { eventId } = req.params;
      const data = await registrationService.exportEventRegistrations(eventId);

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得管理員的報名記錄
  async getAdministratorRegistrations(req, res, next) {
    try {
      const { administratorId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const result = await registrationService.getAdministratorRegistrations(
        administratorId,
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
}

module.exports = new RegistrationController();
