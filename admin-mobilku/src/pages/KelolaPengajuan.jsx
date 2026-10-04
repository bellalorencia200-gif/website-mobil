import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import {
  FaHandshake,
  FaInbox,
  FaHourglassHalf,
  FaPhoneAlt,
  FaCheckCircle,
  FaSearch,
  FaTimes,
  FaWhatsapp,
  FaEye,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaCar,
  FaChevronLeft,
  FaChevronRight,
  FaImage,
} from "react-icons/fa";

// ==========================================
// PENGATURAN TAMPILAN
// ==========================================
const PER_HALAMAN = 10;

const STATUS = {
  baru: {
    label: "Baru",
    kelas: "text-[#A86B12] bg-[#E0A82E]/15 ring-[#E0A82E]/40",
    titik: "bg-[#E0A82E]",
  },
  dihubungi: {
    label: "Dihubungi",
    kelas: "text-[#1D4ED8] bg-[#2563EB]/10 ring-[#2563EB]/25",
    titik: "bg-[#2563EB]",
  },
  selesai: {
    label: "Selesai",
    kelas: "text-[#047857] bg-[#10B981]/10 ring-[#10B981]/25",
    titik: "bg-[#10B981]",
  },
};

const formatRupiah = (n) =>
  n ? `Rp ${Number(n).toLocaleString("id-ID")}` : "—";

const formatKm = (n) => `${Number(n || 0).toLocaleString("id-ID")} km`;

// 0812... -> 62812... (untuk link wa.me)
const keNomorWa = (v) => {
  const a = String(v || "").replace(/\D/g, "");
  if (!a) return "";
  return a.startsWith("62") ? a : "62" + a.replace(/^0/, "");
};

const tanggalMasuk = (iso) => {
  if (!iso) return "—";
  const t = new Date(iso);
  const hariIni = new Date();
  const kemarin = new Date();
  kemarin.setDate(hariIni.getDate() - 1);
  const jam = t.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  if (t.toDateString() === hariIni.toDateString()) return `Hari ini, ${jam}`;
  if (t.toDateString() === kemarin.toDateString()) return `Kemarin, ${jam}`;
  return t.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const KelolaPengajuan = () => {
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prosesId, setProsesId] = useState(null); // id yang sedang diubah/dihapus
  const [dipilih, setDipilih] = useState(null); // detail yang sedang dibuka
  const [catatan, setCatatan] = useState("");
  const [fotoAktif, setFotoAktif] = useState(0);

  const [cari, setCari] = useState("");
  const [tab, setTab] = useState("semua");
  const [halaman, setHalaman] = useState(1);

  const token = localStorage.getItem("token");
  const header = { headers: { Authorization: `Bearer ${token}` } };

  // ---------- Ambil data ----------
  useEffect(() => {
    axios
      .get("/api/jual-mobil", header)
      .then((response) => {
        setDataPengajuan(response.data.pengajuan || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setHalaman(1);
  }, [cari, tab]);

  // ---------- Ubah status / catatan ----------
  const perbarui = (id, data) => {
    setProsesId(id);
    return axios
      .patch(`/api/jual-mobil/${id}`, data, header)
      .then((response) => {
        const baru = response.data.pengajuan;
        setDataPengajuan((lama) => lama.map((p) => (p.id === id ? { ...p, ...baru } : p)));
        setDipilih((d) => (d && d.id === id ? { ...d, ...baru } : d));
        window.dispatchEvent(new Event("pengajuan-berubah")); // perbarui angka notifikasi di sidebar
        return true;
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Gagal memperbarui pengajuan");
        return false;
      })
      .finally(() => setProsesId(null));
  };

  // ---------- Hapus ----------
  const handleHapus = (p) => {
    if (!window.confirm(`Hapus pengajuan dari ${p.nama} (${p.merek} ${p.model})?`)) return;
    setProsesId(p.id);
    axios
      .delete(`/api/jual-mobil/${p.id}`, header)
      .then(() => {
        setDataPengajuan((lama) => lama.filter((x) => x.id !== p.id));
        if (dipilih?.id === p.id) setDipilih(null);
        window.dispatchEvent(new Event("pengajuan-berubah")); // perbarui angka notifikasi di sidebar
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Gagal menghapus pengajuan");
      })
      .finally(() => setProsesId(null));
  };

  // ---------- Detail ----------
  const bukaDetail = (p) => {
    setDipilih(p);
    setCatatan(p.catatan || "");
    setFotoAktif(0);
  };

  const linkWa = (p) => {
    const nomor = keNomorWa(p.noWa);
    if (!nomor) return null;
    const pesan = `Halo ${p.nama}, kami dari MobilKu. Terima kasih sudah mengajukan jual mobil ${p.merek} ${p.model} ${p.tahun}. Boleh kami jadwalkan pengecekan mobilnya?`;
    // HP: buka langsung aplikasi WhatsApp (bisa WhatsApp biasa maupun WhatsApp Business)
    const diHp = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (diHp) {
      return `whatsapp://send?phone=${nomor}&text=${encodeURIComponent(pesan)}`;
    }

    // Laptop: lewat wa.me (WhatsApp Web / WhatsApp Desktop)
    return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
  };

  // ==========================================
  // TAMPILAN SAJA (ringkasan, cari, filter, halaman)
  // ==========================================
  const jumlah = (s) => dataPengajuan.filter((p) => p.status === s).length;

  const kataCari = cari.trim().toLowerCase();
  const tersaring = dataPengajuan.filter((p) => {
    if (tab !== "semua" && p.status !== tab) return false;
    if (!kataCari) return true;
    return [p.nama, p.noWa, p.kota, p.merek, p.model]
      .filter(Boolean)
      .some((t) => String(t).toLowerCase().includes(kataCari));
  });

  const jumlahHalaman = Math.max(1, Math.ceil(tersaring.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, jumlahHalaman);
  const awal = (halamanAktif - 1) * PER_HALAMAN;
  const tampil = tersaring.slice(awal, awal + PER_HALAMAN);

  const LabelStatus = ({ status }) => {
    const s = STATUS[status] || STATUS.baru;
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 whitespace-nowrap ${s.kelas}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.titik}`} />
        {s.label}
      </span>
    );
  };

  const PilihStatus = ({ p }) => (
    <select
      value={p.status}
      disabled={prosesId === p.id}
      onChange={(e) => perbarui(p.id, { status: e.target.value })}
      className={`h-8 pl-2.5 pr-7 rounded-full text-[11px] font-bold ring-1 border-0 outline-none cursor-pointer appearance-none bg-no-repeat bg-[length:10px] bg-[right_10px_center] disabled:opacity-50 ${
        (STATUS[p.status] || STATUS.baru).kelas
      }`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
      }}
      aria-label="Ubah status"
    >
      {Object.entries(STATUS).map(([nilai, s]) => (
        <option key={nilai} value={nilai}>
          {s.label}
        </option>
      ))}
    </select>
  );

  const TombolAksi = ({ p, kecil }) => {
    const wa = linkWa(p);
    const ukuran = kecil ? "w-8 h-8" : "w-9 h-9";
    return (
      <div className="flex items-center gap-1.5">
        {wa && (
          <a
            href={wa}
            target={wa.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            onClick={() => p.status === "baru" && perbarui(p.id, { status: "dihubungi" })}
            className={`${ukuran} rounded-xl bg-[#22A06B] hover:bg-[#1b8a5b] text-white flex items-center justify-center transition`}
            title="Chat WhatsApp penjual"
            aria-label="Chat WhatsApp"
          >
            <FaWhatsapp className="text-[15px]" />
          </a>
        )}
        <button
          type="button"
          onClick={() => bukaDetail(p)}
          className={`${ukuran} rounded-xl border border-[#EADFD2] bg-white text-gray-600 hover:bg-[#fdf3ee] hover:text-[#8f1117] flex items-center justify-center transition`}
          title="Lihat detail"
          aria-label="Lihat detail"
        >
          <FaEye className="text-[13px]" />
        </button>
        <button
          type="button"
          onClick={() => handleHapus(p)}
          disabled={prosesId === p.id}
          className={`${ukuran} rounded-xl border border-[#EADFD2] bg-white text-[#BE123C] hover:bg-[#BE123C] hover:text-white hover:border-[#BE123C] flex items-center justify-center transition disabled:opacity-50`}
          title="Hapus pengajuan"
          aria-label="Hapus"
        >
          <FaTrashAlt className="text-[11px]" />
        </button>
      </div>
    );
  };

  // Tombol aksi khusus HP: lebih besar & berlabel agar mudah ditekan jari
  const TombolAksiHp = ({ p }) => {
    const wa = linkWa(p);
    return (
      <div className="flex items-center gap-2 mt-3">
        {wa && (
          <a
            href={wa}
            target={wa.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            onClick={() => p.status === "baru" && perbarui(p.id, { status: "dihubungi" })}
            className="flex-1 h-11 rounded-xl bg-[#22A06B] active:bg-[#1b8a5b] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_18px_-10px_rgba(34,160,107,0.9)]"
          >
            <FaWhatsapp className="text-[17px]" /> Chat
          </a>
        )}
        <button
          type="button"
          onClick={() => bukaDetail(p)}
          className="flex-1 h-11 rounded-xl border border-[#EADFD2] bg-white text-gray-700 active:bg-[#fdf3ee] text-[13px] font-bold flex items-center justify-center gap-2"
        >
          <FaEye className="text-[14px] text-[#8f1117]" /> Detail
        </button>
        <button
          type="button"
          onClick={() => handleHapus(p)}
          disabled={prosesId === p.id}
          className="w-11 h-11 shrink-0 rounded-xl border border-[#F5D0D6] bg-[#FFF5F6] text-[#BE123C] active:bg-[#BE123C] active:text-white flex items-center justify-center disabled:opacity-50"
          aria-label="Hapus"
        >
          <FaTrashAlt className="text-[13px]" />
        </button>
      </div>
    );
  };

  const Halaman = () => (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={halamanAktif === 1}
        onClick={() => setHalaman(halamanAktif - 1)}
        className="w-8 h-8 rounded-lg border border-[#EADFD2] flex items-center justify-center text-gray-600 hover:bg-[#fdf3ee] disabled:opacity-40"
        aria-label="Sebelumnya"
      >
        <FaChevronLeft className="text-[10px]" />
      </button>
      {Array.from({ length: jumlahHalaman }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setHalaman(n)}
          className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
            n === halamanAktif
              ? "bg-gradient-to-br from-[#a5161d] to-[#5f0a0d] text-white"
              : "border border-[#EADFD2] text-gray-600 hover:bg-[#fdf3ee]"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={halamanAktif === jumlahHalaman}
        onClick={() => setHalaman(halamanAktif + 1)}
        className="w-8 h-8 rounded-lg border border-[#EADFD2] flex items-center justify-center text-gray-600 hover:bg-[#fdf3ee] disabled:opacity-40"
        aria-label="Berikutnya"
      >
        <FaChevronRight className="text-[10px]" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}
      <div className="flex items-stretch gap-3 mb-5">
        <span className="w-1.5 rounded-full bg-gradient-to-b from-[#E0A82E] to-[#B5791A]" />
        <div>
          <h1 className="text-2xl md:text-[28px] font-black text-[#1c0a0b] tracking-tight leading-tight">
            Pengajuan Jual Mobil
          </h1>
          <p className="text-xs md:text-[13px] text-gray-500 mt-1">
            Daftar pemilik mobil yang ingin menjual mobilnya ke MobilKu.
          </p>
        </div>
      </div>

      {/* ================= KARTU RINGKASAN ================= */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-5">
        {[
          { label: "Total Pengajuan", nilai: dataPengajuan.length, ket: "semua pengajuan", icon: FaInbox, dari: "#b3141c", ke: "#4a080b" },
          { label: "Baru", nilai: jumlah("baru"), ket: "belum dihubungi", icon: FaHourglassHalf, dari: "#E0A82E", ke: "#A86B12" },
          { label: "Dihubungi", nilai: jumlah("dihubungi"), ket: "sedang diproses", icon: FaPhoneAlt, dari: "#3B82F6", ke: "#1D4ED8" },
          { label: "Selesai", nilai: jumlah("selesai"), ket: "sudah ditangani", icon: FaCheckCircle, dari: "#22A06B", ke: "#0F6B4A" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_14px_35px_-24px_rgba(80,30,20,0.4)] p-3 md:p-5 flex items-center gap-2.5 md:gap-4"
            >
              <span
                className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl text-white flex items-center justify-center shadow-[0_10px_20px_-8px_rgba(0,0,0,0.35)]"
                style={{ background: `linear-gradient(135deg, ${s.dari}, ${s.ke})` }}
              >
                <Icon className="text-base md:text-xl" />
              </span>
              <div className="min-w-0 relative z-10">
                <p className="text-[11px] md:text-xs font-bold text-gray-700">{s.label}</p>
                <p className="text-base md:text-2xl font-black text-[#1c0a0b] leading-tight mt-0.5">
                  {isLoading ? "–" : s.nilai}
                </p>
                <p className="text-[10px] md:text-[11px] text-gray-500 mt-0.5 truncate">{s.ket}</p>
              </div>
              <Icon
                className="hidden md:block absolute -right-3 -bottom-3 text-[80px] pointer-events-none"
                style={{ color: `${s.dari}12` }}
              />
            </div>
          );
        })}
      </div>

      {/* ================= CARI & FILTER ================= */}
      <div className="rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_14px_35px_-26px_rgba(80,30,20,0.4)] p-3 md:p-4 mb-5 flex flex-col lg:flex-row lg:items-center gap-3">
        <label className="w-full lg:flex-1 flex items-center gap-2.5 h-11 px-4 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] focus-within:ring-[#D9A85C] transition shrink-0">
          <FaSearch className="text-sm text-gray-400" />
          <input
            type="text"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama penjual, no WA, kota, merek, atau model..."
            className="flex-1 bg-transparent outline-none text-sm text-[#1c0a0b] placeholder:text-gray-400"
          />
          {cari && (
            <button type="button" onClick={() => setCari("")} className="text-gray-400 hover:text-[#8f1117]" aria-label="Hapus pencarian">
              <FaTimes className="text-xs" />
            </button>
          )}
        </label>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] overflow-x-auto">
          {[
            { id: "semua", label: "Semua", n: dataPengajuan.length },
            { id: "baru", label: "Baru", n: jumlah("baru") },
            { id: "dihubungi", label: "Dihubungi", n: jumlah("dihubungi") },
            { id: "selesai", label: "Selesai", n: jumlah("selesai") },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 lg:flex-none px-3 md:px-4 h-9 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                tab === t.id
                  ? "bg-gradient-to-r from-[#8f1117] to-[#4a080b] text-white shadow-[0_8px_16px_-8px_rgba(143,17,23,0.8)]"
                  : "text-gray-600 hover:text-[#8f1117]"
              }`}
            >
              {t.label} <span className="hidden sm:inline opacity-70">({t.n})</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-72">
          <span className="loading loading-spinner loading-lg text-[#8f1117]"></span>
        </div>
      ) : (
        <>
          {/* ================= TABEL (LAPTOP) ================= */}
          <div className="hidden md:block rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_18px_45px_-28px_rgba(80,30,20,0.4)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-600 bg-[#FBF7F2]">
                  <th className="py-3.5 pl-5 pr-3">Penjual</th>
                  <th className="p-3">Mobil</th>
                  <th className="p-3">Tahun / KM</th>
                  <th className="p-3">Harga Diinginkan</th>
                  <th className="p-3">Masuk</th>
                  <th className="p-3">Status</th>
                  <th className="py-3.5 pl-3 pr-5">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((p) => (
                  <tr key={p.id} className="border-t border-[#F3ECE3] transition-colors hover:bg-[#FDFAF6]">
                    <td className="py-3 pl-5 pr-3">
                      <p className="font-extrabold text-[#1c0a0b] text-sm capitalize">{p.nama}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {p.noWa}
                        {p.kota && <span className="capitalize"> · {p.kota}</span>}
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 shrink-0 rounded-lg overflow-hidden ring-1 ring-[#EADFD2] bg-[#F7F3ED] flex items-center justify-center text-[#C9A26A]">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.model} className="w-full h-full object-cover" />
                          ) : (
                            <FaCar />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1c0a0b] text-[13px] truncate capitalize">
                            {p.merek} {p.model}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {[p.transmisi, p.kondisi, p.images?.length ? `${p.images.length} foto` : ""].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[13px] text-gray-600 whitespace-nowrap">
                      {p.tahun} · {formatKm(p.kilometer)}
                    </td>
                    <td className="p-3 text-[13px] font-bold text-[#1c0a0b] whitespace-nowrap">
                      {formatRupiah(p.hargaDiinginkan)}
                    </td>
                    <td className="p-3 text-[12px] text-gray-600 whitespace-nowrap">{tanggalMasuk(p.createdAt)}</td>
                    <td className="p-3">
                      <PilihStatus p={p} />
                    </td>
                    <td className="py-3 pl-3 pr-5">
                      <TombolAksi p={p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tampil.length === 0 && (
              <div className="py-14 text-center border-t border-[#F3ECE3]">
                <FaHandshake className="mx-auto text-3xl text-[#C27C0E] mb-3" />
                <p className="text-sm font-semibold text-gray-500">
                  {dataPengajuan.length === 0 ? "Belum ada pengajuan jual mobil" : "Pengajuan tidak ditemukan"}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-[#F3ECE3]">
              <p className="text-[11px] font-semibold text-gray-500">
                {tersaring.length === 0
                  ? "Tidak ada data"
                  : `Menampilkan ${awal + 1}–${awal + tampil.length} dari ${tersaring.length} pengajuan`}
              </p>
              {jumlahHalaman > 1 && <Halaman />}
            </div>
          </div>

          {/* ================= KARTU (HP) ================= */}
          <div className="flex flex-col gap-3 md:hidden">
            {tampil.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl ring-1 ring-[#EADFD2] shadow-[0_10px_25px_-18px_rgba(80,30,20,0.4)] p-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-16 shrink-0 rounded-xl overflow-hidden ring-1 ring-[#EADFD2] bg-[#F7F3ED] flex items-center justify-center text-[#C9A26A]">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.model} className="w-full h-full object-cover" />
                    ) : (
                      <FaCar className="text-xl" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-extrabold text-[#1c0a0b] text-sm truncate capitalize">
                        {p.merek} {p.model}
                      </p>
                      <LabelStatus status={p.status} />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {p.tahun} · {formatKm(p.kilometer)}
                      {p.transmisi && ` · ${p.transmisi}`}
                    </p>
                    <p className="text-[15px] font-black text-[#8f1117] mt-1">{formatRupiah(p.hargaDiinginkan)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F3ECE3]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-bold text-gray-800 truncate capitalize">{p.nama}</p>
                    <p className="text-[11px] text-gray-400 shrink-0">{tanggalMasuk(p.createdAt)}</p>
                  </div>
                  <TombolAksiHp p={p} />
                </div>
              </div>
            ))}

            {tampil.length === 0 && (
              <div className="py-12 text-center">
                <FaHandshake className="mx-auto text-3xl text-[#C27C0E] mb-3" />
                <p className="text-sm font-semibold text-gray-500">
                  {dataPengajuan.length === 0 ? "Belum ada pengajuan jual mobil" : "Pengajuan tidak ditemukan"}
                </p>
              </div>
            )}

            {jumlahHalaman > 1 && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <p className="text-[11px] font-semibold text-gray-500">
                  {awal + 1}–{awal + tampil.length} dari {tersaring.length}
                </p>
                <Halaman />
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= POPUP DETAIL ================= */}
      {dipilih && (
        <div className="fixed inset-x-0 top-0 bottom-[60px] md:bottom-0 z-[60] flex items-end md:items-center justify-center md:px-4">
          <div onClick={() => setDipilih(null)} className="absolute inset-0 bg-[#1a0507]/55 backdrop-blur-[3px]" />

          <div className="relative w-full md:max-w-2xl max-h-[88%] md:max-h-[90vh] flex flex-col bg-white rounded-t-3xl md:rounded-3xl shadow-[0_30px_70px_-20px_rgba(30,0,0,0.6)] overflow-hidden">
            {/* Header */}
            <div className="relative flex items-start gap-3 px-5 pt-5 pb-4 border-b border-[#F3ECE3] shrink-0">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8f1117] via-[#E0A82E] to-[#5f0a0d]" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#b8893f]">DETAIL PENGAJUAN</p>
                <h3 className="text-lg font-black text-[#1c0a0b] leading-tight capitalize mt-0.5">
                  {dipilih.merek} {dipilih.model} · {dipilih.tahun}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Masuk {tanggalMasuk(dipilih.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setDipilih(null)}
                className="w-8 h-8 shrink-0 rounded-full bg-[#FAF8F5] border border-[#E8E1D9] text-gray-500 flex items-center justify-center hover:bg-[#8f1117] hover:text-white transition"
                aria-label="Tutup"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">
              {/* Foto */}
              {dipilih.images?.length > 0 ? (
                <div>
                  <a href={dipilih.images[fotoAktif]} target="_blank" rel="noreferrer">
                    <img
                      src={dipilih.images[fotoAktif]}
                      alt="foto mobil"
                      className="w-full h-48 md:h-64 object-cover rounded-2xl ring-1 ring-[#EADFD2]"
                    />
                  </a>
                  {dipilih.images.length > 1 && (
                    <div className="flex gap-2 mt-2">
                      {dipilih.images.map((url, i) => (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setFotoAktif(i)}
                          className={`w-16 h-12 rounded-lg overflow-hidden ring-2 transition ${
                            i === fotoAktif ? "ring-[#8f1117]" : "ring-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={url} alt={`foto-${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-24 rounded-2xl bg-[#FBF7F2] ring-1 ring-[#F0E6DA] flex items-center justify-center gap-2 text-[12px] text-gray-400">
                  <FaImage /> Penjual tidak melampirkan foto
                </div>
              )}

              {/* Data mobil */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  ["Harga Diinginkan", formatRupiah(dipilih.hargaDiinginkan)],
                  ["Kilometer", formatKm(dipilih.kilometer)],
                  ["Transmisi", dipilih.transmisi || "—"],
                  ["Kondisi", dipilih.kondisi || "—"],
                  ["Warna", dipilih.warna || "—"],
                  ["Tahun", dipilih.tahun],
                ].map(([label, nilai]) => (
                  <div key={label} className="rounded-xl bg-[#FBF8F4] ring-1 ring-[#F0E6DA] px-3 py-2">
                    <p className="text-[10px] font-semibold text-gray-400">{label}</p>
                    <p className={`text-[13px] font-bold ${["Warna", "Kondisi"].includes(label) ? "capitalize" : ""} ${label === "Harga Diinginkan" ? "text-[#8f1117]" : "text-[#1c0a0b]"}`}>
                      {nilai}
                    </p>
                  </div>
                ))}
              </div>

              {dipilih.deskripsi && (
                <div>
                  <p className="text-[11px] font-bold text-gray-700 mb-1">Deskripsi dari penjual</p>
                  <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line rounded-xl bg-[#FBF8F4] ring-1 ring-[#F0E6DA] px-3 py-2.5">
                    {dipilih.deskripsi}
                  </p>
                </div>
              )}

              {/* Penjual */}
              <div className="rounded-2xl ring-1 ring-[#EADFD2] p-3.5 flex items-center gap-3">
                <span className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-[#F6D47A] flex items-center justify-center font-black text-sm uppercase">
                  {String(dipilih.nama || "?").trim().split(/\s+/).slice(0, 2).map((k) => k[0]).join("")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-[#1c0a0b] truncate capitalize">{dipilih.nama}</p>
                  <p className="text-[12px] text-gray-500 truncate">
                    {dipilih.noWa}
                    {dipilih.kota && (
                      <span className="capitalize">
                        {" "}· <FaMapMarkerAlt className="inline text-[10px] -mt-0.5" /> {dipilih.kota}
                      </span>
                    )}
                  </p>
                </div>
                {linkWa(dipilih) && (
                  <a
                    href={linkWa(dipilih)}
                    target={linkWa(dipilih).startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={() => dipilih.status === "baru" && perbarui(dipilih.id, { status: "dihubungi" })}
                    className="h-10 px-3.5 shrink-0 rounded-xl bg-[#22A06B] hover:bg-[#1b8a5b] text-white text-[12px] font-bold flex items-center gap-1.5 transition"
                  >
                    <FaWhatsapp className="text-base" /> Chat
                  </a>
                )}
              </div>

              {/* Status */}
              <div>
                <p className="text-[11px] font-bold text-gray-700 mb-1.5">Status</p>
                <div className="flex gap-2">
                  {Object.entries(STATUS).map(([nilai, s]) => (
                    <button
                      key={nilai}
                      type="button"
                      disabled={prosesId === dipilih.id}
                      onClick={() => dipilih.status !== nilai && perbarui(dipilih.id, { status: nilai })}
                      className={`flex-1 h-10 rounded-xl text-[12px] font-bold ring-1 transition disabled:opacity-60 ${
                        dipilih.status === nilai ? s.kelas + " ring-2" : "ring-[#EADFD2] text-gray-500 bg-white hover:bg-[#FBF8F4]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catatan admin */}
              <div>
                <p className="text-[11px] font-bold text-gray-700 mb-1.5">Catatan admin (hanya terlihat oleh admin)</p>
                <textarea
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Sudah ditelepon, jadwal cek mobil Sabtu jam 10.00"
                  className="w-full rounded-xl bg-[#FBF8F4] border border-[#EADFD2] px-3 py-2.5 text-[13px] text-[#1c0a0b] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#D9A85C] focus:ring-2 focus:ring-[#D9A85C]/20"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-t border-[#F3ECE3] bg-[#FDFBF8] shrink-0">
              <button
                type="button"
                onClick={() => handleHapus(dipilih)}
                className="h-11 px-4 rounded-xl border border-[#EADFD2] bg-white text-[#BE123C] text-sm font-bold hover:bg-[#BE123C] hover:text-white transition flex items-center gap-2"
              >
                <FaTrashAlt className="text-xs" /> <span className="hidden sm:inline">Hapus</span>
              </button>
              <button
                type="button"
                onClick={() => setDipilih(null)}
                className="ml-auto h-11 px-5 rounded-xl border border-[#EADFD2] bg-white text-gray-700 text-sm font-bold hover:bg-[#FBF8F4] transition"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={prosesId === dipilih.id || catatan === (dipilih.catatan || "")}
                onClick={() => perbarui(dipilih.id, { catatan })}
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white text-sm font-bold disabled:opacity-50 transition"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaPengajuan;
