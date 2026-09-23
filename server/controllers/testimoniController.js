import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

//LOGIKA TAMBAH TESTIMONI (PUBLIC - dari form pelanggan di homepage)
export const createTestimoni = async (req, res) => {
  const { namaPelanggan, komentar, rating, mobilDibeli, lokasi } = req.body;

  if (!namaPelanggan || !komentar) {
    return res
      .status(400)
      .json({ message: "nama dan komentar wajib di isi" });
  }

  try {
    let fotoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "testimoni",
      });
      fotoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newTestimoni = await prisma.testimoni.create({
      data: {
        namaPelanggan,
        komentar,
        rating: rating !== undefined ? Number(rating) : undefined,
        mobilDibeli: mobilDibeli || undefined,
        lokasi: lokasi || undefined,
        fotoUrl,
      },
    });

    return res.status(201).json({
      message: "testimoni berhasil dikirim, menunggu persetujuan admin",
      newTestimoni,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal mengirim testimoni" });
  }
};

//LOGIKA LIHAT TESTIMONI AKTIF (PUBLIC - untuk slider di homepage)
export const getActiveTestimoni = async (req, res) => {
  try {
    const testimoni = await prisma.testimoni.findMany({
      where: { aktif: true },
      orderBy: { createdAt: "desc" },
    });
    return res
      .status(200)
      .json({ message: "berhasil mengambil testimoni aktif", testimoni });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal mengambil testimoni" });
  }
};

//LOGIKA LIHAT SEMUA TESTIMONI (ADMIN - termasuk yang belum disetujui)
export const getAllTestimoni = async (req, res) => {
  try {
    const testimoni = await prisma.testimoni.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res
      .status(200)
      .json({ message: "berhasil mengambil semua testimoni", testimoni });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "gagal mengambil data testimoni" });
  }
};

//LOGIKA UPDATE TESTIMONI (ADMIN - setujui/nonaktifkan/edit)
export const updateTestimoni = async (req, res) => {
  const { id } = req.params;
  const { namaPelanggan, komentar, rating, mobilDibeli, lokasi, aktif } =
    req.body;

  try {
    const testimoni = await prisma.testimoni.findUnique({ where: { id } });
    if (!testimoni) {
      return res.status(404).json({ message: "testimoni tidak ditemukan" });
    }

    let fotoUrl = testimoni.fotoUrl;
    if (req.file) {
      if (testimoni.fotoUrl) {
        const parts = testimoni.fotoUrl.split("/");
        const fileNameWithExt = parts[parts.length - 1];
        const folder = parts[parts.length - 2];
        const fileName = fileNameWithExt.split(".")[0];
        const publicId = `${folder}/${fileName}`;
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "testimoni",
      });
      fotoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedTestimoni = await prisma.testimoni.update({
      where: { id },
      data: {
        namaPelanggan: namaPelanggan || undefined,
        komentar: komentar || undefined,
        rating: rating !== undefined ? Number(rating) : undefined,
        mobilDibeli: mobilDibeli !== undefined ? mobilDibeli : undefined,
        lokasi: lokasi !== undefined ? lokasi : undefined,
        aktif:
          aktif !== undefined ? aktif === true || aktif === "true" : undefined,
        fotoUrl,
      },
    });

    return res
      .status(200)
      .json({ message: "testimoni berhasil di update", updatedTestimoni });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal update testimoni" });
  }
};

//LOGIKA HAPUS TESTIMONI (ADMIN)
export const deleteTestimoni = async (req, res) => {
  const { id } = req.params;

  const testimoni = await prisma.testimoni.findUnique({ where: { id } });
  if (!testimoni) {
    return res.status(404).json({ message: "testimoni tidak ditemukan" });
  }

  if (testimoni.fotoUrl) {
    const parts = testimoni.fotoUrl.split("/");
    const fileNameWithExt = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const fileName = fileNameWithExt.split(".")[0];
    const publicId = `${folder}/${fileName}`;
    await cloudinary.uploader.destroy(publicId);
  }

  await prisma.testimoni.delete({ where: { id } });
  return res.status(200).json({ message: "testimoni berhasil di hapus" });
};