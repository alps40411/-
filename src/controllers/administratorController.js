const administratorService = require("../services/administratorService");

class AdministratorController {
  // 建立管理員
  async createAdministrator(req, res, next) {
    try {
      // 從 LINE 認證中取得 line_id
      const lineId = req.administrator?.line_id;

      if (!lineId) {
        return res.status(400).json({
          success: false,
          message: "無法取得 LINE USER ID",
        });
      }

      // 檢查是否已經存在相同 line_id 的管理員
      const existingAdmin = await administratorService.getAdministratorByLineId(
        lineId
      );
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "此 LINE 帳號已經註冊為管理員",
        });
      }

      // 將 line_id 加入請求資料中
      const adminData = {
        ...req.body,
        line_id: lineId,
      };

      const result = await administratorService.createAdministrator(adminData);

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
