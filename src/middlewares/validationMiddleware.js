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
  // 管理員/會員相關
  administrator: {
    create: Joi.object({
      username: Joi.string().min(1).max(50).required(),
      phone: Joi.string().min(1).max(20).required(),
      birth: Joi.date().required(),
      gender: Joi.string().valid("M", "F", "O").default("M"),
      is_admin: Joi.boolean().default(false),
    }),

    update: Joi.object({
      username: Joi.string().min(1).max(50),
      phone: Joi.string().min(1).max(20),
      birth: Joi.date(),
      gender: Joi.string().valid("M", "F", "O"),
    }),

    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  },

  // 公告相關
  announcement: {
    create: Joi.object({
      title: Joi.string().min(1).max(255).required(),
      content: Joi.string().min(1).required(),
    }),

    update: Joi.object({
      title: Joi.string().min(1).max(255),
      content: Joi.string().min(1),
    }),

    query: Joi.object({
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
      title: Joi.string().min(1).max(200).required(),
      description: Joi.string().allow("").optional(),
      start_time: Joi.date().required(),
      end_time: Joi.date().greater(Joi.ref("start_time")).required(),
      location: Joi.string().allow("").max(200).optional(),
      is_capacity_limited: Joi.boolean().default(true),
      max_participants: Joi.alternatives().conditional("is_capacity_limited", {
        is: true,
        then: Joi.number().integer().min(1).required(),
        otherwise: Joi.forbidden(),
      }),
      registration_deadline: Joi.date().less(Joi.ref("start_time")).required(),
    }),

    update: Joi.object({
      title: Joi.string().min(1).max(200),
      description: Joi.string().allow(""),
      start_time: Joi.date(),
      end_time: Joi.date().greater(Joi.ref("start_time")),
      location: Joi.string().allow("").max(200),
      is_capacity_limited: Joi.boolean(),
      max_participants: Joi.alternatives().conditional("is_capacity_limited", {
        is: true,
        then: Joi.number().integer().min(1),
        otherwise: Joi.forbidden(),
      }),
      registration_deadline: Joi.date().less(Joi.ref("start_time")),
    }),

    query: Joi.object({
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
      participant_name: Joi.string().min(1).max(100).required(),
      remark: Joi.string().optional(),
    }),

    cancel: Joi.object({}),

    query: Joi.object({
      event_id: Joi.number().integer().positive().required(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    }),

    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  },
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
  schemas,
};
