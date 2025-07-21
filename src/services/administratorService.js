const { Administrator } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const { convertTimeFieldsToTaipei } = require("../utils/dateHelper");

class AdministratorService {
  /**
   * 創建新管理員或會員
   */
  async createAdministrator(adminData) {
    try {
      const administrator = await Administrator.create(adminData);
      const userType = administrator.is_admin ? "管理員" : "會員";
      return {
        success: true,
        data: convertTimeFieldsToTaipei(administrator.toJSON()),
        message: `${userType}創建成功`,
      };
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return {
          success: false,
          message: "用戶名或手機號已存在",
          error: error.message,
        };
      }
      return {
        success: false,
        message: "創建用戶失敗",
        error: error.message,
      };
    }
  }

  /**
   * 獲取所有管理員/會員列表（分頁）
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
          order: [["createdAt", "asc"]],
        });

      return {
        success: true,
        data: {
          administrators: convertTimeFieldsToTaipei(
            administrators.map((administrator) => administrator.toJSON())
          ),
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit),
          },
        },
        message: "獲取用戶列表成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "獲取用戶列表失敗",
        error: error.message,
      };
    }
  }

  /**
   * 刪除管理員/會員
   */
  async deleteAdministrator(id) {
    try {
      const administrator = await Administrator.findByPk(id);
      if (!administrator) {
        return {
          success: false,
          message: "找不到指定的用戶",
        };
      }

      await administrator.destroy({ force: true });
      return {
        success: true,
        message: "用戶刪除成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "刪除用戶失敗",
        error: error.message,
      };
    }
  }

  /**
   * 根據 LINE ID 取得管理員/會員
   */
  async getAdministratorByLineId(lineId) {
    try {
      const administrator = await Administrator.findOne({
        where: { line_id: lineId },
      });
      return administrator;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AdministratorService();
