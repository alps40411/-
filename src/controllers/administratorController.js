const administratorService = require("../services/administratorService");

class AdministratorController {
  // 建立管理員
  async createAdministrator(req, res, next) {
    try {
      // 從 Authorization Header 獲取 LINE ID
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "未提供認證 Token",
        });
      }

      const line_id = authHeader.split(" ")[1];

      // 檢查是否已經存在相同 line_id 的管理員
      const existingAdmin = await administratorService.getAdministratorByLineId(
        line_id
      );
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "此 LINE 帳號已經註冊為管理員",
        });
      }

      // 將 line_id 加入到請求體中
      const administratorData = {
        ...req.body,
        line_id: line_id,
      };

      const result = await administratorService.createAdministrator(
        administratorData
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
          error: result.error,
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

  // 管理員登入
  async login(line_id) {
    try {
      const result = await administratorService.login(line_id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 確認 LINE ID 是否已註冊
  async checkLineIdRegistration(req, res, next) {
    try {
      // 從 Authorization Header 獲取 LINE ID
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "未提供認證 Token",
        });
      }

      const line_id = authHeader.split(" ")[1];

      // 檢查是否已經存在相同 line_id 的管理員
      const existingAdmin = await administratorService.getAdministratorByLineId(
        line_id
      );

      if (existingAdmin) {
        res.status(200).json({
          is_registered: true,
          administrator_id: existingAdmin.id,
          username: existingAdmin.username,
          line_id: existingAdmin.line_id,
        });
      } else {
        res.status(200).json({
          is_registered: false,
          line_id: line_id,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdministratorController();
