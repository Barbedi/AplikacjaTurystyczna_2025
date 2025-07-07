import express from "express";
const router = express.Router();
import multer from "multer";
import { verifyUser } from "../middlewares/verifyUser";
import fs from "fs";
import path from "path";

const FILES_DIR = path.join(__dirname, "../files");

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, FILES_DIR);
    },
    filename: function (_req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * @openapi
 * /files/{file}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get a file by filename
 *     parameters:
 *       - name: file
 *         in: path
 *         required: true
 *         description: Filename of the file
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully fetched file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */

router.get("/:file", async function (req, res, next) {
  try {
    const file = path.join(FILES_DIR, req.params.file);
    if (fs.existsSync(file)) {
      res.sendFile(file);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /files/upload:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully uploaded file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: object
 *                   properties:
 *                     fieldname:
 *                       type: string
 *                     originalname:
 *                       type: string
 *                     encoding:
 *                       type: string
 *                     mimetype:
 *                       type: string
 *                     destination:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     path:
 *                       type: string
 *                     size:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post(
  "/upload",
  verifyUser,
  upload.single("file"),
  async function (req, res, next) {
    try {
      res.status(200).json({ file: req.file });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
