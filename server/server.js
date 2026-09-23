import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import mobilRoutes from "./routes/mobilRoutes.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import testimoniRoutes from "./routes/testimoniRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mobil", mobilRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/testimoni", testimoniRoutes);

app.get("/api/test", verifyToken, (req, res) => {
  res.json({
    message: "kamu berhasil akses route yang di proteksi",
    user: req.user,
  });
});
app.get("/", (req, res) => {
  res.send("server berjalan");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server berjalan di port ${PORT}`);
});
