const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
require("dotenv").config();

// 引入中介軟體
const {
  errorMiddleware,
  notFoundMiddleware,
} = require("./middlewares/errorMiddleware");

// 引入路由
const administratorRoutes = require("./routes/administratorRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

// 安全中介軟體
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          process.env.API_URL || "http://localhost:3000",
          "http://join-me.nuera-tec.com",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS 設定
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 限制每個 IP 15 分鐘內最多 100 個請求
  message: {
    success: false,
    message: "請求過於頻繁，請稍後再試",
  },
});
app.use("/api/", limiter);

// 解析 JSON 請求體
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 健康檢查端點
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "服務正常運行",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API 文檔端點
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "扶輪社活動管理 API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      swagger: "GET /api-docs",
      administrators: {
        create: "POST /api/administrators",
        list: "GET /api/administrators",
        detail: "GET /api/administrators/:id",
        update: "PUT /api/administrators/:id",
        delete: "DELETE /api/administrators/:id",
      },
      announcements: {
        list: "GET /api/announcements",
        search: "GET /api/announcements/search",
        create: "POST /api/announcements",
        detail: "GET /api/announcements/:id",
        update: "PUT /api/announcements/:id",
        delete: "DELETE /api/announcements/:id",
        stats: "GET /api/announcements/stats/admin/:adminId",
      },
      events: {
        list: "GET /api/events",
        search: "GET /api/events/search",
        create: "POST /api/events",
        detail: "GET /api/events/:id",
        update: "PUT /api/events/:id",
        delete: "DELETE /api/events/:id",
        registrations: "GET /api/events/:id/registrations",
        registrationStatus: "GET /api/events/:id/registration-status",
        stats: "GET /api/events/stats/overall",
        statsByAdmin: "GET /api/events/stats/admin/:adminId",
      },
      registrations: {
        create: "POST /api/registrations",
        list: "GET /api/registrations",
        search: "GET /api/registrations/search",
        detail: "GET /api/registrations/:id",
        cancel: "POST /api/registrations/:id/cancel",
        byAdministrator:
          "GET /api/registrations/administrator/:administratorId",
        stats: "GET /api/registrations/stats/overall",
        eventStats: "GET /api/registrations/stats/event/:eventId",
        export: "GET /api/registrations/export/event/:eventId",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// Swagger 配置
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "扶輪社活動管理 API",
    version: "1.0.0",
    description: "活動與公告管理後端 API 文檔",
    contact: {
      name: "API 支援",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: process.env.API_URL || "http://localhost:3000",
      description: "開發環境",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Token 用於管理員權限驗證",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // 路徑到包含註釋的路由檔案
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "扶輪社活動管理 API 文檔",
  })
);

// API 路由
app.use("/api/administrators", administratorRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// 404 錯誤處理
app.use(notFoundMiddleware);

// 全域錯誤處理
app.use(errorMiddleware);

module.exports = app;
