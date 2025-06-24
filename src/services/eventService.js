const { Event, Administrator, Registration } = require("../models");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const moment = require("moment");

class EventService {
  // 建立活動
  async createEvent(eventData, createdBy) {
    const event = await Event.create({
      ...eventData,
      created_by: createdBy,
    });

    return event;
  }

  // 取得所有有效活動
  async getAllEvents(page = 1, limit = 10, registrationOpen = null) {
    const offset = (page - 1) * limit;
    const where = { is_active: true };

    if (registrationOpen === true) {
      where.registration_deadline = {
        [Op.gt]: new Date(),
      };
    } else if (registrationOpen === false) {
      where.registration_deadline = {
        [Op.lte]: new Date(),
      };
    }

    const { count, rows } = await Event.findAndCountAll({
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
      order: [["start_time", "ASC"]],
    });

    return {
      events: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // 取得指定活動
  async getEventById(id) {
    const event = await Event.findOne({
      where: { id, is_active: true },
      include: [
        {
          model: Administrator,
          as: "creator",
          attributes: ["id", "username", "phone"],
        },
      ],
    });

    if (!event) {
      throw new AppError("活動不存在", 404);
    }

    return event;
  }

  // 更新活動
  async updateEvent(id, updateData, updatedBy) {
    const event = await Event.findOne({
      where: { id, is_active: true },
    });

    if (!event) {
      throw new AppError("活動不存在", 404);
    }

    // 檢查權限（只有建立者或管理員可以更新）
    if (event.created_by !== updatedBy) {
      throw new AppError("沒有權限更新此活動", 403);
    }

    await event.update(updateData);
    return event.reload({
      include: [
        {
          model: Administrator,
          as: "creator",
          attributes: ["id", "username", "phone"],
        },
      ],
    });
  }

  // 軟刪除活動
  async deleteEvent(id, deletedBy) {
    const event = await Event.findOne({
      where: { id, is_active: true },
    });

    if (!event) {
      throw new AppError("活動不存在", 404);
    }

    // 檢查權限（只有建立者或管理員可以刪除）
    if (event.created_by !== deletedBy) {
      throw new AppError("沒有權限刪除此活動", 403);
    }

    await event.update({ is_active: false });
    return { message: "活動已成功刪除" };
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

  // 搜尋活動
  async searchEvents(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      where: {
        is_active: true,
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
          { place: { [Op.like]: `%${searchTerm}%` } },
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
      order: [["start_time", "ASC"]],
    });

    return {
      events: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // 取得活動統計
  async getEventStats() {
    const totalEvents = await Event.count({
      where: { is_active: true },
    });

    const upcomingEvents = await Event.count({
      where: {
        is_active: true,
        start_time: {
          [Op.gt]: new Date(),
        },
      },
    });

    const ongoingEvents = await Event.count({
      where: {
        is_active: true,
        start_time: {
          [Op.lte]: new Date(),
        },
        end_time: {
          [Op.gt]: new Date(),
        },
      },
    });

    const openRegistrationEvents = await Event.count({
      where: {
        is_active: true,
        registration_deadline: {
          [Op.gt]: new Date(),
        },
      },
    });

    return {
      total: totalEvents,
      upcoming: upcomingEvents,
      ongoing: ongoingEvents,
      openRegistration: openRegistrationEvents,
    };
  }

  // 取得特定管理員的活動統計
  async getEventStatsByAdmin(adminId) {
    const totalEvents = await Event.count({
      where: { created_by: adminId },
    });

    const activeEvents = await Event.count({
      where: { created_by: adminId, is_active: true },
    });

    const upcomingEvents = await Event.count({
      where: {
        created_by: adminId,
        is_active: true,
        start_time: {
          [Op.gt]: new Date(),
        },
      },
    });

    return {
      total: totalEvents,
      active: activeEvents,
      upcoming: upcomingEvents,
    };
  }

  // 檢查活動是否可以報名
  async checkEventRegistrationStatus(eventId) {
    const event = await Event.findByPk(eventId);

    if (!event || !event.is_active) {
      throw new AppError("活動不存在或已停用", 404);
    }

    const now = new Date();
    const isRegistrationOpen = event.registration_deadline > now;
    const isEventStarted = event.start_time <= now;
    const isEventEnded = event.end_time <= now;

    // 取得報名人數
    const registrationCount = await Registration.count({
      where: {
        event_id: eventId,
        is_active: true,
      },
    });

    const isFull =
      event.is_capacity_limited && event.max_participants
        ? registrationCount >= event.max_participants
        : false;

    return {
      canRegister: isRegistrationOpen && !isEventStarted && !isFull,
      isRegistrationOpen,
      isEventStarted,
      isEventEnded,
      isFull,
      currentParticipants: registrationCount,
      maxParticipants: event.is_capacity_limited
        ? event.max_participants
        : null,
      isCapacityLimited: event.is_capacity_limited,
    };
  }
}

module.exports = new EventService();
