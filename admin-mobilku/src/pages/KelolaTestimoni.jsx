import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import {
  FaStar,
  FaCommentDots,
  FaCheckCircle,
  FaHourglassHalf,
  FaSearch,
  FaTimes,
  FaQuoteRight,
  FaCarSide,
  FaEyeSlash,
  FaCheck,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Jumlah ulasan per halaman
const PER_HALAMAN = 9;

// Waktu dibuat dari ID (ULID) — untuk tanggal ulasan
const HURUF_ULID = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const waktuDariId = (id) => {
  if (typeof id !== "string" || id.length !== 26) return null;
  let ms = 0;
  for (const huruf of id.slice(0, 10).toUpperCase()) {
    const nilai = HURUF_ULID.indexOf(huruf);
    if (nilai === -1) return null;
    ms = ms * 32 + nilai;
  }
  if (ms < Date.UTC(2020, 0, 1) || ms > Date.now() + 86400000) return null;
  return ms;
};

const KelolaTestimoni = () => {
  const [dataTestimoni, setDataTestimoni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");

  const ambilDataTestimoni = () => {
    axios
      .get("/api/testimoni/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDataTestimoni(response.data.testimoni);
        setIsLoading(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || "gagal mengambil data testimoni");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    ambilDataTestimoni();
  }, []);

  const handleToggleAktif = (testimoni) => {
    setActionLoading(true);

    const formData = new FormData();
    formData.append("aktif", !testimoni.aktif);

    axios
      .put(`/api/testimoni/${testimoni.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert(response.data.message);
        ambilDataTestimoni();
        setActionLoading(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || "gagal update testimoni");
        setActionLoading(false);
      });
  };

  const handleHapusTestimoni = (id) => {
    if (window.confirm("Yakin mau hapus testimoni ini?")) {
      setActionLoading(true);
      axios
        .delete(`/api/testimoni/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          ambilDataTestimoni();
          setActionLoading(false);
        })
        .catch((error) => {
          alert(error.response?.data?.message || "gagal hapus testimoni");
          setActionLoading(false);
        });
    }
  };

  // ==========================================
  // TAMPILAN SAJA (cari, filter status, ringkasan)
  // ==========================================
  const [cari, setCari] = useState("");
  const [tab, setTab] = useState("semua");

  const jumlahTayang = dataTestimoni.filter((t) => t.aktif).length;
  const jumlahMenunggu = dataTestimoni.length - jumlahTayang;
  const rataRating = dataTestimoni.length
    ? (
        dataTestimoni.reduce((a, t) => a + (Number(t.rating) || 0), 0) /
        dataTestimoni.length
      ).toLocaleString("id-ID", { maximumFractionDigits: 1 })
    : "0";

  const kataCari = cari.trim().toLowerCase();
  const testimoniTampil = dataTestimoni.filter((t) => {
    if (tab === "tayang" && !t.aktif) return false;
    if (tab === "menunggu" && t.aktif) return false;
    if (!kataCari) return true;
    return [t.namaPelanggan, t.komentar, t.mobilDibeli]
      .filter(Boolean)
      .some((x) => String(x).toLowerCase().includes(kataCari));
  });

  // Pagination
  const [halaman, setHalaman] = useState(1);
  useEffect(() => {
    setHalaman(1);
  }, [cari, tab]);
  const jumlahHalaman = Math.max(1, Math.ceil(testimoniTampil.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, jumlahHalaman);
  const awal = (halamanAktif - 1) * PER_HALAMAN;
  const testimoniHalaman = testimoniTampil.slice(awal, awal + PER_HALAMAN);

  const inisial = (nama) =>
    String(nama || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((k) => k[0])
      .join("")
      .toUpperCase();

  const tanggalMasuk = (t) => {
    const ms = t.createdAt ? new Date(t.createdAt).getTime() : waktuDariId(t.id);
    return ms
      ? new Date(ms).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
      : "";
  };

  const Bintang = ({ nilai }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={`text-[13px] ${n <= Number(nilai) ? "text-[#E0A82E]" : "text-[#E9DFD3]"}`} />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {actionLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      {/* ==================================================
          HEADER HALAMAN
      ================================================== */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="flex items-stretch gap-3">
          <span className="w-1.5 rounded-full bg-gradient-to-b from-[#E0A82E] to-[#B5791A]" />
          <div>
            <h1 className="text-2xl md:text-[28px] font-black text-[#1c0a0b] tracking-tight leading-tight">
              Ulasan Pelanggan
            </h1>
            <p className="text-xs md:text-[13px] text-gray-500 mt-1">
              Setujui ulasan agar tampil di halaman utama, atau sembunyikan yang tidak sesuai.
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 -skew-x-[35deg] mr-2" aria-hidden="true">
          <span className="block w-4 h-12 bg-gradient-to-b from-[#F6D47A] to-[#C9973F] rounded-sm" />
          <span className="block w-3 h-12 bg-gradient-to-b from-[#a5161d] to-[#5f0a0d] rounded-sm" />
        </div>
      </div>

      {/* ==================================================
          KARTU RINGKASAN
      ================================================== */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-5">
        {[
          { label: "Total Ulasan", nilai: dataTestimoni.length, ket: "ulasan masuk", icon: FaCommentDots, dari: "#b3141c", ke: "#4a080b" },
          { label: "Tayang", nilai: jumlahTayang, ket: "tampil di website", icon: FaCheckCircle, dari: "#22A06B", ke: "#0F6B4A" },
          { label: "Menunggu", nilai: jumlahMenunggu, ket: "perlu ditinjau", icon: FaHourglassHalf, dari: "#E0A82E", ke: "#A86B12" },
          { label: "Rata-rata", nilai: rataRating, satuan: "/ 5", ket: "rating pelanggan", icon: FaStar, dari: "#7C3AED", ke: "#4C1D95" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_14px_35px_-24px_rgba(80,30,20,0.4)] p-3 md:p-5 flex items-center gap-2.5 md:gap-4">
              <span className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl text-white flex items-center justify-center shadow-[0_10px_20px_-8px_rgba(0,0,0,0.35)]" style={{ background: `linear-gradient(135deg, ${s.dari}, ${s.ke})` }}>
                <Icon className="text-lg md:text-2xl" />
              </span>
              <div className="min-w-0 relative z-10">
                <p className="text-[11px] md:text-xs font-bold text-gray-700">{s.label}</p>
                <p className="text-base md:text-2xl font-black text-[#1c0a0b] leading-tight mt-0.5">
                  {isLoading ? "–" : s.nilai}
                  {s.satuan && <span className="ml-1 text-xs md:text-sm font-bold text-gray-400">{s.satuan}</span>}
                </p>
                <p className="text-[10px] md:text-[11px] text-gray-500 mt-0.5 truncate">{s.ket}</p>
              </div>
              <Icon className="hidden md:block absolute -right-3 -bottom-3 text-[86px] pointer-events-none" style={{ color: `${s.dari}12` }} />
            </div>
          );
        })}
      </div>

      {/* ==================================================
          PENCARIAN & FILTER
      ================================================== */}
      <div className="rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_14px_35px_-26px_rgba(80,30,20,0.4)] p-3 md:p-4 mb-5 flex flex-col lg:flex-row lg:items-center gap-3">
        <label className="w-full lg:flex-1 flex items-center gap-2.5 h-11 px-4 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] focus-within:ring-[#D9A85C] transition shrink-0">
          <FaSearch className="text-sm text-gray-400" />
          <input type="text" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama, isi ulasan, atau mobil..." className="flex-1 bg-transparent outline-none text-sm text-[#1c0a0b] placeholder:text-gray-400" />
          {cari && (
            <button type="button" onClick={() => setCari("")} className="text-gray-400 hover:text-[#8f1117]" aria-label="Hapus pencarian">
              <FaTimes className="text-xs" />
            </button>
          )}
        </label>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC]">
          {[
            { id: "semua", label: `Semua (${dataTestimoni.length})` },
            { id: "menunggu", label: `Menunggu (${jumlahMenunggu})` },
            { id: "tayang", label: `Tayang (${jumlahTayang})` },
          ].map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`flex-1 lg:flex-none px-4 h-9 rounded-lg text-xs font-bold whitespace-nowrap transition ${tab === t.id ? "bg-gradient-to-r from-[#8f1117] to-[#4a080b] text-white shadow-[0_8px_16px_-8px_rgba(143,17,23,0.8)]" : "text-gray-600 hover:text-[#8f1117]"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg text-[#8f1117]"></span>
        </div>
      ) : testimoniTampil.length === 0 ? (
        <div className="rounded-2xl bg-white ring-1 ring-[#EADFD2] py-14 text-center">
          <FaCommentDots className="mx-auto text-3xl text-[#C27C0E] mb-3" />
          <p className="text-sm font-semibold text-gray-500">
            {dataTestimoni.length === 0 ? "Belum ada testimoni masuk" : "Ulasan tidak ditemukan"}
          </p>
        </div>
      ) : (
        /* ==================================================
            KARTU ULASAN
        ================================================== */
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {testimoniHalaman.map((testimoni) => (
            <div
              key={testimoni.id}
              className={`group relative flex flex-col rounded-[22px] bg-white ring-1 shadow-[0_14px_32px_-24px_rgba(80,30,20,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(95,10,13,0.45)] overflow-hidden ${testimoni.aktif ? "ring-[#EADFD2] hover:ring-[#D9A85C]" : "ring-[#E8C98A]"}`}
            >
              <div className={`absolute top-0 inset-x-0 h-[3px] ${testimoni.aktif ? "bg-gradient-to-r from-[#8f1117] via-[#E0A82E] to-[#5f0a0d]" : "bg-[#E0A82E]"}`} />
              <FaQuoteRight className="absolute bottom-[70px] right-5 text-5xl text-[#8f1117]/[0.05] pointer-events-none" />

              <div className="p-4 md:p-5 flex-1 flex flex-col">
                {/* Pengulas */}
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-[#F6D47A] flex items-center justify-center text-sm font-black ring-2 ring-white shadow-[0_6px_14px_-8px_rgba(0,0,0,0.5)]">
                    {inisial(testimoni.namaPelanggan)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-[#1c0a0b] text-[15px] truncate capitalize">{testimoni.namaPelanggan}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Bintang nilai={testimoni.rating} />
                      <span className="text-[11px] font-bold text-gray-500">{testimoni.rating}/5</span>
                    </div>
                  </div>
                  {testimoni.aktif ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#047857] bg-[#10B981]/10 ring-1 ring-[#10B981]/25 px-2.5 py-1 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Tayang
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8a6326] bg-[#D9A85C]/20 ring-1 ring-[#D9A85C]/50 px-2.5 py-1 rounded-full shrink-0">
                      <FaHourglassHalf className="text-[8px]" /> Menunggu
                    </span>
                  )}
                </div>

                {/* Isi ulasan */}
                <p className="mt-3.5 text-[13px] leading-relaxed text-gray-600 line-clamp-3 min-h-[3.9em]" title={testimoni.komentar}>
                  “{testimoni.komentar}”
                </p>

                {/* Mobil & tanggal */}
                <div className="mt-3.5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 min-w-0 text-[11px] font-bold text-[#8f1117] bg-[#8f1117]/[0.07] px-2.5 py-1 rounded-full">
                    <FaCarSide className="text-[10px] shrink-0" />
                    <span className="truncate capitalize">{testimoni.mobilDibeli || "-"}</span>
                  </span>
                  {tanggalMasuk(testimoni) && (
                    <span className="text-[11px] text-gray-400 shrink-0">{tanggalMasuk(testimoni)}</span>
                  )}
                </div>
              </div>

              {/* Aksi */}
              <div className="flex gap-2 px-4 md:px-5 py-3.5 border-t border-[#F3ECE3] bg-[#FDFBF8]">
                <button
                  className={`btn btn-sm h-9 flex-1 rounded-xl gap-1.5 font-bold ${
                    testimoni.aktif
                      ? "bg-white text-gray-700 border border-[#D9A85C]/50 hover:bg-[#FBF9F6]"
                      : "bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d]"
                  }`}
                  onClick={() => handleToggleAktif(testimoni)}
                >
                  {testimoni.aktif ? (
                    <><FaEyeSlash className="text-[11px]" /> Nonaktifkan</>
                  ) : (
                    <><FaCheck className="text-[11px] text-[#F6D47A]" /> Setujui</>
                  )}
                </button>
                <button
                  className="btn btn-sm h-9 w-9 p-0 bg-white text-[#BE123C] border border-[#EADFD2] hover:bg-[#BE123C] hover:text-white hover:border-[#BE123C] rounded-xl"
                  onClick={() => handleHapusTestimoni(testimoni.id)}
                  aria-label="Hapus"
                  title="Hapus ulasan"
                >
                  <FaTrashAlt className="text-[11px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white ring-1 ring-[#EADFD2] px-4 md:px-5 py-3.5">
          <p className="text-[11px] md:text-xs font-semibold text-gray-500">
            Menampilkan <b className="text-[#1c0a0b]">{awal + 1}–{awal + testimoniHalaman.length}</b> dari{" "}
            <b className="text-[#1c0a0b]">{testimoniTampil.length}</b> ulasan
          </p>
          {jumlahHalaman > 1 && (
            <div className="flex items-center gap-1.5">
              <button type="button" disabled={halamanAktif === 1} onClick={() => setHalaman(halamanAktif - 1)} className="w-9 h-9 rounded-xl border border-[#EADFD2] flex items-center justify-center text-gray-600 hover:bg-[#fdf3ee] disabled:opacity-40 disabled:hover:bg-transparent" aria-label="Sebelumnya">
                <FaChevronLeft className="text-[10px]" />
              </button>
              {Array.from({ length: jumlahHalaman }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" onClick={() => setHalaman(n)} className={`w-9 h-9 rounded-xl text-xs font-bold transition ${n === halamanAktif ? "bg-gradient-to-br from-[#a5161d] to-[#5f0a0d] text-white shadow-[0_6px_14px_-6px_rgba(143,17,23,0.8)]" : "border border-[#EADFD2] text-gray-600 hover:bg-[#fdf3ee]"}`}>
                  {n}
                </button>
              ))}
              <button type="button" disabled={halamanAktif === jumlahHalaman} onClick={() => setHalaman(halamanAktif + 1)} className="w-9 h-9 rounded-xl border border-[#EADFD2] flex items-center justify-center text-gray-600 hover:bg-[#fdf3ee] disabled:opacity-40 disabled:hover:bg-transparent" aria-label="Berikutnya">
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default KelolaTestimoni;
