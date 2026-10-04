import express from "express";
import multer from "multer";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";

import {
  createPengajuan,
  getAllPengajuan,
  updateStatusPengajuan,
  deletePengajuan,
} from "../controllers/jualMobilController.js";

const router = express.Router();

// Upload khusus pengajuan jual (form publik):
// sama seperti middlewares/upload.js, tapi hanya gambar & maks. 5 MB per foto
const uploadPengajuan = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("hanya file gambar yang boleh di upload"));
  },
});

// Tangani error upload agar pesannya jelas
const terimaFoto = (req, res, next) => {
  uploadPengajuan.array("images", 4)(req, res, (err) => {
    if (!err) return next();
    const pesan =
      err.code === "LIMIT_FILE_SIZE"
        ? "ukuran foto maksimal 5 MB"
        : err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE"
          ? "maksimal 4 foto"
          : err.message;
    return res.status(400).json({ message: pesan });
  });
};

// Publik: dari website pembeli (tanpa login)
router.post("/", terimaFoto, createPengajuan);

// Admin saja
router.get("/", verifyToken, verifyAdmin, getAllPengajuan);
router.patch("/:id", verifyToken, verifyAdmin, updateStatusPengajuan);
router.delete("/:id", verifyToken, verifyAdmin, deletePengajuan);

export default router;