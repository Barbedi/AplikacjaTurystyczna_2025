import express from "express";
const router = express.Router();
import multer from "multer";
import { verifyUser } from "../middlewares/verifyUser";
import fs from "fs";
import path from "path";

const FILES_DIR = path.join(__dirname, "../files");
const PROFILES_DIR = path.join(FILES_DIR, "profiles");
const PEAKS_DIR = path.join(FILES_DIR, "peaks");

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}
if (!fs.existsSync(PROFILES_DIR)) {
  fs.mkdirSync(PROFILES_DIR, { recursive: true });
}
if (!fs.existsSync(PEAKS_DIR)) {
  fs.mkdirSync(PEAKS_DIR, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, _file, cb) {
      const uploadType = (req as any).uploadType as string;
      let destinationDir = FILES_DIR;

      if (uploadType === "profile") {
        destinationDir = PROFILES_DIR;
      } else if (uploadType === "peaks") {
        destinationDir = PEAKS_DIR;
      }

      cb(null, destinationDir);
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
    const filename = req.params.file;
    const filePath = path.join(PROFILES_DIR, filename);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
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
  "/uploadProfile",
  verifyUser,
  (req, _res, next) => {
    (req as any).uploadType = "profile";
    next();
  },
  upload.single("file"),
  (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      res.status(200).json({ file: req.file });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/upload/peaks",
  verifyUser,
  (req, _res, next) => {
    (req as any).uploadType = "peaks";
    next();
  },
  upload.single("file"),
  (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      res.status(200).json({
        file: req.file,
        message: "Peak image uploaded successfully.",
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * @openapi
 * /files/peaks/{file}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get a peak image by filename
 *     parameters:
 *       - name: file
 *         in: path
 *         required: true
 *         description: Filename of the peak image
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully fetched peak image
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Peak image not found
 *       500:
 *         description: Internal server error
 */
router.get("/peaks/:file", async function (req, res, next) {
  try {
    const filename = req.params.file;
    const filePath = path.join(PEAKS_DIR, filename);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "Peak image not found" });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
