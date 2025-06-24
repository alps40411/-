const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
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
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - start_time
 *         - end_time
 *         - registration_deadline
 *         - place
 *       properties:
 *         id:
 *           type: integer
 *           description: 活動 ID
 *         title:
 *           type: string
 *           maxLength: 255
 *           description: 活動標題
 *         description:
 *           type: string
 *           description: 活動內容
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: 開始時間
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: 結束時間
 *         registration_deadline:
 *           type: string
 *           format: date-time
 *           description: 報名截止時間
 *         place:
 *           type: string
 *           maxLength: 500
 *           description: 活動地點
 *         is_capacity_limited:
 *           type: boolean
 *           description: 是否有人數限制
 *         max_participants:
 *           type: integer
 *           minimum: 1
 *           description: 最大參與人數
 *         created_by:
 *           type: integer
 *           description: 建立者 ID
 *         is_active:
 *           type: boolean
 *           description: 是否啟用
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
 *       - in: query
 *         name: registration_open
 *         schema:
 *           type: boolean
 *         description: 是否只顯示報名尚未截止的活動
 *     responses:
 *       200:
 *         description: 成功取得活動列表
 */
router.get(
  "/",
  validateQuery(schemas.event.query),
  eventController.getAllEvents
);

/**
 * @swagger
 * /api/events/search:
 *   get:
 *     summary: 搜尋活動
 *     tags: [活動]
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
router.get("/search", eventController.searchEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: 取得指定活動
 *     tags: [活動]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 成功取得活動
 *       404:
 *         description: 活動不存在
 */
router.get(
  "/:id",
  validateParams(schemas.event.params),
  eventController.getEventById
);

/**
 * @swagger
 * /api/events/{id}/registration-status:
 *   get:
 *     summary: 檢查活動報名狀態
 *     tags: [活動]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 成功取得報名狀態
 *       404:
 *         description: 活動不存在
 */
router.get(
  "/:id/registration-status",
  validateParams(schemas.event.params),
  eventController.checkEventRegistrationStatus
);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: 建立活動
 *     tags: [活動]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - start_time
 *               - end_time
 *               - registration_deadline
 *               - place
 *               - created_by
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 description: 活動標題
 *               description:
 *                 type: string
 *                 description: 活動內容
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: 開始時間
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: 結束時間
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 報名截止時間
 *               place:
 *                 type: string
 *                 maxLength: 500
 *                 description: 活動地點
 *               is_capacity_limited:
 *                 type: boolean
 *                 description: 是否有人數限制
 *               max_participants:
 *                 type: integer
 *                 minimum: 1
 *                 description: 最大參與人數
 *               created_by:
 *                 type: integer
 *                 description: 建立者 ID
 *     responses:
 *       201:
 *         description: 活動建立成功
 *       400:
 *         description: 請求資料驗證失敗
 */
router.post("/", validate(schemas.event.create), eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: 更新活動
 *     tags: [活動]
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 description: 活動標題
 *               description:
 *                 type: string
 *                 description: 活動內容
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: 開始時間
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: 結束時間
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 報名截止時間
 *               place:
 *                 type: string
 *                 maxLength: 500
 *                 description: 活動地點
 *               is_capacity_limited:
 *                 type: boolean
 *                 description: 是否有人數限制
 *               max_participants:
 *                 type: integer
 *                 minimum: 1
 *                 description: 最大參與人數
 *               updated_by:
 *                 type: integer
 *                 description: 更新者 ID
 *     responses:
 *       200:
 *         description: 活動更新成功
 *       400:
 *         description: 請求資料驗證失敗
 *       403:
 *         description: 沒有權限更新此活動
 *       404:
 *         description: 活動不存在
 */
router.put(
  "/:id",
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
 *             type: object
 *             required:
 *               - deleted_by
 *             properties:
 *               deleted_by:
 *                 type: integer
 *                 description: 刪除者 ID
 *     responses:
 *       200:
 *         description: 活動刪除成功
 *       403:
 *         description: 沒有權限刪除此活動
 *       404:
 *         description: 活動不存在
 */
router.delete(
  "/:id",
  validateParams(schemas.event.params),
  eventController.deleteEvent
);

/**
 * @swagger
 * /api/events/{id}/registrations:
 *   get:
 *     summary: 取得活動報名名單
 *     tags: [活動]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 成功取得報名名單
 *       404:
 *         description: 活動不存在
 */
router.get(
  "/:id/registrations",
  validateParams(schemas.event.params),
  eventController.getEventRegistrations
);

/**
 * @swagger
 * /api/events/stats/overall:
 *   get:
 *     summary: 取得整體活動統計
 *     tags: [活動]
 *     responses:
 *       200:
 *         description: 成功取得統計資料
 */
router.get("/stats/overall", eventController.getEventStats);

/**
 * @swagger
 * /api/events/stats/admin/{adminId}:
 *   get:
 *     summary: 取得指定管理員的活動統計
 *     tags: [活動]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 管理員 ID
 *     responses:
 *       200:
 *         description: 成功取得統計資料
 */
router.get("/stats/admin/:adminId", eventController.getEventStatsByAdmin);

module.exports = router;
