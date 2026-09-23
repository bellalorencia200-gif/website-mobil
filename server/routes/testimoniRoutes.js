import express from "express";
import { upload } from "../middlewares/upload.js";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";

import {
  createTestimoni,
  getActiveTestimoni,
  getAllTestimoni,
  updateTestimoni,
  deleteTestimoni,
} from "../controllers/testimoniController.js";

const router = express.Router();

router.post("/", upload.single("foto"), createTestimoni);
router.get("/", getActiveTestimoni);
router.get("/admin", verifyToken, verifyAdmin, getAllTestimoni);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("foto"),
  updateTestimoni,
);
router.delete("/:id", verifyToken, verifyAdmin, deleteTestimoni);

export default router;