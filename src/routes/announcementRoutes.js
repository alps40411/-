const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
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
 *     Announcement:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: 公告 ID
 *         title:
 *           type: string
 *           maxLength: 255
 *           description: 公告標題
 *         content:
 *           type: string
 *           description: 公告內容
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
 * /api/announcements:
 *   get:
 *     summary: 取得所有有效公告
 *     tags: [公告]
 *     security:
 *       - lineAuth: []
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
 *         description: 成功取得公告列表
 *       401:
 *         description: 未授權的操作
 */
router.get(
  "/",
  lineAuthMiddleware,
  validateQuery(schemas.announcement.query),
  announcementController.getAllAnnouncements
);

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: 建立公告
 *     tags: [公告]
 *     security:
 *       - lineAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 description: 公告標題
 *               content:
 *                 type: string
 *                 description: 公告內容
 *     responses:
 *       201:
 *         description: 公告建立成功
 *       400:
 *         description: 請求資料驗證失敗
 *       401:
 *         description: 未授權的操作
 */
router.post(
  "/",
  lineAuthMiddleware,
  validate(schemas.announcement.create),
  announcementController.createAnnouncement
);

/**
 * @swagger
 * /api/announcements/{id}:
 *   put:
 *     summary: 更新公告
 *     tags: [公告]
 *     security:
 *       - lineAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 公告 ID
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
 *                 description: 公告標題
 *               content:
 *                 type: string
 *                 description: 公告內容
 *     responses:
 *       200:
 *         description: 公告更新成功
 *       400:
 *         description: 請求資料驗證失敗
 *       401:
 *         description: 未授權的操作
 *       404:
 *         description: 公告不存在
 */
router.put(
  "/:id",
  lineAuthMiddleware,
  validateParams(schemas.announcement.params),
  validate(schemas.announcement.update),
  announcementController.updateAnnouncement
);

/**
 * @swagger
 * /api/announcements/{id}:
 *   delete:
 *     summary: 刪除公告
 *     tags: [公告]
 *     security:
 *       - lineAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 公告 ID
 *     responses:
 *       200:
 *         description: 公告刪除成功
 *       401:
 *         description: 未授權的操作
 *       404:
 *         description: 公告不存在
 */
router.delete(
  "/:id",
  lineAuthMiddleware,
  validateParams(schemas.announcement.params),
  announcementController.deleteAnnouncement
);

module.exports = router;
