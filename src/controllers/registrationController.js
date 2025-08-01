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

      const result = await registrationService.createRegistration(
        registrationData
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

  // 取得活動報名名單
  async getEventRegistrations(req, res, next) {
    try {
      const { event_id, page = 1, limit = 10 } = req.query;
      const result = await registrationService.getEventRegistrations(
        event_id,
        parseInt(page),
        parseInt(limit)
      );

      if (!result.success) {
        return res.status(400).json({
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

  // 取消報名
  async cancelRegistration(req, res, next) {
    try {
      const { id } = req.params;
      const administratorId = req.administratorId;
      const result = await registrationService.cancelRegistration(
        id,
        administratorId
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }

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
