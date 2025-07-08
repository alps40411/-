const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
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
 *     description: 為活動報名，一個人可以為多個不同的人報名同一活動。系統會檢查是否已為同一參與者重複報名。
 *     tags: [報名]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - participant_name
 *             properties:
 *               event_id:
 *                 type: integer
 *                 description: 活動 ID
 *               participant_name:
 *                 type: string
 *                 maxLength: 100
 *                 description: 參與者姓名
 *               remark:
 *                 type: string
 *                 description: 備註
 *           example:
 *             event_id: 1
 *             participant_name: "張三"
 *             remark: "素食者"
 *     responses:
 *       201:
 *         description: 報名成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Registration'
 *                 message:
 *                   type: string
 *           example:
 *             success: true
 *             data:
 *               id: 1
 *               event_id: 1
 *               administrator_id: 1
 *               participant_name: "張三"
 *               remark: "素食者"
 *               registration_time: "2024-01-01T10:00:00.000Z"
 *             message: "報名成功"
 *       400:
 *         description: 請求資料驗證失敗
 *       401:
 *         description: 未授權的操作
 *       404:
 *         description: 活動不存在
 *       409:
 *         description: 報名已滿或已為此參與者報名
 */
router.post(
  "/",
  authMiddleware,
  validate(schemas.registration.create),
  registrationController.createRegistration
);

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: 取得活動報名名單
 *     tags: [報名]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: 未授權的操作
 */
router.get(
  "/",
  authMiddleware,
  validateQuery(schemas.registration.query),
  registrationController.getEventRegistrations
);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: 刪除報名記錄
 *     tags: [報名]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 報名 ID
 *     responses:
 *       200:
 *         description: 報名記錄刪除成功
 *       401:
 *         description: 未授權的操作
 *       404:
 *         description: 報名記錄不存在
 */
router.delete(
  "/:id",
  authMiddleware,
  validateParams(schemas.registration.params),
  validate(schemas.registration.cancel),
  registrationController.cancelRegistration
);

module.exports = router;
