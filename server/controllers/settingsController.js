import { prisma } from "../lib/prisma.js";

//LOGIKA AMBIL PENGATURAN LOKASI
export const getSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "main" },
    });
    return res
      .status(200)
      .json({ message: "berhasil mengambil pengaturan lokasi", settings });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal mengambil pengaturan lokasi" });
  }
};

//LOGIKA UPDATE PENGATURAN LOKASI
export const updateSettings = async (req, res) => {
  const { alamat, mapEmbedUrl, jamOperasional, whatsapp } = req.body;
  try {
    const settings = await prisma.settings.upsert({
      where: { id: "main" },
      update: { alamat, mapEmbedUrl, jamOperasional, whatsapp },
      create: { id: "main", alamat, mapEmbedUrl, jamOperasional, whatsapp },
    });
    return res
      .status(200)
      .json({ message: "pengaturan lokasi berhasil di update", settings });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal update pengaturan lokasi" });
  }
};