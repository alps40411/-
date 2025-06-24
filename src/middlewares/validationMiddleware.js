const Joi = require("joi");

// 通用驗證函數
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "請求資料驗證失敗",
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};

// 查詢參數驗證
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "查詢參數驗證失敗",
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};

// 路徑參數驗證
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "路徑參數驗證失敗",
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};

// 驗證 Schema 定義
const schemas = {
  // 管理員相關
  administrator: {
    create: Joi.object({
      username: Joi.string().min(1).max(50).required(),
      phone: Joi.string().min(1).max(20).required(),
      birth: Joi.date().required(),
      gender: Joi.string().valid("MALE", "FEMALE", "OTHER").default("MALE"),
      line_id: Joi.string().min(1).max(50).required(),
    }),

    update: Joi.object({
      username: Joi.string().min(1).max(50),
      phone: Joi.string().min(1).max(20),
      birth: Joi.date(),
      gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
      line_id: Joi.string().min(1).max(50),
    }),

    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  },

  // 公告相關
  announcement: {
    create: Joi.object({
      title: Joi.string().min(1).max(255).required(),
      description: Joi.string().min(1).required(),
    }),

    update: Joi.object({
      title: Joi.string().min(1).max(255),
      description: Joi.string().min(1),
    }),

    query: Joi.object({
      created_by: Joi.number().integer().positive(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    }),

    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  },

  // 活動相關
  event: {
    create: Joi.object({
      title: Joi.string().min(1).max(255).required(),
      description: Joi.string().min(1).required(),
      start_time: Joi.date().greater("now").required(),
      end_time: Joi.date().greater(Joi.ref("start_time")).required(),
      registration_deadline: Joi.date().less(Joi.ref("start_time")).required(),
      place: Joi.string().min(1).max(500).required(),
      is_capacity_limited: Joi.boolean().default(false),
      max_participants: Joi.when("is_capacity_limited", {
        is: true,
        then: Joi.number().integer().min(1).required(),
        otherwise: Joi.number().integer().min(1).optional(),
      }),
    }),

    update: Joi.object({
      title: Joi.string().min(1).max(255),
      description: Joi.string().min(1),
      start_time: Joi.date().greater("now"),
      end_time: Joi.date().greater(Joi.ref("start_time")),
      registration_deadline: Joi.date().less(Joi.ref("start_time")),
      place: Joi.string().min(1).max(500),
      is_capacity_limited: Joi.boolean(),
      max_participants: Joi.when("is_capacity_limited", {
        is: true,
        then: Joi.number().integer().min(1).required(),
        otherwise: Joi.number().integer().min(1).optional(),
      }),
    }),

    query: Joi.object({
      registration_open: Joi.boolean(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    }),

    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  },

  // 報名相關
  registration: {
    create: Joi.object({
      event_id: Joi.number().integer().positive().required(),
      administrator_id: Joi.number().integer().positive().required(),
      participant_name: Joi.string().min(1).max(100).required(),
      remark: Joi.string().optional(),
    }),

    query: Joi.object({
      event_id: Joi.number().integer().positive().required(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    }),

    params: Joi.object({
      id: Joi.number().integer().positive().required(),
      administratorId: Joi.number().integer().positive().required(),
    }),
  },
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
  schemas,
};
