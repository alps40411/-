const { Announcement, Administrator } = require("../models");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");

class AnnouncementService {
  // 建立公告
  async createAnnouncement(announcementData, createdBy) {
    const announcement = await Announcement.create({
      ...announcementData,
      created_by: createdBy,
    });

    return announcement;
  }

  // 取得所有有效公告
  async getAllAnnouncements(page = 1, limit = 10, createdBy = null) {
    const offset = (page - 1) * limit;
    const where = { is_active: true };

    if (createdBy) {
      where.created_by = createdBy;
    }

    const { count, rows } = await Announcement.findAndCountAll({
      where,
      include: [
        {
          model: Administrator,
          as: "creator",
          attributes: ["id", "username", "phone"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      announcements: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // 取得指定公告
  async getAnnouncementById(id) {
    const announcement = await Announcement.findOne({
      where: { id, is_active: true },
      include: [
        {
          model: Administrator,
          as: "creator",
          attributes: ["id", "username", "phone"],
        },
      ],
    });

    if (!announcement) {
      throw new AppError("公告不存在", 404);
    }

    return announcement;
  }

  // 更新公告
  async updateAnnouncement(id, updateData, updatedBy) {
    const announcement = await Announcement.findOne({
      where: { id, is_active: true },
    });

    if (!announcement) {
      throw new AppError("公告不存在", 404);
    }

    // 檢查權限（只有建立者或管理員可以更新）
    if (announcement.created_by !== updatedBy) {
      throw new AppError("沒有權限更新此公告", 403);
    }

    await announcement.update(updateData);
    return announcement.reload({
      include: [
        {
          model: Administrator,
          as: "creator",
          attributes: ["id", "username", "phone"],
        },
      ],
    });
  }

  // 軟刪除公告
  async deleteAnnouncement(id, deletedBy) {
    const announcement = await Announcement.findOne({
      where: { id, is_active: true },
    });

    if (!announcement) {
      throw new AppError("公告不存在", 404);
    }

    // 檢查權限（只有建立者或管理員可以刪除）
    if (announcement.created_by !== deletedBy) {
      throw new AppError("沒有權限刪除此公告", 403);
    }

    await announcement.update({ is_active: false });
    return { message: "公告已成功刪除" };
  }

  // 硬刪除公告
  async forceDeleteAnnouncement(id, deletedBy) {
    const announcement = await Announcement.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new AppError("公告不存在", 404);
    }

    // 檢查權限（只有建立者或管理員可以硬刪除）
    if (announcement.created_by !== deletedBy) {
      throw new AppError("沒有權限永久刪除此公告", 403);
    }

    await announcement.destroy();
    return { message: "公告已永久刪除" };
  }

  // 搜尋公告
  async searchAnnouncements(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Announcement.findAndCountAll({
      where: {
        is_active: true,
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      include: [
        {
          model: Administrator,
          as: "creator",
          attributes: ["id", "username", "phone"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      announcements: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // 取得特定管理員的公告統計
  async getAnnouncementStats(adminId) {
    const totalAnnouncements = await Announcement.count({
      where: { created_by: adminId },
    });

    const activeAnnouncements = await Announcement.count({
      where: { created_by: adminId, is_active: true },
    });

    const recentAnnouncements = await Announcement.count({
      where: {
        created_by: adminId,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 最近30天
        },
      },
    });

    return {
      total: totalAnnouncements,
      active: activeAnnouncements,
      recent: recentAnnouncements,
    };
  }
}

module.exports = new AnnouncementService();
