const express = require("express");
const router = express.Router();
const administratorController = require("../controllers/administratorController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  validate,
  validateParams,
  schemas,
} = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Administrator:
 *       type: object
 *       required:
 *         - username
 *         - phone
 *         - birth
 *         - gender
 *       properties:
 *         username:
 *           type: string
 *           maxLength: 50
 *           description: 使用者名稱
 *         phone:
 *           type: string
 *           maxLength: 20
 *           description: 手機號碼
 *         birth:
 *           type: string
 *           format: date
 *           description: 生日
 *         gender:
 *           type: string
 *           enum: [M, F, O]
 *           description: 性別
 *         is_admin:
 *           type: boolean
 *           default: false
 *           description: 是否為管理員
 *     AdministratorResponse:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 用戶 ID
 *             line_id:
 *               type: string
 *               description: LINE ID
 *             is_admin:
 *               type: boolean
 *               description: 是否為管理員
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: 建立時間
 *         - $ref: '#/components/schemas/Administrator'
 *     RegistrationCheckResponse:
 *       type: object
 *       properties:
 *         is_registered:
 *           type: boolean
 *           description: 是否已註冊
 *         administrator_id:
 *           type: integer
 *           description: 用戶 ID (僅在已註冊時提供)
 *         username:
 *           type: string
 *           description: 使用者名稱 (僅在已註冊時提供)
 *         line_id:
 *           type: string
 *           description: LINE ID
 *         is_admin:
 *           type: boolean
 *           description: 是否為管理員 (僅在已註冊時提供)
 */

/**
 * @swagger
 * /api/administrators:
 *   post:
 *     summary: 建立管理員或會員
 *     tags: [管理員/會員]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Administrator'
 *           example:
 *             username: "新用戶"
 *             phone: "0912345678"
 *             birth: "1990-01-01"
 *             gender: "M"
 *             is_admin: false
 *     responses:
 *       201:
 *         description: 用戶建立成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/AdministratorResponse'
 *           example:
 *             success: true
 *             message: "會員創建成功"
 *             data:
 *               id: 1
 *               username: "新用戶"
 *               phone: "0912345678"
 *               birth: "1990-01-01"
 *               gender: "M"
 *               line_id: "U1234567890abcdef"
 *               is_admin: false
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: 請求資料驗證失敗或用戶已存在
 *       401:
 *         description: 未提供認證 Token
 */
router.post(
  "/",
  validate(schemas.administrator.create),
  administratorController.createAdministrator
);

/**
 * @swagger
 * /api/administrators:
 *   get:
 *     summary: 取得所有管理員/會員
 *     tags: [管理員/會員]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 頁碼
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每頁筆數
 *     responses:
 *       200:
 *         description: 成功取得用戶列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     administrators:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AdministratorResponse'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: 未授權的操作
 */
router.get(
  "/",
  authMiddleware,
  administratorController.getAllAdministrators
);

/**
 * @swagger
 * /api/administrators/{id}:
 *   delete:
 *     summary: 刪除管理員/會員
 *     tags: [管理員/會員]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用戶 ID
 *     responses:
 *       200:
 *         description: 用戶刪除成功
 *       401:
 *         description: 未授權的操作
 *       404:
 *         description: 用戶不存在
 */
router.delete(
  "/:id",
  authMiddleware,
  validateParams(schemas.administrator.params),
  administratorController.deleteAdministrator
);

/**
 * @swagger
 * /api/administrators/check-registration:
 *   get:
 *     summary: 確認 LINE ID 是否已註冊
 *     tags: [管理員/會員]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功確認 LINE ID 註冊狀態
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationCheckResponse'
 *           examples:
 *             registered_admin:
 *               summary: 已註冊的管理員
 *               value:
 *                 is_registered: true
 *                 administrator_id: 1
 *                 username: "管理員"
 *                 line_id: "U1234567890abcdef"
 *                 is_admin: true
 *             registered_member:
 *               summary: 已註冊的會員
 *               value:
 *                 is_registered: true
 *                 administrator_id: 2
 *                 username: "會員"
 *                 line_id: "U0987654321fedcba"
 *                 is_admin: false
 *             not_registered:
 *               summary: 未註冊
 *               value:
 *                 is_registered: false
 *                 line_id: "Uabcdef1234567890"
 *       401:
 *         description: 未提供認證 Token
 */
router.get(
  "/check-registration",
  administratorController.checkLineIdRegistration
);

module.exports = router;
