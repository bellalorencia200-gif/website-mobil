import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import { ulid } from "ulid";

//LOGIKA TAMBAH MOBIL
export const createMobil = async (req, res) => {
  const {
    nama,
    deskripsi,
    tahun,
    harga,
    stok,
    categoryId,
    merek,
    kilometer,
    transmisi,
    bahanBakar,
    kapasitasMesin,
    warna,
    isPromo,
  } = req.body;
  if (!nama || !tahun || !harga || !stok || !categoryId || !deskripsi) {
    return res
      .status(400)
      .json({ message: "nama, tahun, stok dan kategori wajib di isi" });
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return res.status(404).json({ message: "kategori tidak ditemukan " });
  }
  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "websitemobil",
      });
      images.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
  }
  const newmobil = await prisma.mobil.create({
    data: {
      id: ulid(),
      nama,
      deskripsi,
      harga: Number(harga),
      stok: Number(stok),
      tahun: Number(tahun),
      merek,
      kilometer: kilometer !== undefined ? Number(kilometer) : undefined,
      transmisi: transmisi || undefined,
      bahanBakar: bahanBakar || undefined,
      kapasitasMesin:
        kapasitasMesin !== undefined ? Number(kapasitasMesin) : undefined,
     warna: warna || undefined,
      isPromo: isPromo === "true" || isPromo === true,
      category: {
        connect: { id: categoryId },
      },
      images,
    },
  });
  return res
    .status(201)
    .json({ message: "mobil berhasil di tambahkan", newmobil });
};

//LOGIKA LIHAT SEMUA MOBIL
export const getAllMobil = async (req, res) => {
  try {
    const mobil = await prisma.mobil.findMany({
      include: { category: true },
      orderBy: { id: "desc" },
    });
    return res
      .status(200)
      .json({ message: "berhasil mengambil semua data mobil", mobil });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal mengambil data mobil" });
  }
};

//LOGIKA LIHAT DETAIL MOBIL
export const getMobilById = async (req, res) => {
  const { id } = req.params;
  const mobil = await prisma.mobil.findUnique({
    where: { id: id },
    include: { category: true },
  });
  if (!mobil) {
    return res.status(404).json({ message: "mobil yang kamu cari tidak ada" });
  }
  return res.status(200).json({
    message: "mobil yang kamu cari ketemu",
    mobil,
  });
};

//LOGIKA UPDATE MOBIL
export const updateMobil = async (req, res) => {
  const { id } = req.params;
  const {
    nama,
    deskripsi,
    tahun,
    harga,
    stok,
    categoryId,
    merek,
    kilometer,
    transmisi,
    bahanBakar,
    kapasitasMesin,
    warna,
    isPromo,
  } = req.body;
  try {
    const mobil = await prisma.mobil.findUnique({
      where: { id: id },
      include: { category: true },
    });

    if (!mobil) {
      return res.status(404).json({
        message: "mobil yang kamu cari tidak ditemukan",
      });
    }

    if (!nama || !tahun || !harga || !stok || !categoryId || !deskripsi) {
      return res.status(400).json({
        message:
          "nama, tahun, harga, stok, deskripsi dan kategori wajib di isi",
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: "kategori tidak ditemukan" });
    }

    let images = mobil.images;
    if (req.files && req.files.length > 0) {
      if (mobil.images && mobil.images.length > 0) {
        for (const urlLama of mobil.images) {
          const parts = urlLama.split("/");
          const fileNameWithExt = parts[parts.length - 1];
          const folder = parts[parts.length - 2];
          const fileName = fileNameWithExt.split(".")[0];
          const publicId = `${folder}/${fileName}`;
          await cloudinary.uploader.destroy(publicId);
        }
      }

      images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "websitemobil",
        });
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }
    const updatedMobil = await prisma.mobil.update({
      where: { id: id },
      data: {
        nama,
        deskripsi,
        tahun: Number(tahun),
        harga: Number(harga),
        stok: Number(stok),
        merek,
        kilometer: kilometer !== undefined ? Number(kilometer) : undefined,
        transmisi: transmisi || undefined,
        bahanBakar: bahanBakar || undefined,
        kapasitasMesin:
          kapasitasMesin !== undefined ? Number(kapasitasMesin) : undefined,
       warna: warna || undefined,
      isPromo: isPromo === "true" || isPromo === true,
      category: {
          connect: { id: categoryId },
        },
        images,
      },
    });
    return res
      .status(200)
      .json({ message: "mobil berhasil di update", updatedMobil });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal update mobil" });
  }
};

//LOGIKA MOBIL SUDAH DI HAPUS
export const deleteMobil = async (req, res) => {
  const { id } = req.params;

  const mobil = await prisma.mobil.findUnique({
    where: { id: id },
  });
  if (!mobil) {
    return res.status(404).json({ message: "mobil tidak ditemukan" });
  }

  if (mobil.images && mobil.images.length > 0) {
    for (const urlLama of mobil.images) {
      const parts = urlLama.split("/");
      const fileNameWithExt = parts[parts.length - 1];
      const folder = parts[parts.length - 2];
      const fileName = fileNameWithExt.split(".")[0];
      const publicId = `${folder}/${fileName}`;
      await cloudinary.uploader.destroy(publicId);
    }
  }
  await prisma.mobil.delete({
    where: { id: id },
  });
  return res.status(200).json({ message: "mobil berhasil di hapus" });
};
