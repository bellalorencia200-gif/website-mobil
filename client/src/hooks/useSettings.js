import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

// Nomor cadangan: dipakai kalau server lambat / error,
// supaya tombol WhatsApp tidak pernah kosong
const NOMOR_CADANGAN = "6282176957132";
const KUNCI_CACHE = "pengaturanSitus";

// Simpanan sementara di memori agar /api/settings hanya diambil sekali
let cacheSettings = null;
let permintaan = null;

const bacaCache = () => {
  if (cacheSettings) return cacheSettings;
  try {
    const simpanan = sessionStorage.getItem(KUNCI_CACHE);
    if (simpanan) cacheSettings = JSON.parse(simpanan);
  } catch {
    // abaikan
  }
  return cacheSettings;
};

const ambilSettings = () => {
  if (!permintaan) {
    permintaan = axios
      .get("/api/settings")
      .then((response) => {
        cacheSettings = response.data.settings || {};
        try {
          sessionStorage.setItem(KUNCI_CACHE, JSON.stringify(cacheSettings));
        } catch {
          // abaikan
        }
        return cacheSettings;
      })
      .catch((error) => {
        console.log(error);
        permintaan = null; // boleh dicoba lagi nanti
        return cacheSettings || {};
      });
  }
  return permintaan;
};

// 08xx / +62 8xx / 62-8xx  ->  628xx
const keFormat62 = (nomor) =>
  String(nomor || "").replace(/\D/g, "").replace(/^0/, "62");

// 628xx -> 08xx (untuk ditampilkan ke pengunjung)
const keFormat08 = (nomor) => nomor.replace(/^62/, "0");

// Rapikan link media sosial (tambah https:// kalau belum ada)
const rapikanLink = (link) => {
  const teks = String(link || "").trim();
  if (!teks) return "";
  return /^https?:\/\//i.test(teks) ? teks : `https://${teks}`;
};

export default function useSettings() {
  const [settings, setSettings] = useState(bacaCache);

  useEffect(() => {
    let aktif = true;
    ambilSettings().then((data) => {
      if (aktif) setSettings(data);
    });
    return () => {
      aktif = false;
    };
  }, []);

  const nomorWa = keFormat62(settings?.whatsapp) || NOMOR_CADANGAN;

  return {
    settings: settings || {},
    nomorWa, // contoh: 6282176957132  (untuk link wa.me)
    nomorTampil: keFormat08(nomorWa), // contoh: 082176957132 (untuk ditampilkan)
    linkWa: `https://wa.me/${nomorWa}`,
    facebookUrl: rapikanLink(settings?.facebookUrl),
    instagramUrl: rapikanLink(settings?.instagramUrl),
    telegramUrl: rapikanLink(settings?.telegramUrl),
  };
}