import express from "express";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", verifyToken, verifyAdmin, updateSettings);

export default router;