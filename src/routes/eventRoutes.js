const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  validate,
  validateQuery,
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
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - start_time
 *         - end_time
 *         - registration_deadline
 *       properties:
 *         id:
 *           type: integer
 *           description: 活動 ID
 *         title:
 *           type: string
 *           maxLength: 200
 *           description: 活動標題
 *         description:
 *           type: string
 *           description: 活動描述
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: 活動開始時間
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: 活動結束時間
 *         registration_deadline:
 *           type: string
 *           format: date-time
 *           description: 報名截止時間
 *         location:
 *           type: string
 *           maxLength: 200
 *           description: 活動地點
 *         is_capacity_limited:
 *           type: boolean
 *           description: 是否限制參與人數
 *         max_participants:
 *           type: integer
 *           minimum: 1
 *           description: 最大參與人數
 *         administrator_id:
 *           type: integer
 *           description: 建立活動的管理員 ID
 *         status:
 *           type: string
 *           enum: [upcoming, ongoing, completed, cancelled]
 *           description: 活動狀態
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 建立時間
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新時間
 *         creator:
 *           $ref: '#/components/schemas/Administrator'
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: 取得所有有效活動
 *     tags: [活動]
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
 *         description: 成功取得活動列表
 *       401:
 *         description: 未授權的操作
 */
router.get(
  "/",
  authMiddleware,
  validateQuery(schemas.event.query),
  eventController.getAllEvents
);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: 建立活動
 *     tags: [活動]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: 活動建立成功
 *       400:
 *         description: 請求資料驗證失敗
 *       401:
 *         description: 未授權的操作
 */
router.post(
  "/",
  authMiddleware,
  validate(schemas.event.create),
  eventController.createEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: 更新活動
 *     tags: [活動]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 活動 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: 活動更新成功
 *       400:
 *         description: 請求資料驗證失敗
 *       401:
 *         description: 未授權的操作
 *       404:
 *         description: 活動不存在
 */
router.put(
  "/:id",
  authMiddleware,
  validateParams(schemas.event.params),
  validate(schemas.event.update),
  eventController.updateEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: 刪除活動
 *     tags: [活動]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 活動刪除成功
 *       401:
 *         description: 未授權的操作
 *       404:
 *         description: 活動不存在
 */
router.delete(
  "/:id",
  authMiddleware,
  validateParams(schemas.event.params),
  eventController.deleteEvent
);

module.exports = router;
