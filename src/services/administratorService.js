const { Administrator } = require("../models");
const { AppError } = require("../middlewares/errorMiddleware");

class AdministratorService {
  // 建立管理員
  async createAdministrator(adminData) {
    try {
      const administrator = await Administrator.create(adminData);
      return administrator;
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new AppError("使用者名稱、手機或Line ID已存在", 400);
      }
      throw error;
    }
  }

  // 取得管理員資料
  async getAdministratorById(id) {
    const administrator = await Administrator.findByPk(id);

    if (!administrator) {
      throw new AppError("管理員不存在", 404);
    }

    return administrator;
  }

  // 更新管理員資料
  async updateAdministrator(id, updateData) {
    const administrator = await Administrator.findByPk(id);

    if (!administrator) {
      throw new AppError("管理員不存在", 404);
    }

    await administrator.update(updateData);

    return administrator.reload();
  }

  // 取得所有管理員
  async getAllAdministrators(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Administrator.findAndCountAll({
      where: { is_active: true },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      administrators: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // 軟刪除管理員
  async deleteAdministrator(id) {
    const administrator = await Administrator.findByPk(id);

    if (!administrator) {
      throw new AppError("管理員不存在", 404);
    }

    await administrator.update({ is_active: false });
    return { message: "管理員已成功刪除" };
  }

  // 硬刪除管理員
  async forceDeleteAdministrator(id) {
    const administrator = await Administrator.findByPk(id);

    if (!administrator) {
      throw new AppError("管理員不存在", 404);
    }

    await administrator.destroy();
    return { message: "管理員已永久刪除" };
  }

  // 檢查管理員是否存在
  async checkAdministratorExists(id) {
    const administrator = await Administrator.findByPk(id);
    return !!administrator;
  }

  // 根據Line ID查找管理員
  async getAdministratorByLineId(lineId) {
    const administrator = await Administrator.findOne({
      where: { line_id: lineId, is_active: true },
    });

    if (!administrator) {
      throw new AppError("管理員不存在", 404);
    }

    return administrator;
  }
}

module.exports = new AdministratorService();
