import { prisma } from "../lib/prisma.js";

// Rapikan link media sosial & aplikasi:
// - undefined  -> tidak diubah (tetap seperti di database)
// - kosong ""  -> dihapus (null)
// - tanpa http -> otomatis ditambah https://
const rapikanLink = (link) => {
  if (link === undefined) return undefined;
  const teks = String(link || "").trim();
  if (!teks) return null;
  return /^https?:\/\//i.test(teks) ? teks : `https://${teks}`;
};

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

//LOGIKA UPDATE PENGATURAN LOKASI, MEDIA SOSIAL & LINK APLIKASI
export const updateSettings = async (req, res) => {
  const {
    alamat,
    mapEmbedUrl,
    jamOperasional,
    whatsapp,
    facebookUrl,
    instagramUrl,
    telegramUrl,
    playStoreUrl,
    appStoreUrl,
  } = req.body;

  const data = {
    alamat,
    mapEmbedUrl,
    jamOperasional,
    whatsapp,
    facebookUrl: rapikanLink(facebookUrl),
    instagramUrl: rapikanLink(instagramUrl),
    telegramUrl: rapikanLink(telegramUrl),
    playStoreUrl: rapikanLink(playStoreUrl),
    appStoreUrl: rapikanLink(appStoreUrl),
  };

  try {
    const settings = await prisma.settings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });
    return res
      .status(200)
      .json({ message: "pengaturan berhasil di update", settings });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal update pengaturan" });
  }
};