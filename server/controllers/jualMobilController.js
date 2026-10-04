import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import { ulid } from "ulid";

const FOLDER_FOTO = "pengajuan-jual";
const STATUS_VALID = ["baru", "dihubungi", "selesai"];

// Hapus file sementara hasil upload (dipakai saat terjadi error)
const hapusFileSementara = (files) => {
  for (const file of files || []) {
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch {
      // abaikan
    }
  }
};

// Ambil public_id Cloudinary dari URL (sama seperti di mobilController)
const publicIdDariUrl = (url) => {
  const parts = url.split("/");
  const fileNameWithExt = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const fileName = fileNameWithExt.split(".")[0];
  return `${folder}/${fileName}`;
};

// Ubah "485.000.000" / "485000000" menjadi angka
const keAngka = (nilai) => {
  if (nilai === undefined || nilai === null || nilai === "") return null;
  const angka = Number(String(nilai).replace(/\D/g, ""));
  return Number.isFinite(angka) ? angka : null;
};

//LOGIKA KIRIM PENGAJUAN JUAL (PUBLIK - dari website pembeli)
export const createPengajuan = async (req, res) => {
  const {
    nama,
    noWa,
    kota,
    merek,
    model,
    tahun,
    kilometer,
    transmisi,
    warna,
    kondisi,
    deskripsi,
    hargaDiinginkan,
  } = req.body;

  if (!nama || !noWa || !merek || !model || !tahun) {
    hapusFileSementara(req.files);
    return res.status(400).json({
      message: "nama, no WhatsApp, merek, model dan tahun wajib di isi",
    });
  }

  const nomor = String(noWa).replace(/\D/g, "");
  if (nomor.length < 9 || nomor.length > 15) {
    hapusFileSementara(req.files);
    return res.status(400).json({ message: "nomor WhatsApp tidak valid" });
  }

  const tahunAngka = keAngka(tahun);
  const tahunSekarang = new Date().getFullYear();
  if (!tahunAngka || tahunAngka < 1970 || tahunAngka > tahunSekarang + 1) {
    hapusFileSementara(req.files);
    return res.status(400).json({ message: "tahun mobil tidak valid" });
  }

  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: FOLDER_FOTO,
        });
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const pengajuan = await prisma.pengajuanJual.create({
      data: {
        id: ulid(),
        nama: String(nama).trim(),
        noWa: nomor,
        kota: kota ? String(kota).trim() : null,
        merek: String(merek).trim(),
        model: String(model).trim(),
        tahun: tahunAngka,
        kilometer: keAngka(kilometer) ?? 0,
        transmisi: transmisi || "Manual",
        warna: warna ? String(warna).trim() : null,
        kondisi: kondisi ? String(kondisi).trim() : null,
        deskripsi: deskripsi ? String(deskripsi).trim() : null,
        hargaDiinginkan: keAngka(hargaDiinginkan),
        images,
      },
    });

    return res
      .status(201)
      .json({ message: "pengajuan jual mobil berhasil dikirim", pengajuan });
  } catch (error) {
    console.log(error.message);
    hapusFileSementara(req.files);
    return res.status(500).json({ message: "gagal mengirim pengajuan" });
  }
};

//LOGIKA LIHAT SEMUA PENGAJUAN (ADMIN)
export const getAllPengajuan = async (req, res) => {
  try {
    const pengajuan = await prisma.pengajuanJual.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res
      .status(200)
      .json({ message: "berhasil mengambil data pengajuan", pengajuan });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal mengambil data pengajuan" });
  }
};

//LOGIKA UBAH STATUS / CATATAN PENGAJUAN (ADMIN)
export const updateStatusPengajuan = async (req, res) => {
  const { id } = req.params;
  const { status, catatan } = req.body;

  if (status !== undefined && !STATUS_VALID.includes(status)) {
    return res
      .status(400)
      .json({ message: "status harus baru, dihubungi, atau selesai" });
  }

  try {
    const ada = await prisma.pengajuanJual.findUnique({ where: { id } });
    if (!ada) {
      return res.status(404).json({ message: "pengajuan tidak ditemukan" });
    }

    const pengajuan = await prisma.pengajuanJual.update({
      where: { id },
      data: {
        status: status ?? undefined,
        catatan: catatan !== undefined ? catatan : undefined,
      },
    });
    return res
      .status(200)
      .json({ message: "status pengajuan berhasil di update", pengajuan });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal update pengajuan" });
  }
};

//LOGIKA HAPUS PENGAJUAN (ADMIN)
export const deletePengajuan = async (req, res) => {
  const { id } = req.params;
  try {
    const pengajuan = await prisma.pengajuanJual.findUnique({ where: { id } });
    if (!pengajuan) {
      return res.status(404).json({ message: "pengajuan tidak ditemukan" });
    }

    for (const url of pengajuan.images || []) {
      try {
        await cloudinary.uploader.destroy(publicIdDariUrl(url));
      } catch (error) {
        console.log(error.message);
      }
    }

    await prisma.pengajuanJual.delete({ where: { id } });
    return res.status(200).json({ message: "pengajuan berhasil di hapus" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "gagal menghapus pengajuan" });
  }
};