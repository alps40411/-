const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
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
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: 公告 ID
 *         title:
 *           type: string
 *           maxLength: 255
 *           description: 公告標題
 *         description:
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
 *         name: created_by
 *         schema:
 *           type: integer
 *         description: 建立者 ID
 *     responses:
 *       200:
 *         description: 成功取得公告列表
 */
router.get(
  "/",
  validateQuery(schemas.announcement.query),
  announcementController.getAllAnnouncements
);

/**
 * @swagger
 * /api/announcements/search:
 *   get:
 *     summary: 搜尋公告
 *     tags: [公告]
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
router.get("/search", announcementController.searchAnnouncements);

/**
 * @swagger
 * /api/announcements/{id}:
 *   get:
 *     summary: 取得指定公告
 *     tags: [公告]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 公告 ID
 *     responses:
 *       200:
 *         description: 成功取得公告
 *       404:
 *         description: 公告不存在
 */
router.get(
  "/:id",
  validateParams(schemas.announcement.params),
  announcementController.getAnnouncementById
);

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: 建立公告
 *     tags: [公告]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - created_by
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 description: 公告標題
 *               description:
 *                 type: string
 *                 description: 公告內容
 *               created_by:
 *                 type: integer
 *                 description: 建立者 ID
 *     responses:
 *       201:
 *         description: 公告建立成功
 *       400:
 *         description: 請求資料驗證失敗
 */
router.post(
  "/",
  validate(schemas.announcement.create),
  announcementController.createAnnouncement
);

/**
 * @swagger
 * /api/announcements/{id}:
 *   put:
 *     summary: 更新公告
 *     tags: [公告]
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
 *               description:
 *                 type: string
 *                 description: 公告內容
 *               updated_by:
 *                 type: integer
 *                 description: 更新者 ID
 *     responses:
 *       200:
 *         description: 公告更新成功
 *       400:
 *         description: 請求資料驗證失敗
 *       403:
 *         description: 沒有權限更新此公告
 *       404:
 *         description: 公告不存在
 */
router.put(
  "/:id",
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
 *             required:
 *               - deleted_by
 *             properties:
 *               force:
 *                 type: boolean
 *                 description: 是否強制刪除
 *               deleted_by:
 *                 type: integer
 *                 description: 刪除者 ID
 *     responses:
 *       200:
 *         description: 公告刪除成功
 *       403:
 *         description: 沒有權限刪除此公告
 *       404:
 *         description: 公告不存在
 */
router.delete(
  "/:id",
  validateParams(schemas.announcement.params),
  announcementController.deleteAnnouncement
);

/**
 * @swagger
 * /api/announcements/stats/admin/{adminId}:
 *   get:
 *     summary: 取得指定管理員的公告統計
 *     tags: [公告]
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
router.get(
  "/stats/admin/:adminId",
  announcementController.getAnnouncementStats
);

module.exports = router;
