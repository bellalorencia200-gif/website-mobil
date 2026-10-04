import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import {
  FaHistory,
  FaCarSide,
  FaSyncAlt,
  FaUserPlus,
  FaTag,
  FaCommentDots,
  FaArrowRight,
} from "react-icons/fa";

// Berapa aktivitas yang ditampilkan
const JUMLAH_TAMPIL = 8;

// Data diperbarui otomatis setiap 60 detik
const INTERVAL_REFRESH = 60000;

// ==========================================
// WAKTU RELATIF ("2 jam lalu")
// ==========================================
const waktuRelatif = (tanggal) => {
  const detik = Math.floor((Date.now() - new Date(tanggal).getTime()) / 1000);
  if (detik < 60) return "Baru saja";
  const menit = Math.floor(detik / 60);
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.floor(jam / 24);
  if (hari === 1) return "Kemarin";
  if (hari < 7) return `${hari} hari lalu`;
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ==========================================
// WAKTU DARI ID (ULID) — 10 huruf pertama ID menyimpan waktu dibuat
// Dipakai jika data tidak punya createdAt
// ==========================================
const HURUF_ULID = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const waktuDariId = (id) => {
  if (typeof id !== "string" || id.length !== 26) return null;
  let ms = 0;
  for (const huruf of id.slice(0, 10).toUpperCase()) {
    const nilai = HURUF_ULID.indexOf(huruf);
    if (nilai === -1) return null;
    ms = ms * 32 + nilai;
  }
  const tanggal = new Date(ms);
  // pastikan masuk akal (antara tahun 2020 dan sekarang + 1 hari)
  if (ms < Date.UTC(2020, 0, 1) || ms > Date.now() + 86400000) return null;
  return tanggal.toISOString();
};

const waktuDibuat = (item) => item.createdAt || waktuDariId(item.id);

// Dianggap "diperbarui" jika updatedAt lebih dari 1 menit setelah createdAt
const pernahDiubah = (item) =>
  item.updatedAt &&
  item.createdAt &&
  new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime() > 60000;

// ==========================================
// JENIS AKTIVITAS (ikon + warna + link)
// ==========================================
const JENIS = {
  mobilBaru: { icon: FaCarSide, warna: "#BE123C", link: "/admin/mobil" },
  mobilUbah: { icon: FaSyncAlt, warna: "#C27C0E", link: "/admin/mobil" },
  userBaru: { icon: FaUserPlus, warna: "#6D28D9", link: "/admin/user" },
  kategori: { icon: FaTag, warna: "#0D9488", link: "/admin/kategori" },
  ulasan: { icon: FaCommentDots, warna: "#2563EB", link: "/admin/testimoni" },
};

const AktivitasTerbaruCard = () => {
  const [aktivitas, setAktivitas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setDetak] = useState(0); // agar "x menit lalu" ikut berjalan

  const ambilData = useCallback(() => {
    const token = localStorage.getItem("token");
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    return Promise.allSettled([
      axios.get("/api/mobil"),
      axios.get("/api/categories"),
      axios.get("/api/users", auth),
      axios.get("/api/testimoni/admin", auth),
    ]).then(([mobilRes, kategoriRes, userRes, testiRes]) => {
      const daftar = [];

      // MOBIL
      if (mobilRes.status === "fulfilled") {
        (mobilRes.value.data.mobil || []).forEach((m) => {
          const dibuat = waktuDibuat(m);
          if (dibuat) {
            daftar.push({
              kunci: `mobil-baru-${m.id}`,
              jenis: "mobilBaru",
              judul: "Mobil baru ditambahkan",
              detail: m.nama,
              waktu: dibuat,
            });
          }
          if (pernahDiubah(m)) {
            daftar.push({
              kunci: `mobil-ubah-${m.id}`,
              jenis: "mobilUbah",
              judul: "Data mobil diperbarui",
              detail: `${m.nama}${
                m.stok !== undefined
                  ? Number(m.stok) > 0
                    ? ` · stok ${m.stok}`
                    : " · stok habis"
                  : ""
              }`,
              waktu: m.updatedAt,
            });
          }
        });
      }

      // KATEGORI
      if (kategoriRes.status === "fulfilled") {
        (kategoriRes.value.data.categories || []).forEach((k) => {
          const dibuatK = waktuDibuat(k);
          if (dibuatK) {
            daftar.push({
              kunci: `kategori-baru-${k.id}`,
              jenis: "kategori",
              judul: "Kategori baru dibuat",
              detail: k.name,
              waktu: dibuatK,
            });
          }
          if (pernahDiubah(k)) {
            daftar.push({
              kunci: `kategori-ubah-${k.id}`,
              jenis: "kategori",
              judul: "Kategori diperbarui",
              detail: k.name,
              waktu: k.updatedAt,
            });
          }
        });
      }

      // USER
      if (userRes.status === "fulfilled") {
        (userRes.value.data.users || []).forEach((u) => {
          const dibuatU = waktuDibuat(u);
          if (dibuatU) {
            daftar.push({
              kunci: `user-${u.id}`,
              jenis: "userBaru",
              judul: "User baru terdaftar",
              detail: `${u.fullName || u.username}${u.role ? ` (${u.role})` : ""}`,
              waktu: dibuatU,
            });
          }
        });
      }

      // ULASAN
      if (testiRes.status === "fulfilled") {
        (testiRes.value.data.testimoni || []).forEach((t) => {
          const dibuatT = waktuDibuat(t);
          if (dibuatT) {
            daftar.push({
              kunci: `ulasan-${t.id}`,
              jenis: "ulasan",
              judul: t.aktif ? "Ulasan pelanggan tayang" : "Ulasan baru menunggu",
              detail: `${t.namaPelanggan}${t.rating ? ` · ${t.rating}/5` : ""}`,
              waktu: dibuatT,
            });
          }
        });
      }

      daftar.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
      setAktivitas(daftar);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    ambilData();

    const timerData = setInterval(ambilData, INTERVAL_REFRESH);
    const timerWaktu = setInterval(() => setDetak((d) => d + 1), 30000);

    const saatKembali = () => {
      if (document.visibilityState === "visible") ambilData();
    };
    document.addEventListener("visibilitychange", saatKembali);

    return () => {
      clearInterval(timerData);
      clearInterval(timerWaktu);
      document.removeEventListener("visibilitychange", saatKembali);
    };
  }, [ambilData]);

  const tampil = aktivitas.slice(0, JUMLAH_TAMPIL);

  return (
    <div className="relative overflow-hidden h-full bg-white rounded-[30px] ring-1 ring-[#EADFD2] shadow-[0_18px_45px_-22px_rgba(80,30,20,0.28)] p-4 sm:p-6 lg:p-7 flex flex-col">
      {/* Garis aksen atas */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8f1117] via-[#E0A82E] to-[#5f0a0d]" />

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-white flex items-center justify-center shadow-[0_10px_20px_-6px_rgba(143,17,23,0.5)] ring-2 ring-[#F6D47A]/30">
            <FaHistory className="text-lg" />
          </div>
          <div>
            <h2 className="font-black text-[#1c0a0b] text-lg sm:text-xl tracking-tight">
              Aktivitas Terbaru
            </h2>
            <p className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-gray-600 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
              </span>
              Diperbarui otomatis
            </p>
          </div>
        </div>
      </div>

      {/* Garis aksen */}
      <div className="flex items-center gap-2 mt-4">
        <div className="w-12 h-[3px] rounded-full bg-[#9b1b20]" />
        <div className="w-7 h-[3px] rounded-full bg-[#E0A82E]" />
        <div className="flex-1 h-px bg-gradient-to-r from-[#EADFD2] to-transparent" />
      </div>

      {/* ISI */}
      <div className="mt-5 flex-1 flex flex-col">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[62px] rounded-2xl bg-[#F7F3ED]" />
            ))}
          </div>
        ) : tampil.length === 0 ? (
          <div className="py-12 text-center">
            <FaHistory className="mx-auto text-3xl text-[#C27C0E] mb-3" />
            <p className="text-sm font-semibold text-gray-500">
              Belum ada aktivitas
            </p>
          </div>
        ) : (
          <ul className="relative flex-1 flex flex-col justify-between">
            {/* Garis timeline */}
            <span className="absolute left-[21px] top-3 bottom-3 w-px bg-gradient-to-b from-[#E0CBB0] via-[#EADFD2] to-transparent" />

            {tampil.map((a) => {
              const j = JENIS[a.jenis];
              const Icon = j.icon;
              return (
                <li key={a.kunci}>
                  <Link
                    to={j.link}
                    className="group relative flex items-start gap-3.5 rounded-2xl px-1.5 py-2.5 transition hover:bg-[#FBF8F4]"
                  >
                    <span
                      className="relative z-10 w-[30px] h-[30px] mt-0.5 shrink-0 rounded-full flex items-center justify-center ring-4 ring-white transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${j.warna}18`, color: j.warna }}
                    >
                      <Icon className="text-[12px]" />
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13.5px] font-extrabold text-[#1c0a0b] leading-snug">
                          {a.judul}
                        </p>
                        <span className="shrink-0 text-[11px] font-semibold text-gray-500 whitespace-nowrap mt-0.5">
                          {waktuRelatif(a.waktu)}
                        </span>
                      </div>
                      <p className="text-[12.5px] font-medium text-gray-600 mt-0.5 truncate">
                        {a.detail}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* FOOTER */}
      {!isLoading && aktivitas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#EFE6DC] flex items-center justify-between">
          <p className="text-[11px] font-semibold text-gray-500">
            {Math.min(JUMLAH_TAMPIL, aktivitas.length)} dari {aktivitas.length} aktivitas
          </p>
          <Link
            to="/admin/mobil"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B5791A] hover:text-[#8f1117] transition"
          >
            Kelola data <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AktivitasTerbaruCard;
