const express = require("express");
const router = express.Router();
const administratorController = require("../controllers/administratorController");
const {
  validate,
  validateParams,
  schemas,
} = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Administrator:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - phone
 *         - birth
 *         - gender
 *         - line_id
 *       properties:
 *         username:
 *           type: string
 *           maxLength: 50
 *           description: 使用者名稱
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: 姓名
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
 *           enum: [MALE, FEMALE, OTHER]
 *           description: 性別
 *         line_id:
 *           type: string
 *           maxLength: 50
 *           description: Line ID
 *     AdministratorResponse:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 管理員 ID
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: 建立時間
 *         - $ref: '#/components/schemas/Administrator'
 */

/**
 * @swagger
 * /api/administrators:
 *   post:
 *     summary: 建立管理員
 *     tags: [管理員]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Administrator'
 *     responses:
 *       201:
 *         description: 管理員建立成功
 *       400:
 *         description: 請求資料驗證失敗
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
 *     summary: 取得所有管理員
 *     tags: [管理員]
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
 *         description: 成功取得管理員列表
 */
router.get("/", administratorController.getAllAdministrators);

/**
 * @swagger
 * /api/administrators/{id}:
 *   delete:
 *     summary: 刪除管理員
 *     tags: [管理員]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 管理員 ID
 *     responses:
 *       200:
 *         description: 管理員刪除成功
 *       404:
 *         description: 管理員不存在
 */
router.delete(
  "/:id",
  validateParams(schemas.administrator.params),
  administratorController.deleteAdministrator
);

module.exports = router;
