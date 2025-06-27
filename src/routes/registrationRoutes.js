const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const { lineAuthMiddleware } = require("../middlewares/authMiddleware");
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
 *     security:
 *       - lineAuth: []
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
 *     responses:
 *       201:
 *         description: 報名成功
 *       400:
 *         description: 請求資料驗證失敗
 *       401:
 *         description: 未授權的操作
 *       404:
 *         description: 活動不存在
 *       409:
 *         description: 報名已滿或已報名
 */
router.post(
  "/",
  lineAuthMiddleware,
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
 * /api/registrations/{id}:
 *   delete:
 *     summary: 刪除報名記錄
 *     tags: [報名]
 *     security:
 *       - lineAuth: []
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
  lineAuthMiddleware,
  validateParams(schemas.registration.params),
  validate(schemas.registration.cancel),
  registrationController.cancelRegistration
);

module.exports = router;
