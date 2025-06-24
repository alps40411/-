const { Registration, Event, Administrator } = require("../models");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");

class RegistrationService {
  // 建立活動報名
  async createRegistration(registrationData) {
    const { event_id, administrator_id, participant_name } = registrationData;

    // 檢查活動是否存在且有效
    const event = await Event.findByPk(event_id);
    if (!event || !event.is_active) {
      throw new AppError("活動不存在或已停用", 404);
    }

    // 檢查報名是否已截止
    if (event.registration_deadline <= new Date()) {
      throw new AppError("活動報名已截止", 400);
    }

    // 檢查活動是否已開始
    if (event.start_time <= new Date()) {
      throw new AppError("活動已開始，無法報名", 400);
    }

    // 檢查管理員是否存在
    const administrator = await Administrator.findByPk(administrator_id);
    if (!administrator || !administrator.is_active) {
      throw new AppError("管理員不存在或已停用", 404);
    }

    // 檢查是否已報名過
    const existingRegistration = await Registration.findOne({
      where: {
        event_id,
        administrator_id,
        is_active: true,
      },
    });

    if (existingRegistration) {
      throw new AppError("您已經報名過此活動", 400);
    }

    // 檢查是否還有名額（如果活動有人數限制）
    if (event.is_capacity_limited && event.max_participants) {
      const registrationCount = await Registration.count({
        where: {
          event_id,
          is_active: true,
        },
      });

      if (registrationCount >= event.max_participants) {
        throw new AppError("活動名額已滿", 400);
      }
    }

    // 建立報名記錄
    const registration = await Registration.create(registrationData);
    return registration;
  }

  // 取得活動報名名單
  async getEventRegistrations(eventId, page = 1, limit = 10) {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new AppError("活動不存在", 404);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Registration.findAndCountAll({
      where: {
        event_id,
        is_active: true,
      },
      include: [
        {
          model: Administrator,
          as: "administrator",
          attributes: ["id", "username", "phone", "line_id"],
        },
      ],
      limit,
      offset,
      order: [["registration_time", "ASC"]],
    });

    return {
      event: {
        id: event.id,
        title: event.title,
        is_capacity_limited: event.is_capacity_limited,
        max_participants: event.max_participants,
        current_participants: count,
      },
      registrations: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // 取得指定報名記錄
  async getRegistrationById(id) {
    const registration = await Registration.findByPk(id, {
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "start_time", "end_time", "place"],
        },
        {
          model: Administrator,
          as: "administrator",
          attributes: ["id", "username", "phone", "line_id"],
        },
      ],
    });

    if (!registration) {
      throw new AppError("報名記錄不存在", 404);
    }

    return registration;
  }

  // 取消報名
  async cancelRegistration(id, administratorId) {
    const registration = await Registration.findOne({
      where: {
        id,
        administrator_id: administratorId,
        is_active: true,
      },
    });

    if (!registration) {
      throw new AppError("報名記錄不存在或無權限取消", 404);
    }

    // 檢查活動是否已開始
    const event = await Event.findByPk(registration.event_id);
    if (event && event.start_time <= new Date()) {
      throw new AppError("活動已開始，無法取消報名", 400);
    }

    await registration.update({ is_active: false });
    return { message: "報名已成功取消" };
  }

  // 搜尋報名記錄
  async searchRegistrations(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Registration.findAndCountAll({
      where: {
        [Op.or]: [{ participant_name: { [Op.like]: `%${searchTerm}%` } }],
        is_active: true,
      },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "start_time", "end_time", "place"],
        },
        {
          model: Administrator,
          as: "administrator",
          attributes: ["id", "username", "phone", "line_id"],
        },
      ],
      limit,
      offset,
      order: [["registration_time", "DESC"]],
    });

    return {
      registrations: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // 取得報名統計
  async getRegistrationStats() {
    const totalRegistrations = await Registration.count({
      where: { is_active: true },
    });

    const todayRegistrations = await Registration.count({
      where: {
        registration_time: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        is_active: true,
      },
    });

    return {
      total: totalRegistrations,
      today: todayRegistrations,
    };
  }

  // 取得特定活動的報名統計
  async getEventRegistrationStats(eventId) {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new AppError("活動不存在", 404);
    }

    const totalRegistrations = await Registration.count({
      where: {
        event_id: eventId,
        is_active: true,
      },
    });

    return {
      event: {
        id: event.id,
        title: event.title,
        is_capacity_limited: event.is_capacity_limited,
        max_participants: event.max_participants,
      },
      total: totalRegistrations,
      available:
        event.is_capacity_limited && event.max_participants
          ? event.max_participants - totalRegistrations
          : null,
    };
  }

  // 匯出報名名單
  async exportEventRegistrations(eventId) {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new AppError("活動不存在", 404);
    }

    const registrations = await Registration.findAll({
      where: {
        event_id: eventId,
        is_active: true,
      },
      include: [
        {
          model: Administrator,
          as: "administrator",
          attributes: ["id", "username", "phone", "line_id"],
        },
      ],
      order: [["registration_time", "ASC"]],
    });

    return {
      event: {
        id: event.id,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        place: event.place,
      },
      registrations: registrations.map((reg) => ({
        id: reg.id,
        participant_name: reg.participant_name,
        administrator_username: reg.administrator?.username,
        administrator_phone: reg.administrator?.phone,
        administrator_line_id: reg.administrator?.line_id,
        remark: reg.remark,
        registration_time: reg.registration_time,
      })),
    };
  }

  // 取得管理員的報名記錄
  async getAdministratorRegistrations(administratorId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Registration.findAndCountAll({
      where: {
        administrator_id: administratorId,
        is_active: true,
      },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "start_time", "end_time", "place"],
        },
      ],
      limit,
      offset,
      order: [["registration_time", "DESC"]],
    });

    return {
      registrations: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = new RegistrationService();
