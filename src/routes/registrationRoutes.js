const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const {
  validate,
  validateQuery,
  validateParams,
  schemas,
} = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       required:
 *         - event_id
 *         - administrator_id
 *         - participant_name
 *       properties:
 *         id:
 *           type: integer
 *           description: 報名 ID
 *         event_id:
 *           type: integer
 *           description: 活動 ID
 *         administrator_id:
 *           type: integer
 *           description: 管理員 ID
 *         participant_name:
 *           type: string
 *           maxLength: 100
 *           description: 參與者姓名
 *         remark:
 *           type: string
 *           description: 備註
 *         registration_time:
 *           type: string
 *           format: date-time
 *           description: 報名時間
 *         is_active:
 *           type: boolean
 *           description: 是否有效
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 建立時間
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新時間
 *         event:
 *           $ref: '#/components/schemas/Event'
 *         administrator:
 *           $ref: '#/components/schemas/Administrator'
 */

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: 報名活動
 *     tags: [報名]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - administrator_id
 *               - participant_name
 *             properties:
 *               event_id:
 *                 type: integer
 *                 description: 活動 ID
 *               administrator_id:
 *                 type: integer
 *                 description: 管理員 ID
 *               participant_name:
 *                 type: string
 *                 maxLength: 100
 *                 description: 參與者姓名
 *               remark:
 *                 type: string
 *                 description: 備註
 *     responses:
 *       201:
 *         description: 報名成功
 *       400:
 *         description: 請求資料驗證失敗
 *       404:
 *         description: 活動或管理員不存在
 *       409:
 *         description: 報名已滿或已報名
 */
router.post(
  "/",
  validate(schemas.registration.create),
  registrationController.createRegistration
);

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: 取得活動報名名單
 *     tags: [報名]
 *     parameters:
 *       - in: query
 *         name: event_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 活動 ID
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
 *         description: 成功取得報名名單
 *       400:
 *         description: 請提供活動 ID
 */
router.get(
  "/",
  validateQuery(schemas.registration.query),
  registrationController.getEventRegistrations
);

/**
 * @swagger
 * /api/registrations/search:
 *   get:
 *     summary: 搜尋報名記錄
 *     tags: [報名]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: 搜尋關鍵字
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
 *         description: 搜尋成功
 *       400:
 *         description: 請提供搜尋關鍵字
 */
router.get("/search", registrationController.searchRegistrations);

/**
 * @swagger
 * /api/registrations/{id}:
 *   get:
 *     summary: 取得指定報名記錄
 *     tags: [報名]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 報名 ID
 *     responses:
 *       200:
 *         description: 成功取得報名記錄
 *       404:
 *         description: 報名記錄不存在
 */
router.get(
  "/:id",
  validateParams(schemas.registration.params),
  registrationController.getRegistrationById
);

/**
 * @swagger
 * /api/registrations/{id}/cancel:
 *   post:
 *     summary: 取消報名
 *     tags: [報名]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 報名 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - administrator_id
 *             properties:
 *               administrator_id:
 *                 type: integer
 *                 description: 管理員 ID
 *     responses:
 *       200:
 *         description: 報名取消成功
 *       404:
 *         description: 報名記錄不存在或無權限取消
 */
router.post(
  "/:id/cancel",
  validateParams(schemas.registration.params),
  registrationController.cancelRegistration
);

/**
 * @swagger
 * /api/registrations/administrator/{administratorId}:
 *   get:
 *     summary: 取得管理員的報名記錄
 *     tags: [報名]
 *     parameters:
 *       - in: path
 *         name: administratorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 管理員 ID
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
 *         description: 成功取得管理員報名記錄
 *       404:
 *         description: 管理員不存在
 */
router.get(
  "/administrator/:administratorId",
  validateParams(schemas.registration.params),
  registrationController.getAdministratorRegistrations
);

/**
 * @swagger
 * /api/registrations/stats/overall:
 *   get:
 *     summary: 取得整體報名統計
 *     tags: [報名]
 *     responses:
 *       200:
 *         description: 成功取得統計資料
 */
router.get("/stats/overall", registrationController.getRegistrationStats);

/**
 * @swagger
 * /api/registrations/stats/event/{eventId}:
 *   get:
 *     summary: 取得特定活動的報名統計
 *     tags: [報名]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 成功取得統計資料
 *       404:
 *         description: 活動不存在
 */
router.get(
  "/stats/event/:eventId",
  validateParams(schemas.event.params),
  registrationController.getEventRegistrationStats
);

/**
 * @swagger
 * /api/registrations/export/event/{eventId}:
 *   get:
 *     summary: 匯出活動報名名單
 *     tags: [報名]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 成功匯出名單
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registration'
 *       404:
 *         description: 活動不存在
 */
router.get(
  "/export/event/:eventId",
  validateParams(schemas.event.params),
  registrationController.exportEventRegistrations
);

module.exports = router;
