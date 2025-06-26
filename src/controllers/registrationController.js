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
}

module.exports = new RegistrationController();
