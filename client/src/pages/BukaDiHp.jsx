import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import png1 from "../assets/handsome1.png";
import png3 from "../assets/handsome2.png";

import playstore from "../assets/playstore.webp";
import appstore from "../assets/appstore.webp";

import {
  FaBolt,
  FaShieldAlt,
  FaMobileAlt,
  FaCarSide,
  FaUserCheck,
  FaWhatsapp,
  FaHandHoldingUsd,
  FaMedal,
  FaTags,
  FaFileSignature,
  FaHandshake,
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaArrowRight,
} from "react-icons/fa";

// ======================================================
// 3 KEUNGGULAN
// ======================================================

const keunggulan = [
  {
    Icon: FaBolt,
    judul: "Lebih Cepat",
    teks: "Cari mobil jadi lebih mudah",
  },
  {
    Icon: FaShieldAlt,
    judul: "Lebih Aman",
    teks: "Transaksi terpercaya & terverifikasi",
  },
  {
    Icon: FaMobileAlt,
    judul: "Lebih Praktis",
    teks: "Semua dalam satu genggaman",
  },
];

// ======================================================
// 4 FITUR
// ======================================================

const fitur = [
  {
    Icon: FaCarSide,
    judul: "Informasi Lengkap",
    teks: "Foto, harga, tahun, dan spesifikasi mobil tersaji jelas dalam satu halaman.",
  },
  {
    Icon: FaUserCheck,
    judul: "Penjual Terpercaya",
    teks: "Setiap mobil diperiksa dan dikelola langsung oleh tim MobilKu.",
  },
  {
    Icon: FaWhatsapp,
    judul: "Chat via WhatsApp",
    teks: "Tanya detail atau atur jadwal lihat mobil langsung lewat WhatsApp.",
  },
  {
    Icon: FaHandHoldingUsd,
    judul: "Jual Mobil Mudah",
    teks: "Ingin menjual mobil? Ajukan dari HP Anda, tim kami siap membantu.",
  },
];

// ======================================================
// JAMINAN
// ======================================================

const jaminan = [
  {
    Icon: FaMedal,
    judul: "Mobil Pilihan Berkualitas",
    teks: "Kondisi terawat & siap pakai",
  },
  {
    Icon: FaTags,
    judul: "Harga Transparan",
    teks: "Tanpa biaya tersembunyi",
  },
  {
    Icon: FaFileSignature,
    judul: "Dokumen Legal",
    teks: "BPKB & STNK lengkap",
  },
  {
    Icon: FaHandshake,
    judul: "Proses Mudah & Cepat",
    teks: "Dibantu sampai serah terima",
  },
];


// ======================================================
// SOCIAL MEDIA
// (link diambil dari admin panel lewat /api/settings)
// ======================================================

const sosialMedia = [
  {
    nama: "Facebook",
    username: "MobilKu Indonesia",
    Icon: FaFacebookF,
    kunci: "facebookUrl",
    iconBg: "bg-[#1877F2]",
    accent: "from-[#1877F2] to-[#0f5fc4]",
  },
  {
    nama: "Instagram",
    username: "@mobilku.id",
    Icon: FaInstagram,
    kunci: "instagramUrl",
    iconBg:
      "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    accent: "from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
  },
  {
    nama: "Telegram",
    username: "MobilKu Official",
    Icon: FaTelegramPlane,
    kunci: "telegramUrl",
    iconBg: "bg-[#229ED9]",
    accent: "from-[#229ED9] to-[#1686bc]",
  },
  {
    nama: "WhatsApp",
    username: "Chat MobilKu",
    Icon: FaWhatsapp,
    kunci: "whatsapp",
    iconBg: "bg-[#25D366]",
    accent: "from-[#25D366] to-[#159447]",
  },
];

// Ubah data dari admin menjadi link yang bisa diklik
const buatLink = (kunci, settings) => {
  const nilai = String(settings?.[kunci] || "").trim();
  if (!nilai) return "";

  // WhatsApp: nomor 08xx -> https://wa.me/628xx
  if (kunci === "whatsapp") {
    const nomor = nilai.replace(/\D/g, "").replace(/^0/, "62");
    return nomor ? `https://wa.me/${nomor}` : "";
  }

  return /^https?:\/\//i.test(nilai) ? nilai : `https://${nilai}`;
};

// ======================================================
// FRAME HP
// ======================================================

function BingkaiHp({ src, alt, className = "" }) {
  return (
    <div
      className={`
        relative
        bg-gradient-to-br
        from-[#f2f3f5]
        via-[#73767d]
        to-[#dfe1e5]
        p-[1.1%]
        shadow-[0_25px_60px_rgba(60,5,8,0.28)]
        ${className}
      `}
      style={{ borderRadius: "15% / 7%" }}
    >
      {/* Tombol Samping */}
      <span className="absolute -left-[0.9%] top-[17%] h-[5%] w-[1.3%] rounded-l bg-gradient-to-r from-[#6c6f75] to-[#c9cbd0]" />
      <span className="absolute -left-[0.9%] top-[25%] h-[9%] w-[1.3%] rounded-l bg-gradient-to-r from-[#6c6f75] to-[#c9cbd0]" />
      <span className="absolute -left-[0.9%] top-[36%] h-[9%] w-[1.3%] rounded-l bg-gradient-to-r from-[#6c6f75] to-[#c9cbd0]" />
      <span className="absolute -right-[0.9%] top-[28%] h-[13%] w-[1.3%] rounded-r bg-gradient-to-l from-[#6c6f75] to-[#c9cbd0]" />

      {/* Bezel */}
      <div
        className="bg-black p-[2.8%]"
        style={{ borderRadius: "14.2% / 6.6%" }}
      >
        <div
          className="relative aspect-[9/19.5] overflow-hidden bg-white"
          style={{ borderRadius: "11.5% / 5.3%" }}
        >
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover object-top"
          />

          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[1.5%] h-[3.8%] w-[30%] -translate-x-1/2 rounded-full bg-black" />

          {/* Glass Reflection */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-white/0 to-white/0" />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function BukaDiHp() {
  // ===== Ambil link media sosial dari admin =====
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get("/api/settings")
      .then((response) => setSettings(response.data.settings || {}))
      .catch((error) => {
        console.log(error);
        setSettings({});
      });
  }, []);

  // Hanya tampilkan kartu yang link-nya sudah diisi di admin
  const daftarSosmed = sosialMedia
    .map((item) => ({ ...item, href: buatLink(item.kunci, settings) }))
    .filter((item) => item.href);


    // Link aplikasi dari admin ("" kalau belum diisi)
  const playStoreUrl = buatLink("playStoreUrl", settings);
  const appStoreUrl = buatLink("appStoreUrl", settings);

  return (
    <>
      <Navbar />

      {/* BANNER UTAMA */}
      <section className="relative isolate overflow-hidden bg-[#faf8f6]">
        {/* Background Maroon Glow */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#8f1117]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-10 h-[600px] w-[600px] rounded-full bg-[#b3141c]/10 blur-3xl" />

        {/* Top Accent Line */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#8f1117]/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
            
            {/* ==================================================
                SISI KIRI: SESUAI GAMBAR REFERENSI
            ================================================== */}
            <div className="relative z-20 text-center lg:text-left">
              
              {/* Tagline Atas */}
              <p className="text-[11px] font-black tracking-[0.3em] text-[#8f1117] uppercase md:text-xs">
                CARI &bull; PILIH &bull; MILIKI
              </p>

              {/* Headline */}
              <h1 className="mt-2 text-[32px] font-extrabold leading-[1.12] tracking-tight text-gray-900 sm:text-[40px] md:text-[46px] lg:text-[50px]">
                Akses Mobil Impian{" "}
                <span className="block bg-gradient-to-r from-[#7d0d12] via-[#b3141c] to-[#d62828] bg-clip-text text-transparent">
                  Kapan Saja, Di Mana Saja
                </span>
              </h1>

              {/* Deskripsi Teks */}
              <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-gray-700 md:text-[15px] lg:mx-0">
                Nikmati kemudahan mencari, melihat detail, hingga menghubungi penjual langsung melalui aplikasi Mobilku. Semua kebutuhan mobil bekas berkualitas, kini ada di genggaman Anda.
              </p>

              {/* 3 Keunggulan Cards */}
              <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                {keunggulan.map(({ Icon, judul, teks }) => (
                  <div
                    key={judul}
                    className="rounded-2xl border border-gray-200/80 bg-white/90 p-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#8f1117]/30 hover:shadow-md lg:text-left"
                  >
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#b3141c] to-[#690b0f] text-white shadow-sm lg:mx-0">
                      <Icon className="text-xs" />
                    </span>
                    <p className="mt-2 text-[12px] font-bold text-gray-900 sm:text-[13px]">
                      {judul}
                    </p>
                    <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-[11px]">
                      {teks}
                    </p>
                  </div>
                ))}
              </div>

                            {/* Store Badges (link dari admin) */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <a
                  href={playStoreUrl || "#"}
                  target={playStoreUrl ? "_blank" : undefined}
                  rel={playStoreUrl ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!playStoreUrl) e.preventDefault();
                  }}
                  aria-label="Download MobilKu di Google Play"
                  className={`inline-block transition ${
                    playStoreUrl ? "hover:opacity-90" : "cursor-default"
                  }`}
                >
                  <img
                    src={playstore}
                    alt="Get it on Google Play"
                    className="h-10 w-auto sm:h-11"
                  />
                </a>
                <a
                  href={appStoreUrl || "#"}
                  target={appStoreUrl ? "_blank" : undefined}
                  rel={appStoreUrl ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!appStoreUrl) e.preventDefault();
                  }}
                  aria-label="Download MobilKu di App Store"
                  className={`inline-block transition ${
                    appStoreUrl ? "hover:opacity-90" : "cursor-default"
                  }`}
                >
                  <img
                    src={appstore}
                    alt="Download on App Store"
                    className="h-10 w-auto sm:h-11"
                  />
                </a>
              </div>

            </div>

            {/* ==================================================
                SISI KANAN: MOCKUP HP
            ================================================== */}
            <div className="relative flex min-h-[340px] items-center justify-center lg:min-h-[520px]">
              {/* Red Glow Background */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8f1117]/15 blur-3xl" />

              <div className="relative flex w-full max-w-[540px] items-center justify-center py-6">
                {/* HP Depan */}
                <BingkaiHp
                  src={png1}
                  alt="Tampilan aplikasi MobilKu"
                  className="z-20 -mr-[6%] w-[45%] -rotate-[6deg] translate-y-[6%] drop-shadow-[0_25px_30px_rgba(60,5,8,0.35)]"
                />

                {/* HP Belakang */}
                <BingkaiHp
                  src={png3}
                  alt="Katalog mobil MobilKu"
                  className="z-10 w-[45%] rotate-[6deg] -translate-y-[6%] drop-shadow-[0_20px_25px_rgba(60,5,8,0.25)]"
                />

                {/* Floating Badge */}
                <div className="absolute right-[2%] top-[14%] z-30 hidden rounded-2xl border border-gray-100 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-sm md:block">
                  <p className="text-[10px] font-bold tracking-wider text-[#8f1117]">
                    MOBIL PILIHAN
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-gray-800">
                    Dalam Genggaman
                  </p>
                </div>
              </div>

              {/* Shadow Bawah HP */}
              <div className="pointer-events-none absolute bottom-2 left-1/2 h-8 w-[50%] -translate-x-1/2 rounded-[100%] bg-black/15 blur-2xl" />
            </div>

          </div>

          {/* ==================================================
              TRUST BAR
          ================================================== */}
        <div className="relative z-30 mt-6 md:mt-12 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#5d090d] via-[#8f1117] to-[#5d090d] shadow-[0_20px_40px_rgba(95,10,13,0.25)]">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {jaminan.map(({ Icon, judul, teks }, index) => (
                <div
                  key={judul}
                  className={`flex items-center gap-3 px-4 py-5 md:px-6 ${
                    index !== 0
                      ? "border-t border-white/10 lg:border-l lg:border-t-0"
                      : ""
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                    <Icon className="text-sm" />
                  </span>
                  <div>
                    <p className="text-[12px] font-bold leading-snug text-white md:text-[13px]">
                      {judul}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-snug text-white/70">
                      {teks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION FITUR
      ================================================== */}
     <section className="bg-white pt-1 pb-6 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="text-center">
            <p className="text-[11px] font-bold tracking-[0.35em] text-[#8f1117]">
              KENAPA MOBILKU
            </p>
            <h2 className="mt-2 text-[25px] font-bold text-gray-900 md:text-[32px]">
              Semua yang Anda Butuhkan
            </h2>
            <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-[#8f1117]" />
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {fitur.map(({ Icon, judul, teks }) => (
              <div
                key={judul}
                className="group rounded-3xl border border-gray-100 bg-[#FBF9F6] p-5 transition duration-300 hover:-translate-y-1 hover:border-gray-200 hover:bg-white hover:shadow-[0_20px_45px_-20px_rgba(95,10,13,0.25)] md:p-6 space-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#b3141c] to-[#690b0f] text-white shadow-md shadow-[#8f1117]/20 transition group-hover:scale-105">
                  <Icon className="text-lg" />
                </span>
                <h3 className="mt-4 text-[14px] font-bold text-gray-900 md:text-base">
                  {judul}
                </h3>
                <p className="mt-2 text-[11px] leading-relaxed text-gray-500 md:text-[13px]">
                  {teks}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* =========================
    SOCIAL MEDIA (UPGRADED)
    - link diambil dari admin panel
    - kartu yang link-nya kosong otomatis disembunyikan
    - kalau semua kosong, section ini tidak tampil
========================= */}
{daftarSosmed.length > 0 && (
<section className="relative overflow-hidden bg-[#FBF9F6] pt-3 pb-6 md:pt-20 md:pb-12">

  {/* Background Glow */}
  <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#8f1117]/5 blur-3xl" />
  <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#D9A85C]/10 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-5 md:px-10">

    {/* HEADER */}
    <div className="text-center max-w-2xl mx-auto">

      <div className="flex justify-center items-center gap-3">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D9A85C]" />
        <span className="h-2 w-2 rotate-45 bg-[#D9A85C]" />
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D9A85C]" />
      </div>

<p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.4em] text-red-700">
        TEMUKAN KAMI DI
      </p>

      <h2 className="mt-3 text-[36px] md:text-[42px] font-semibold text-[#5f0a0d] font-[Playfair_Display] tracking-tight">
        Media Sosial
      </h2>

      <p className="mt-4 text-[15px] leading-relaxed text-black max-w-xl mx-auto">
        Ikuti MobilKu untuk mendapatkan informasi terbaru,
        promo menarik, dan update stok mobil setiap hari.
      </p>
    </div>


    {/* CARDS */}
    {/* HP: kartu memanjang (ikon kiri, teks tengah, panah kanan)
        Laptop: kartu tinggi seperti sebelumnya */}
    <div className="mt-10 md:mt-12 flex flex-wrap justify-center gap-3 lg:gap-5">

      {daftarSosmed.map(({ nama, username, Icon, href, iconBg, accent }) => (
        <a
          key={nama}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group relative overflow-hidden
            flex items-center gap-4
            w-full md:w-[calc(50%-6px)] lg:w-[calc(25%-15px)]
            lg:block
            rounded-[22px] lg:rounded-[26px]
            border border-gray-200/60

            bg-gradient-to-br from-white via-[#f8f8f8] to-[#eeeeee]

            p-4 lg:p-6 text-left

            shadow-[0_10px_30px_rgba(0,0,0,0.07)] lg:shadow-[0_15px_40px_rgba(0,0,0,0.08)]
            transition-all duration-500

            hover:-translate-y-1 lg:hover:-translate-y-3
            hover:shadow-[0_30px_60px_rgba(95,10,13,0.2)]
          "
        >

          {/* FOLLOW LABEL (laptop saja) */}
          <span className="absolute right-5 top-5 hidden lg:block text-[10px] font-semibold tracking-widest text-gray-400">
            FOLLOW US
          </span>

          {/* ICON */}
          <div
            className={`
              relative z-10 shrink-0
              flex h-14 w-14 lg:h-20 lg:w-20 items-center justify-center
              rounded-2xl lg:rounded-3xl
              text-white
              shadow-[0_10px_22px_rgba(0,0,0,0.15)]
              ${iconBg}

              transition-all duration-500
              group-hover:scale-110
              group-hover:-rotate-3
            `}
          >
            <Icon className="text-2xl lg:text-3xl" />
          </div>

          {/* TEKS */}
          <div className="relative z-10 min-w-0 flex-1">
            {/* TITLE */}
            <h3 className="lg:mt-5 text-[16px] lg:text-[18px] font-semibold text-[#5f0a0d]">
              {nama}
            </h3>

            {/* USERNAME */}
            <p className="mt-0.5 lg:mt-1 truncate text-[12.5px] lg:text-[13px] font-medium text-gray-600 lg:text-black">
              {username}
            </p>

            {/* DESKRIPSI (laptop saja) */}
            <p className="mt-3 hidden lg:block text-[13.5px] leading-relaxed text-black">
              {nama === "Facebook" &&
                "Dapatkan update terbaru seputar mobil, promo dan event menarik."}
              {nama === "Instagram" &&
                "Lihat koleksi mobil terbaru dan konten menarik dari MobilKu."}
              {nama === "Telegram" &&
                "Informasi cepat dan update stok langsung dari channel resmi kami."}
              {nama === "WhatsApp" &&
                "Chat langsung untuk tanya mobil atau booking dengan tim kami."}
            </p>
          </div>

          {/* BUTTON */}
          <div className="relative z-10 shrink-0 lg:mt-6">
            <span
              className="
                flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center
                rounded-full
                bg-gradient-to-br from-[#b3141c] to-[#690b0f]
                text-white
                shadow-lg

                transition-all duration-500
                group-hover:scale-110
                group-hover:translate-x-1
              "
            >
              <FaArrowRight className="text-xs lg:text-sm" />
            </span>
          </div>

          {/* ACCENT DIAGONAL */}
          <div className="absolute bottom-0 right-0 h-full w-24 lg:h-32 lg:w-32 overflow-hidden">
            <div
              className={`
                absolute bottom-0 right-0 h-full w-full
                bg-gradient-to-tr ${accent}
                opacity-90
                clip-path-diagonal
              `}
            />
          </div>

        </a>
      ))}

    </div>

  </div>
</section>
)}
      <Footer />
    </>
  );
}

export default BukaDiHp;