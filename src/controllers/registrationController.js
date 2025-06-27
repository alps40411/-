const registrationService = require("../services/registrationService");

class RegistrationController {
  // 建立活動報名
  async createRegistration(req, res, next) {
    try {
      // 從 middleware 中取得管理員 ID
      const administratorId = req.administratorId;

      const registrationData = {
        ...req.body,
        administrator_id: administratorId,
      };

      const registration = await registrationService.createRegistration(
        registrationData
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
      const administratorId = req.administratorId;
      const result = await registrationService.cancelRegistration(
        id,
        administratorId
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
