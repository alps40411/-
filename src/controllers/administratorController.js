const administratorService = require("../services/administratorService");

class AdministratorController {
  // 建立管理員
  async createAdministrator(req, res, next) {
    try {
      const administrator = await administratorService.createAdministrator(
        req.body
      );

      res.status(201).json({
        success: true,
        message: "管理員建立成功",
        data: {
          id: administrator.id,
          username: administrator.username,
          phone: administrator.phone,
          birth: administrator.birth,
          gender: administrator.gender,
          line_id: administrator.line_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // 取得管理員資料
  async getAdministratorById(req, res, next) {
    try {
      const { id } = req.params;
      const administrator = await administratorService.getAdministratorById(id);

      res.status(200).json({
        success: true,
        data: administrator,
      });
    } catch (error) {
      next(error);
    }
  }

  // 更新管理員資料
  async updateAdministrator(req, res, next) {
    try {
      const { id } = req.params;
      const administrator = await administratorService.updateAdministrator(
        id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "管理員資料更新成功",
        data: administrator,
      });
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
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 刪除管理員
  async deleteAdministrator(req, res, next) {
    try {
      const { id } = req.params;
      const { force } = req.query;

      let result;
      if (force === "true") {
        result = await administratorService.forceDeleteAdministrator(id);
      } else {
        result = await administratorService.deleteAdministrator(id);
      }

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // 根據Line ID取得管理員資料
  async getAdministratorByLineId(req, res, next) {
    try {
      const { lineId } = req.params;
      const administrator = await administratorService.getAdministratorByLineId(
        lineId
      );

      res.status(200).json({
        success: true,
        data: administrator,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdministratorController();
