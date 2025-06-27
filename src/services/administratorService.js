const { Administrator } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

class AdministratorService {
  /**
   * 創建新管理員
   */
  async createAdministrator(adminData) {
    try {
      const administrator = await Administrator.create(adminData);
      return {
        success: true,
        data: administrator,
        message: "管理員創建成功",
      };
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return {
          success: false,
          message: "用戶名、手機號或Line ID已存在",
          error: error.message,
        };
      }
      return {
        success: false,
        message: "創建管理員失敗",
        error: error.message,
      };
    }
  }

  /**
   * 根據 LINE ID 取得管理員
   */
  async getAdministratorByLineId(lineId) {
    try {
      const administrator = await Administrator.findOne({
        where: { line_id: lineId },
      });
      return administrator;
    } catch (error) {
      console.error("查詢管理員失敗:", error);
      return null;
    }
  }

  /**
   * 獲取所有管理員列表（分頁）
   */
  async getAllAdministrators(page = 1, limit = 10, search = "") {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where[Op.or] = [
          { username: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows: administrators } =
        await Administrator.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["createdAt", "DESC"]],
        });

      return {
        success: true,
        data: {
          administrators,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit),
          },
        },
        message: "獲取管理員列表成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "獲取管理員列表失敗",
        error: error.message,
      };
    }
  }

  /**
   * 刪除管理員
   */
  async deleteAdministrator(id) {
    try {
      const administrator = await Administrator.findByPk(id);
      if (!administrator) {
        return {
          success: false,
          message: "找不到指定的管理員",
        };
      }

      await administrator.destroy({ force: true });
      return {
        success: true,
        message: "管理員刪除成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "刪除管理員失敗",
        error: error.message,
      };
    }
  }
}

module.exports = new AdministratorService();
