const administratorService = require("../services/administratorService");

class AdministratorController {
  // 建立管理員
  async createAdministrator(req, res, next) {
    try {
      const result = await administratorService.createAdministrator(
        req.body
      );

      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // 取得所有管理員
  async getAllAdministrators(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await administratorService.getAllAdministrators(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // 刪除管理員
  async deleteAdministrator(req, res, next) {
    try {
      const { id } = req.params;

      let result;
      result = await administratorService.deleteAdministrator(id);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdministratorController();
