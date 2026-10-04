import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  FaShieldAlt,
  FaTags,
  FaBolt,
  FaHeadset,
  FaCar,
  FaUser,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaCamera,
  FaTimes,
  FaLock,
  FaExclamationCircle,
} from "react-icons/fa";
import bannerJualMobil from "../assets/banner-jual-mobil.png";

// ==========================================
// PENGATURAN
// ==========================================
const DAFTAR_MEREK = [
  "Toyota", "Honda", "Daihatsu", "Suzuki", "Mitsubishi", "Nissan", "Hyundai",
  "Kia", "Mazda", "Wuling", "Chery", "BYD", "MG", "Isuzu", "Ford", "Chevrolet",
  "DFSK", "Mercedes Benz", "BMW", "Lexus", "Volkswagen", "Mini", "Jeep", "GWM",
  "BAIC", "Lainnya",
];
const MAKS_FOTO = 4;
const MAKS_UKURAN_MB = 5;

// 485000000 -> "485.000.000" (tampilan saja)
const angkaSaja = (v) => String(v ?? "").replace(/\D/g, "");
const pakaiTitik = (v) => {
  const a = angkaSaja(v);
  return a ? Number(a).toLocaleString("id-ID") : "";
};
const rupiahRingkas = (v) => {
  const n = Number(angkaSaja(v)) || 0;
  const f = (x) => x.toLocaleString("id-ID", { maximumFractionDigits: 2 });
  if (n >= 1e9) return `Rp ${f(n / 1e9)} Miliar`;
  if (n >= 1e6) return `Rp ${f(n / 1e6)} Juta`;
  return `Rp ${pakaiTitik(n)}`;
};
// 0812... -> 62812... (untuk link wa.me)
const keNomorWa = (v) => {
  const a = angkaSaja(v);
  if (!a) return "";
  return a.startsWith("62") ? a : "62" + a.replace(/^0/, "");
};

function JualMobil() {
  // ---------- Data mobil ----------
  const [merek, setMerek] = useState("");
  const [model, setModel] = useState("");
  const [tahun, setTahun] = useState("");
  const [warna, setWarna] = useState("");
  const [transmisi, setTransmisi] = useState("");
  const [kilometer, setKilometer] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState([]); // [{ file, url }]

  // ---------- Kontak ----------
  const [namaKontak, setNamaKontak] = useState("");
  const [noHp, setNoHp] = useState("");
  const [kota, setKota] = useState("");

  // ---------- Alur ----------
  const [langkah, setLangkah] = useState(1); // 1 = mobil, 2 = kontak, 3 = terkirim
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waAdmin, setWaAdmin] = useState("");

  // Nomor WhatsApp admin dari pengaturan (untuk tombol "Chat via WhatsApp").
  // Kolom Nama & No. WhatsApp TIDAK diisi otomatis — user mengisi sendiri.
  useEffect(() => {
    axios
      .get("/api/settings")
      .then((response) => {
        const d = response.data || {};
        setWaAdmin((d.settings || d.setting || d.data || d).whatsapp || "");
      })
      .catch(() => {});
  }, []);

  // Bersihkan URL pratinjau foto saat halaman ditutup
  useEffect(() => {
    return () => foto.forEach((f) => URL.revokeObjectURL(f.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollKeForm = () => {
    document
      .getElementById("form-jual-mobil")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // ---------- Foto ----------
  const handlePilihFoto = (e) => {
    const dipilih = Array.from(e.target.files || []);
    e.target.value = "";
    setError("");

    const sisa = MAKS_FOTO - foto.length;
    if (dipilih.length > sisa) {
      setError(`Maksimal ${MAKS_FOTO} foto.`);
    }
    const valid = [];
    for (const file of dipilih.slice(0, Math.max(0, sisa))) {
      if (!file.type.startsWith("image/")) {
        setError("Hanya file gambar yang boleh di-upload.");
        continue;
      }
      if (file.size > MAKS_UKURAN_MB * 1024 * 1024) {
        setError(`Ukuran foto maksimal ${MAKS_UKURAN_MB} MB per foto.`);
        continue;
      }
      valid.push({ file, url: URL.createObjectURL(file) });
    }
    setFoto((f) => [...f, ...valid]);
  };

  const hapusFoto = (index) => {
    setFoto((f) => {
      URL.revokeObjectURL(f[index].url);
      return f.filter((_, i) => i !== index);
    });
  };

  // ---------- Langkah ----------
  const lanjutKeKontak = () => {
    const t = Number(tahun);
    const tahunIni = new Date().getFullYear();
    if (!merek || !model.trim() || !tahun) {
      setError("Merek, model, dan tahun wajib diisi.");
      return;
    }
    if (!t || t < 1970 || t > tahunIni + 1) {
      setError("Tahun produksi tidak valid.");
      return;
    }
    setError("");
    setLangkah(2);
    scrollKeForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (langkah === 1) {
      lanjutKeKontak();
      return;
    }

    const nomor = angkaSaja(noHp);
    if (!namaKontak.trim() || !nomor) {
      setError("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }
    if (nomor.length < 9 || nomor.length > 15) {
      setError("Nomor WhatsApp tidak valid.");
      return;
    }

    const formData = new FormData();
    formData.append("nama", namaKontak);
    formData.append("noWa", noHp);
    formData.append("kota", kota);
    formData.append("merek", merek);
    formData.append("model", model);
    formData.append("tahun", tahun);
    formData.append("warna", warna);
    formData.append("transmisi", transmisi);
    formData.append("kilometer", angkaSaja(kilometer));
    formData.append("kondisi", kondisi);
    formData.append("hargaDiinginkan", angkaSaja(harga));
    formData.append("deskripsi", deskripsi);
    foto.forEach((f) => formData.append("images", f.file));

    setError("");
    setIsSubmitting(true);
    axios
      .post("/api/jual-mobil", formData)
      .then(() => {
        setLangkah(3);
        scrollKeForm();
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Gagal mengirim pengajuan. Coba lagi.",
        );
      })
      .finally(() => setIsSubmitting(false));
  };

  const ulangiForm = () => {
    foto.forEach((f) => URL.revokeObjectURL(f.url));
    setMerek("");
    setModel("");
    setTahun("");
    setWarna("");
    setTransmisi("");
    setKilometer("");
    setKondisi("");
    setHarga("");
    setDeskripsi("");
    setFoto([]);
    setKota("");
    setLangkah(1);
    scrollKeForm();
  };

  // ==========================================
  // TAMPILAN
  // ==========================================
  const kelasInput =
    "w-full h-11 rounded-xl bg-[#FBF8F4] border border-[#EADFD2] px-3.5 text-[14px] font-semibold text-[#1c0a0b] placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:bg-white focus:border-[#D9A85C] focus:ring-2 focus:ring-[#D9A85C]/20 transition";
  const kelasLabel = "block text-[12px] font-bold text-gray-700 mb-1.5";
  const Wajib = () => <span className="text-[#BE123C]">*</span>;

  const Pilihan = ({ nilai, setNilai, opsi }) => (
    <div className="flex gap-2">
      {opsi.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => setNilai(nilai === o ? "" : o)}
          className={`flex-1 h-11 rounded-xl border text-[13px] font-bold transition ${
            nilai === o
              ? "border-[#8f1117] bg-[#8f1117]/[0.06] text-[#8f1117] ring-1 ring-[#8f1117]"
              : "border-[#EADFD2] bg-white text-gray-500 hover:border-[#D9A85C]"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );

  const daftarLangkah = [
    { no: 1, label: "Data Mobil", singkat: "Mobil" },
    { no: 2, label: "Kontak Anda", singkat: "Kontak" },
    { no: 3, label: "Selesai", singkat: "" },
  ];

  const linkWaAdmin = keNomorWa(waAdmin)
    ? `https://wa.me/${keNomorWa(waAdmin)}?text=${encodeURIComponent(
        `Halo MobilKu, saya ${namaKontak} baru saja mengajukan jual mobil ${merek} ${model} ${tahun}. Mohon info selanjutnya, terima kasih.`,
      )}`
    : null;

  return (
    <>
      <Navbar />

      <button
        onClick={scrollKeForm}
        className="block w-full cursor-pointer transition hover:opacity-90"
      >
        <img
          src={bannerJualMobil}
          className="w-full h-auto"
          alt="Jual Mobil di MobilKu"
        />
      </button>

      <div className="bg-[#FBF9F6]">
        <div
          className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-12 md:pb-16 scroll-mt-20"
          id="form-jual-mobil"
        >
          {/* ================= JUDUL ================= */}
          <div className="text-center mb-7 md:mb-9">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#D9A85C]" />
              <p className="text-[10px] md:text-[11px] font-bold tracking-[0.32em] text-[#b8893f]">
                FORM JUAL MOBIL
              </p>
              <span className="h-px w-8 bg-[#D9A85C]" />
            </div>
            <h2
              className="mt-2 text-[26px] md:text-[38px] leading-tight text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Jual Mobil Anda{" "}
              <span className="italic text-[#8f1117]">dalam 2 Langkah</span>
            </h2>
            <p className="mt-2 text-[13px] md:text-sm text-gray-500 max-w-xl mx-auto">
              Isi data mobil &amp; kontak — tim MobilKu menghubungi Anda maks.
              1×24 jam. Gratis, tanpa biaya iklan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
            {/* ================= KARTU FORM ================= */}
            <div className="bg-white rounded-3xl border border-[#F0E6DA] shadow-[0_24px_60px_-30px_rgba(60,10,10,0.45)] overflow-hidden">
              {/* Langkah */}
              <div className="flex items-center gap-2 md:gap-3 px-4 md:px-7 py-3.5 md:py-4 border-b border-[#F1E8DE] bg-[#FCFAF7]">
                {daftarLangkah.map((l, i) => {
                  const selesai = langkah > l.no;
                  const aktif = langkah === l.no;
                  return (
                    <div
                      key={l.no}
                      className={`flex items-center gap-2 ${i < 2 ? "flex-1" : ""}`}
                    >
                      <span
                        className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold ${
                          selesai
                            ? "bg-[#10B981] text-white"
                            : aktif
                              ? "bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-[#F6D47A] shadow-[0_6px_14px_-6px_rgba(143,17,23,0.7)]"
                              : "bg-[#EDE5DB] text-gray-500"
                        }`}
                      >
                        {selesai ? <FaCheck className="text-[10px]" /> : l.no}
                      </span>
                      {l.label && (
                        <span
                          className={`text-[12px] md:text-[13px] font-bold whitespace-nowrap ${
                            aktif ? "text-[#8f1117]" : "text-gray-400"
                          }`}
                        >
                          <span className="md:hidden">{l.singkat}</span>
                          <span className="hidden md:inline">{l.label}</span>
                        </span>
                      )}
                      {i < 2 && (
                        <span
                          className={`flex-1 h-0.5 rounded-full ${
                            selesai || aktif
                              ? "bg-gradient-to-r from-[#8f1117] to-[#E0A82E]"
                              : "bg-[#EDE5DB]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {langkah === 3 ? (
                /* ================= TERKIRIM ================= */
                <div className="px-6 py-10 md:py-14 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#10B981]/10 ring-8 ring-[#10B981]/5 text-[#059669] flex items-center justify-center text-2xl">
                    <FaCheck />
                  </div>
                  <h3
                    className="mt-4 text-2xl md:text-[28px] italic text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Pengajuan Terkirim!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Terima kasih, {namaKontak.split(" ")[0]}. Tim MobilKu akan
                    menghubungi Anda di{" "}
                    <span className="font-bold text-gray-800">{noHp}</span>{" "}
                    maks. 1×24 jam.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto">
                    {linkWaAdmin && (
                      <a
                        href={linkWaAdmin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:flex-1 h-12 shrink-0 rounded-xl bg-[#22A06B] hover:bg-[#1b8a5b] text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                      >
                        <FaWhatsapp className="text-lg" /> Chat via WhatsApp
                      </a>
                    )}
                    <Link
                      to="/"
                      className="w-full sm:flex-1 h-12 shrink-0 rounded-xl border border-[#EADFD2] bg-white text-gray-700 text-sm font-bold flex items-center justify-center hover:bg-[#FBF8F4] transition"
                    >
                      Kembali ke Beranda
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={ulangiForm}
                    className="mt-4 text-[12px] font-semibold text-[#8f1117] hover:underline"
                  >
                    + Ajukan mobil lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {langkah === 1 ? (
                    /* ================= LANGKAH 1: DATA MOBIL ================= */
                    <div className="px-4 md:px-7 pt-5 md:pt-6 pb-2">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="w-8 h-8 rounded-lg bg-[#8f1117]/[0.07] text-[#8f1117] flex items-center justify-center">
                          <FaCar className="text-sm" />
                        </span>
                        <h3 className="text-[15px] font-extrabold text-gray-900">
                          Informasi Data Mobil
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 md:gap-x-4 gap-y-3.5">
                        <div>
                          <label className={kelasLabel}>
                            Merek Mobil <Wajib />
                          </label>
                          <select
                            className={`${kelasInput} pr-8 cursor-pointer`}
                            value={merek}
                            onChange={(e) => setMerek(e.target.value)}
                          >
                            <option value="">Pilih merek</option>
                            {DAFTAR_MEREK.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={kelasLabel}>
                            Model / Tipe <Wajib />
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Avanza G"
                            className={kelasInput}
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={kelasLabel}>
                            Tahun Produksi <Wajib />
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="Contoh: 2021"
                            className={kelasInput}
                            value={tahun}
                            onChange={(e) => setTahun(angkaSaja(e.target.value))}
                          />
                        </div>

                        <div>
                          <label className={kelasLabel}>Warna</label>
                          <input
                            type="text"
                            placeholder="Contoh: Putih"
                            className={kelasInput}
                            value={warna}
                            onChange={(e) => setWarna(e.target.value)}
                          />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                          <label className={kelasLabel}>Transmisi</label>
                          <Pilihan
                            nilai={transmisi}
                            setNilai={setTransmisi}
                            opsi={["Manual", "Automatic"]}
                          />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                          <label className={kelasLabel}>Kilometer</label>
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="Contoh: 50.000"
                              className={`${kelasInput} pr-12`}
                              value={pakaiTitik(kilometer)}
                              onChange={(e) =>
                                setKilometer(angkaSaja(e.target.value))
                              }
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-gray-400 pointer-events-none">
                              km
                            </span>
                          </div>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                          <label className={kelasLabel}>Kondisi Mobil</label>
                          <Pilihan
                            nilai={kondisi}
                            setNilai={setKondisi}
                            opsi={["Baik", "Perlu Servis"]}
                          />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                          <label className={kelasLabel}>
                            Harga yang Diinginkan
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-extrabold text-[#8f1117] pointer-events-none">
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="Contoh: 150.000.000"
                              className={`${kelasInput} pl-11`}
                              value={pakaiTitik(harga)}
                              onChange={(e) => setHarga(angkaSaja(e.target.value))}
                            />
                          </div>
                          {Number(angkaSaja(harga)) >= 1e6 && (
                            <p className="mt-1 text-[11px] text-gray-500">
                              ≈{" "}
                              <span className="font-bold text-[#8f1117]">
                                {rupiahRingkas(harga)}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <label className={kelasLabel}>Deskripsi Singkat</label>
                          <textarea
                            placeholder="Ceritakan kondisi mobil, riwayat servis, kelengkapan dokumen (BPKB, STNK, faktur), dll."
                            className="w-full rounded-xl bg-[#FBF8F4] border border-[#EADFD2] px-3.5 py-3 text-[14px] text-[#1c0a0b] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#D9A85C] focus:ring-2 focus:ring-[#D9A85C]/20 transition"
                            rows={3}
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                          />
                        </div>

                        <div className="col-span-2">
                          <label className={kelasLabel}>
                            Foto Mobil{" "}
                            <span className="font-normal text-gray-400">
                              (opsional, maks. {MAKS_FOTO} foto ·{" "}
                              {MAKS_UKURAN_MB} MB/foto)
                            </span>
                          </label>
                          <div className="rounded-2xl border-[1.5px] border-dashed border-[#D9A85C] bg-[#FFFBF4] p-3 md:p-3.5 flex flex-wrap items-center gap-2.5">
                            {foto.map((f, i) => (
                              <div
                                key={f.url}
                                className="relative w-[72px] h-[54px] md:w-20 md:h-[60px]"
                              >
                                <img
                                  src={f.url}
                                  alt={`foto-${i + 1}`}
                                  className={`w-full h-full object-cover rounded-lg ${
                                    i === 0 ? "ring-2 ring-[#8f1117]" : ""
                                  }`}
                                />
                                {i === 0 && (
                                  <span className="absolute -top-1.5 -left-1.5 bg-[#8f1117] text-white text-[8px] font-bold px-1.5 py-px rounded">
                                    Utama
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => hapusFoto(i)}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center"
                                  aria-label="Hapus foto"
                                >
                                  <FaTimes className="text-[9px]" />
                                </button>
                              </div>
                            ))}

                            {foto.length < MAKS_FOTO && (
                              <label className="w-[72px] h-[54px] md:w-20 md:h-[60px] rounded-lg border-[1.5px] border-dashed border-[#D9A85C] text-[#B5791A] flex flex-col items-center justify-center cursor-pointer hover:bg-white transition">
                                <FaCamera className="text-base" />
                                <span className="text-[9px] font-bold mt-0.5">
                                  Tambah
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={handlePilihFoto}
                                />
                              </label>
                            )}

                            {foto.length === 0 && (
                              <p className="text-[11px] text-gray-500 leading-snug ml-1 flex-1 min-w-[150px]">
                                Foto depan, samping, interior &amp; dashboard
                                membantu penawaran lebih akurat.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ================= LANGKAH 2: KONTAK ================= */
                    <div className="px-4 md:px-7 pt-5 md:pt-6 pb-2">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="w-8 h-8 rounded-lg bg-[#8f1117]/[0.07] text-[#8f1117] flex items-center justify-center">
                          <FaUser className="text-sm" />
                        </span>
                        <h3 className="text-[15px] font-extrabold text-gray-900">
                          Informasi Kontak
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div>
                          <label className={kelasLabel}>
                            Nama Anda <Wajib />
                          </label>
                          <div className="relative">
                            <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#B5791A] pointer-events-none" />
                            <input
                              type="text"
                              placeholder="Nama lengkap"
                              className={`${kelasInput} pl-10`}
                              value={namaKontak}
                              onChange={(e) => setNamaKontak(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={kelasLabel}>
                            Nomor WhatsApp <Wajib />
                          </label>
                          <div className="relative">
                            <FaWhatsapp className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-[#B5791A] pointer-events-none" />
                            <input
                              type="tel"
                              inputMode="tel"
                              placeholder="Contoh: 081234567890"
                              className={`${kelasInput} pl-10`}
                              value={noHp}
                              onChange={(e) => setNoHp(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className={kelasLabel}>Kota</label>
                          <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#B5791A] pointer-events-none" />
                            <input
                              type="text"
                              placeholder="Contoh: Jakarta Selatan"
                              className={`${kelasInput} pl-10`}
                              value={kota}
                              onChange={(e) => setKota(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Ringkasan mobil */}
                      <div className="mt-4 rounded-2xl bg-[#FBF7F2] border border-[#F0E6DA] p-3.5 flex items-start gap-3">
                        {foto[0] ? (
                          <img
                            src={foto[0].url}
                            alt="foto utama"
                            className="w-16 h-12 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <span className="w-16 h-12 rounded-lg bg-white border border-[#EADFD2] text-[#B5791A] flex items-center justify-center shrink-0">
                            <FaCar />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold tracking-[0.15em] text-[#b8893f]">
                            RINGKASAN MOBIL
                          </p>
                          <p className="text-[13px] font-extrabold text-gray-900 truncate">
                            {merek} {model} · {tahun}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {[
                              transmisi,
                              kilometer && `${pakaiTitik(kilometer)} km`,
                              kondisi,
                              warna,
                              foto.length > 0 && `${foto.length} foto`,
                            ]
                              .filter(Boolean)
                              .join(" · ") || "—"}
                          </p>
                          {angkaSaja(harga) && (
                            <p className="text-[13px] font-extrabold text-[#8f1117] mt-0.5">
                              Rp {pakaiTitik(harga)}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setLangkah(1);
                          }}
                          className="text-[11px] font-bold text-[#8f1117] hover:underline shrink-0"
                        >
                          Ubah
                        </button>
                      </div>

                      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500">
                        <FaLock className="text-[10px]" /> Data Anda hanya
                        dipakai tim MobilKu untuk menghubungi Anda.
                      </p>
                    </div>
                  )}

                  {/* Pesan error */}
                  {error && (
                    <div className="mx-4 md:mx-7 mt-3 flex items-start gap-2 rounded-xl bg-red-50 ring-1 ring-red-200 px-3.5 py-2.5 text-[13px] font-semibold text-red-600">
                      <FaExclamationCircle className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Tombol */}
                  <div className="mt-5 flex items-center gap-2.5 px-4 md:px-7 py-4 border-t border-[#F1E8DE] bg-[#FDFBF8]">
                    {langkah === 1 ? (
                      <>
                        <p className="hidden sm:block flex-1 text-[11px] text-gray-500">
                          Kolom bertanda <Wajib /> wajib diisi
                        </p>
                        <button
                          type="submit"
                          className="w-full sm:w-auto sm:px-8 h-12 rounded-xl bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white text-sm font-bold shadow-[0_12px_24px_-12px_rgba(143,17,23,0.9)] hover:from-[#8f1117] hover:to-[#4d0a0d] transition flex items-center justify-center gap-2"
                        >
                          Lanjut ke Kontak <FaArrowRight className="text-xs" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setLangkah(1);
                          }}
                          className="flex-1 sm:flex-none sm:px-6 h-12 rounded-xl border border-[#EADFD2] bg-white text-gray-700 text-sm font-bold hover:bg-[#FBF8F4] transition flex items-center justify-center gap-2"
                        >
                          <FaArrowLeft className="text-xs" /> Kembali
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-[1.6] sm:flex-none sm:ml-auto sm:px-8 h-12 rounded-xl bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white text-sm font-bold shadow-[0_12px_24px_-12px_rgba(143,17,23,0.9)] hover:from-[#8f1117] hover:to-[#4d0a0d] disabled:opacity-60 transition flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            "Kirim Pengajuan"
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* ================= SAMPING ================= */}
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-3xl border border-[#F0E6DA] shadow-[0_24px_60px_-34px_rgba(60,10,10,0.45)] p-5 md:p-6">
                <h3
                  className="text-[19px] italic text-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Kenapa Jual di{" "}
                  <span className="text-[#8f1117]">MobilKu?</span>
                </h3>
                <div className="flex flex-col gap-3.5">
                  {[
                    { Icon: FaShieldAlt, judul: "Aman & Terpercaya", isi: "Data Anda kami jaga kerahasiaannya." },
                    { Icon: FaTags, judul: "Harga Terbaik", isi: "Dapatkan penawaran harga yang kompetitif." },
                    { Icon: FaBolt, judul: "Proses Cepat", isi: "Cukup isi form, tim kami akan menghubungi Anda." },
                    { Icon: FaHeadset, judul: "Tim Support", isi: "Siap membantu Anda setiap saat." },
                  ].map(({ Icon, judul, isi }) => (
                    <div key={judul} className="flex items-start gap-3">
                      <span className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-[#F6D47A] flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(143,17,23,0.7)]">
                        <Icon className="text-sm" />
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-gray-900">
                          {judul}
                        </p>
                        <p className="text-[12px] text-gray-500 leading-snug">
                          {isi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#F0E6DA] shadow-[0_24px_60px_-34px_rgba(60,10,10,0.45)] p-5 md:p-6">
                <p className="text-[11px] font-bold tracking-[0.25em] text-[#b8893f] mb-4">
                  CARA KERJA
                </p>
                <ol className="relative pl-8 space-y-4 before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-0.5 before:bg-gradient-to-b before:from-[#8f1117] before:to-[#E0A82E]">
                  {[
                    ["Isi form ini", "Data mobil & kontak Anda"],
                    ["Kami hubungi", "Via WhatsApp maks. 1×24 jam"],
                    ["Cek mobil", "Inspeksi singkat & penawaran harga"],
                    ["Deal & bayar", "Proses dokumen dibantu tim kami"],
                  ].map(([judul, isi], i) => (
                    <li key={judul} className="relative">
                      <span className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-white border-2 border-[#8f1117] text-[#8f1117] text-[10px] font-extrabold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-[13px] font-bold text-gray-900">
                        {judul}
                      </p>
                      <p className="text-[12px] text-gray-500">{isi}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
export default JualMobil;
