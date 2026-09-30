import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import bgBannerMobil from "../assets/mobilgacor.jpg";
import ShowroomMap from "../components/ShowroomMap";
import TestimoniForm from "../components/TestimoniForm";
import TestimoniSlider from "../components/TestimoniSlider";
import premiumBanner from "../assets/premium-banner.jpg";

import {
  FaCar,
  FaPlus,
  FaSearch,
  FaFileAlt,
  FaTags,
  FaBolt,
  FaUserTie,
} from "react-icons/fa";

import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import FaqItem from "../components/FaqItem.jsx";
import Footer from "../components/Footer.jsx";
import MobilCard from "../components/MobilCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import axios from "../api/axiosInstance";

// Import Gambar/Assets
import byd from "../assets/byd.png";
import mercedesbenz from "../assets/mercedesbenz.png";
import hyundai from "../assets/hyundai.png";
import mitsubishi from "../assets/mitsubishi.png";
import chevrolet from "../assets/chevrolet.png";
import nissan from "../assets/nissan.png";
import suzuki from "../assets/suzuki.png";
import isuzu from "../assets/isuzu.png";
import logomazda from "../assets/logomazda.png";
import volkswagen from "../assets/volkswagen.png";
import bmw from "../assets/bmw.png";
import mini from "../assets/mini.png";
import kia from "../assets/kia.png";
import lexus from "../assets/lexus.png";
import dfsk from "../assets/dfsk.png";
import ford from "../assets/ford.png";
import mg from "../assets/mg.png";
import jeep from "../assets/jeep.png";
import wuling from "../assets/wuling.png";
import landrover from "../assets/landrover.png";
import audi from "../assets/audi.png";
import Honda from "../assets/Honda.png";
import tesla from "../assets/tesla.png";
import toyota from "../assets/toyota.png";

import kualitasterbaik from "../assets/kualitasterbaik.png";
import dokumenterbaiik from "../assets/dokumenterbaiik.jpg";
import hargaterbaik from "../assets/hargaterbaik.png";
import customersenang from "../assets/customersenang.jpg";
import bantuantimahli from "../assets/bantuantimahli.png";

// --- DATA STATIS ---
const dataFeature = [
  {
    image: kualitasterbaik,
    Icon: FaSearch,
    judul: "Kualitas Terjamin",
    deskripsi: "Setiap mobil melalui pemeriksaan menyeluruh sebelum dijual",
  },
  {
    image: dokumenterbaiik,
    Icon: FaFileAlt,
    judul: "Dokumen Lengkap & Legal",
    deskripsi: "Surat-surat kendaraan asli, lengkap, dan aman",
  },
  {
    image: hargaterbaik,
    Icon: FaTags,
    judul: "Harga Transparan",
    deskripsi: "Harga jujur tanpa biaya tersembunyi",
  },
  {
    image: customersenang,
    Icon: FaBolt,
    judul: "Proses Mudah & Cepat",
    deskripsi: "Transaksi jual beli mobil bekas jadi lebih praktis",
  },
  {
    image: bantuantimahli,
    Icon: FaUserTie,
    judul: "Bantuan Tim Ahli",
    deskripsi: "Tim kami siap membantu memilih mobil sesuai kebutuhan Anda",
  },
];

const dataFaq = [
  {
    pertanyaan: "Apakah biaya balik nama sudah termasuk saat saya membeli mobil di MobilKu?",
    jawaban: "Anda dapat melakukan balik nama pada mobil yang sudah dibeli, namun biaya balik nama tidak ditanggung oleh pihak MobilKu dan menjadi tanggung jawab pembeli.",
  },
  {
    pertanyaan: "Apakah MobilKu menanggung biaya pajak tahunan mobil yang saya beli?",
    jawaban: "Pajak kendaraan menjadi tanggung jawab pembeli setelah proses serah terima selesai. Pastikan untuk mengecek masa berlaku pajak sebelum melakukan pembelian.",
  },
  {
    pertanyaan: "Bagaimana saya tahu pembayaran saya aman dilakukan ke MobilKu?",
    jawaban: "Semua transaksi resmi MobilKu hanya dilakukan melalui rekening dan metode pembayaran yang tertera resmi di website kami. Jika menemukan nomor rekening yang berbeda dari yang tertera, segera hubungi Customer Service kami. Waspadalah terhadap skema penipuan dan jangan bagikan informasi sensitif Anda kepada siapa pun.",
  },
  {
    pertanyaan: "Mengapa harus membeli mobil di MobilKu?",
    jawaban: "Kami menawarkan mobil bekas pilihan yang telah melalui pemeriksaan kualitas dan kelengkapan dokumen, dengan harga transparan dan proses yang mudah, sehingga Anda bisa membeli dengan lebih tenang.",
  },
];

const merekPopuler = [
  { name: "Byd", logo: byd },
  { name: "Mercedes-Benz", logo: mercedesbenz },
  { name: "Hyundai", logo: hyundai },
  { name: "Toyota", logo: toyota },
  { name: "Mitsubishi", logo: mitsubishi },
  { name: "Chevrolet", logo: chevrolet },
  { name: "Suzuki", logo: suzuki },
  { name: "Nissan", logo: nissan },
  { name: "Isuzu", logo: isuzu },
  { name: "Mazda", logo: logomazda },
  { name: "Dfsk", logo: dfsk },
  { name: "Ford", logo: ford },
  { name: "MG", logo: mg },
  { name: "Jeep", logo: jeep },
  { name: "Volkswagen", logo: volkswagen },
  { name: "Bmw", logo: bmw },
  { name: "Mini", logo: mini },
  { name: "Kia", logo: kia },
  { name: "Lexus", logo: lexus },
  { name: "Wuling", logo: wuling },
  { name: "Land Rover", logo: landrover },
  { name: "Audi", logo: audi },
  { name: "Honda", logo: Honda },
  { name: "Tesla", logo: tesla },
];

const half = Math.ceil(merekPopuler.length / 2);
const barisA = merekPopuler.slice(0, half);
const barisB = merekPopuler.slice(half);



const getBrandLogo = (namaMerek) => {
  const normalize = (str) => (str || "").toLowerCase().replace(/[\s-]/g, "");
  const found = merekPopuler.find(
    (m) => normalize(m.name) === normalize(namaMerek)
  );
  return found ? found.logo : null;
};

function Home() {
  const [dataMobil, setDataMobil] = useState([]);
  const [dataKategori, setDataKategori] = useState([]);
  const [, setLoading] = useState(true);

  // Ref untuk mengontrol scroll slider
  const kategoriSliderRef = useRef(null);
  const brandRowRefs = useRef([]);

  const handleScroll = (ref, offset) => {
    if (ref && ref.current) {
      ref.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resMobil, resKategori] = await Promise.all([
          axios.get("/api/mobil"),
          axios.get("/api/categories"),
        ]);
        setDataMobil(resMobil.data?.mobil || []);
        setDataKategori(resKategori.data?.categories || []);
      } catch (error) {
        console.error("Gagal memuat data halaman utama:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (icon) => {
    if (!icon) return "";
    if (icon.startsWith("http")) return icon;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return `${baseUrl}${icon.startsWith("/") ? "" : "/"}${icon}`;
  };

 // Ambil maksimal 3 merek yang masih memiliki stok
const topMerekList = (() => {
  const kelompok = {};

  dataMobil.forEach((mobil) => {
    // Hanya masukkan mobil yang masih tersedia
    const stok = Number(mobil.stok ?? 1);

    if (stok <= 0) return;

    const merek = mobil.merek?.trim() || "Lainnya";

    if (!kelompok[merek]) {
      kelompok[merek] = [];
    }

    kelompok[merek].push(mobil);
  });

  return Object.entries(kelompok)
    // Merek dengan jumlah mobil terbanyak berada di atas
    .sort((a, b) => b[1].length - a[1].length)
    // Hanya tampilkan 3 merek
    .slice(0, 3);
})();

  return (
    <>
      <Navbar />
      <div className="relative">
        <Hero />
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 -mt-16 sm:-mt-20 md:-mt-28 mb-10 md:mb-14" />
      </div>

      {/* Section Kategori */}
      {dataKategori.length > 0 && (
        <section className="max-w-7xl mx-auto mt-20 md:mt-40 px-4 md:px-6">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-[#8B1A1A] text-base md:text-lg font-semibold tracking-[0.25em] mb-3">
              — PILIH KATEGORI —
            </p>
            <h2 className="text-2xl md:text-4xl font-serif font-medium text-gray-900 leading-snug">
              Cari Berdasarkan <span className="text-[#C9A227] font-medium">Kategori</span> Mobil
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-12 h-[1px] bg-[#C9A227]/60"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A227]"></div>
              <div className="w-12 h-[1px] bg-[#C9A227]/60"></div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => handleScroll(kategoriSliderRef, -280)}
              className="absolute -left-3 sm:-left-6 md:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-amber-300 shadow-md flex items-center justify-center text-xl hover:bg-amber-50 hover:border-amber-500 transition"
              aria-label="Previous Category"
            >
              ‹
            </button>

            <button
              onClick={() => handleScroll(kategoriSliderRef, 280)}
              className="absolute -right-3 sm:-right-6 md:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-amber-300 shadow-md flex items-center justify-center text-xl hover:bg-amber-50 hover:border-amber-500 transition"
              aria-label="Next Category"
            >
              ›
            </button>

            <div
              ref={kategoriSliderRef}
              className="flex gap-4 md:gap-5 overflow-x-auto pb-2 px-2 scrollbar-hide snap-x snap-mandatory"
            >
              {dataKategori.map((kategori) => (
                <div
                  key={kategori.id}
                  className="min-w-[140px] sm:min-w-[150px] md:min-w-[160px] flex-shrink-0 snap-start"
                >
                  <CategoryCard
                    name={kategori.name}
                    logo={getImageUrl(kategori.icon)}
                    categoryId={kategori.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Mobil Rekomendasi */}
      <section className="max-w-7xl mx-auto mt-6 md:mt-20 px-4 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-[#8B1A1A] text-[15px] md:text-[16px] font-bold uppercase tracking-[0.25em] mb-3">
            — Rekomendasi Kami —
          </p>
          <h2 className="text-2xl md:text-4xl font-serif font-medium text-gray-900 leading-snug">
            Mobil Pilihan <span className="text-[#C9A227] font-medium">Terbaik</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4 mb-3">
            <div className="w-12 h-[1px] bg-[#C9A227]/60"></div>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A227]"></div>
            <div className="w-12 h-[1px] bg-[#C9A227]/60"></div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {topMerekList.map(([merek, mobilMerek], i) => (
            <div key={merek}>
             
<div className="flex items-center gap-2.5 md:gap-3 mb-2.5 md:mb-4">
             {getBrandLogo(merek) && (
  <img
    src={getBrandLogo(merek)}
    alt={merek}
    className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 object-contain"
  />
)}

                <h3 className="font-serif text-base md:text-xl font-semibold text-gray-900 whitespace-nowrap -ml-2 md:-ml-1.5">
                {merek}
                </h3>

                <span className="flex-1 h-px bg-gradient-to-r from-[#C9A227] to-transparent"></span>

                <Link
                  to={`/katalog?merek=${encodeURIComponent(merek)}`}
                  className="flex-shrink-0 text-[#8f1117] text-xs md:text-sm font-bold hover:text-[#5f0a0d] transition-colors duration-300 whitespace-nowrap"
                >
                  Lihat Semua →
                </Link>
              </div>



              <div className="relative">
                <button
                  onClick={() => handleScroll({ current: brandRowRefs.current[i] }, -200)}
                  className="absolute -left-3 sm:-left-6 md:-left-12 top-[122px] md:top-1/2 -translate-y-1/2 z-10 flex w-7 h-7 md:w-10 md:h-10 rounded-full bg-white border border-amber-300 shadow-md items-center justify-center text-base md:text-xl hover:bg-amber-50 hover:border-amber-500 transition"
                  aria-label="Previous Brand Item"
                >
                  ‹
                </button>
                <button
                  onClick={() => handleScroll({ current: brandRowRefs.current[i] }, 200)}
                  className="absolute -right-3 sm:-right-6 md:-right-12 top-[122px] md:top-1/2 -translate-y-1/2 z-10 flex w-7 h-7 md:w-10 md:h-10 rounded-full bg-white border border-amber-300 shadow-md items-center justify-center text-base md:text-xl hover:bg-amber-50 hover:border-amber-500 transition"
                  aria-label="Next Brand Item"
                >
                  ›
                </button>

                <div
                  ref={(el) => (brandRowRefs.current[i] = el)}
                  className="grid grid-flow-col auto-cols-[calc(50%-4px)] md:auto-cols-[220px] lg:auto-cols-[calc(25%-15px)] gap-2 md:gap-5 overflow-x-auto pb-2 px-1 scrollbar-hide snap-x snap-mandatory"
                >
                  {mobilMerek.slice(0, 8).map((mobil, index) => (
                    <div key={mobil.id ?? `${merek}-${index}`} className="snap-start">
                      <MobilCard
                        image={mobil.images?.[0]}
                        nama={mobil.nama}
                        tahun={mobil.tahun}
                        harga={mobil.harga}
                        id={mobil.id}
                        isPromo={mobil.isPromo}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-10">
          <Link
            to="/katalog"
            className="text-[#be123c] text-sm font-bold hover:text-[#8f1117] transition-colors duration-300"
          >
            Lihat Semua Mobil →
          </Link>
        </div>
      </section>




    {/* 🔥 PREMIUM HERO MARQUEE - FINAL FIX */}
<section className="max-w-7xl mx-auto mt-10 md:mt-20 px-0 md:px-6">
  <div className="relative overflow-hidden rounded-none sm:rounded-[30px] shadow-[0_30px_80px_rgba(0,0,0,0.8)]">

    {/* BACKGROUND */}
    <img
      src={premiumBanner}
      alt="Premium Car"
      className="absolute inset-0 w-full h-full object-cover object-right"
    />

    {/* OVERLAY - warna rata/uniform (pakai warna tengah gradasi asli), tanpa sisi gelap kiri-kanan */}
    <div className="absolute inset-0 bg-[#7A0E12]/85 z-10" />

    {/* CONTENT */}
    <div className="relative z-20 grid lg:grid-cols-[45%_1fr] items-center min-h-[460px] min-w-0">

     {/* ================= LEFT ================= */}
<div className="p-6 md:p-12 flex flex-col gap-5 min-w-0">

  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#D9A85C]/30 transition-all duration-300 w-fit">
    <span className="text-white text-[11px] font-semibold tracking-wide">
      24 MEREK
    </span>
    <span className="w-[1px] h-2.5 bg-white/20"></span>
    <span className="text-[#D9A85C] text-[10px] font-medium tracking-wider uppercase">
      Pilihan Terpercaya
    </span>
  </div>

        {/* TITLE */}
        <h2 className="font-serif text-3xl md:text-5xl lg:text-[52px] leading-tight text-white font-semibold">
          Mobil Impian,
          <br />
          Kini Jadi Nyata di{" "}
          <span className="text-[#D9A85C] italic drop-shadow-[0_4px_15px_rgba(217,168,92,0.5)]">
            MobilKu
          </span>
        </h2>

        {/* LINE */}
        <div className="w-20 h-[2px] bg-gradient-to-r from-[#D9A85C] to-transparent"></div>

        {/* DESC */}
        <p className="text-[#FBF3E9]/90 text-base max-w-md leading-relaxed">
          Ribuan mobil berkualitas dengan harga transparan & terpercaya
        </p>

        {/* BUTTON */}
        <Link
  to="/katalog"
  className="mt-3 self-start group inline-flex items-center gap-2 sm:gap-2.5
  bg-gradient-to-r from-[#F5D28A] via-[#D9A85C] to-[#B8902E]
  text-[#1A0305] font-bold text-xs sm:text-base rounded-full pl-3.5 pr-1 py-1.5 sm:pl-5 sm:pr-1.5 sm:py-1.5
  shadow-[0_12px_40px_rgba(217,168,92,0.5)]
  hover:scale-105 transition-all duration-300"
>
          <span>Jelajahi Semua Merek</span>

          <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#1A0305] text-[#D9A85C] flex items-center justify-center text-[10px] sm:text-sm group-hover:translate-x-1 transition">
            →
          </span>
        </Link>

        {/* TRUST */}
        <div className="flex items-center gap-3 text-sm text-[#FBF3E9]/80 pt-2">
          <span className="text-[#D9A85C]">🛡️</span>
          <span>175 titik inspeksi</span>
          <span className="text-[#D9A85C]">•</span>
          <span>Garansi mesin 1 tahun</span>
        </div>

        {/* 🔥 LOGO MOBILE (AUTO SLIDE) */}
        <div className="flex flex-col gap-2.5 pt-4 lg:hidden overflow-hidden min-w-0 w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          {/* Baris 1 - geser ke kiri */}
          <div className="flex gap-2.5 w-max animate-[slideLeft_28s_linear_infinite]">
            {[...barisA, ...barisA].map((merek, idx) => (
              <Link
                key={`m-a-${merek.name}-${idx}`}
                to={`/katalog?merek=${encodeURIComponent(merek.name)}`}
                className="flex-none w-[92px] h-[62px] rounded-xl
                bg-white/95
                shadow-md
                border border-[#D9A85C]/30
                flex items-center justify-center
                active:scale-95 transition
                hover:shadow-[0_0_15px_rgba(217,168,92,0.4)]"
              >
                <img
                  src={merek.logo}
                  alt={merek.name}
                  className="max-h-7 object-contain"
                />
              </Link>
            ))}
          </div>

          {/* Baris 2 - geser ke kanan */}
          <div className="flex gap-2.5 w-max animate-[slideRight_28s_linear_infinite]">
            {[...barisB, ...barisB].map((merek, idx) => (
              <Link
                key={`m-b-${merek.name}-${idx}`}
                to={`/katalog?merek=${encodeURIComponent(merek.name)}`}
                className="flex-none w-[92px] h-[62px] rounded-xl
                bg-white/95
                shadow-md
                border border-[#D9A85C]/30
                flex items-center justify-center
                active:scale-95 transition
                hover:shadow-[0_0_15px_rgba(217,168,92,0.4)]"
              >
                <img
                  src={merek.logo}
                  alt={merek.name}
                  className="max-h-7 object-contain"
                />
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ================= RIGHT (DESKTOP ONLY, AUTO SLIDE) ================= */}
      <div className="hidden lg:flex flex-col gap-6 pr-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* Baris 1 - geser ke kiri */}
        <div className="flex gap-5 w-max animate-[slideLeft_35s_linear_infinite] hover:[animation-play-state:paused]">
          {[...barisA, ...barisA].map((merek, idx) => (
            <Link
              key={`d-a-${merek.name}-${idx}`}
              to={`/katalog?merek=${encodeURIComponent(merek.name)}`}
              className="flex-none w-[180px] h-[100px] rounded-2xl
              bg-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]
              border-2 border-[#D9A85C]/40
              hover:border-[#D9A85C] hover:scale-105
              transition flex items-center justify-center"
            >
              <img
                src={merek.logo}
                alt={merek.name}
                className="max-h-12 object-contain"
              />
            </Link>
          ))}
        </div>

        {/* Baris 2 - geser ke kanan */}
        <div className="flex gap-5 w-max animate-[slideRight_35s_linear_infinite] hover:[animation-play-state:paused]">
          {[...barisB, ...barisB].map((merek, idx) => (
            <Link
              key={`d-b-${merek.name}-${idx}`}
              to={`/katalog?merek=${encodeURIComponent(merek.name)}`}
              className="flex-none w-[180px] h-[100px] rounded-2xl
              bg-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]
              border-2 border-[#D9A85C]/40
              hover:border-[#D9A85C] hover:scale-105
              transition flex items-center justify-center"
            >
              <img
                src={merek.logo}
                alt={merek.name}
                className="max-h-12 object-contain"
              />
            </Link>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Section Keunggulan */}
      <section className="max-w-7xl mx-auto mt-14 md:mt-20 px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="text-[#8B1A1A] text-[18px] font-bold uppercase tracking-[0.25em] mb-3">
            — Keunggulan Kami —
          </p>
          <h2 className="text-2xl md:text-4xl font-serif font-medium text-gray-900 leading-snug">
            Kenapa Pilih <span className="text-[#C9A227] font-medium">Mobilku?</span>
          </h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block space-y-7">
          {dataFeature.map((fitur, index) => (
            <div
              key={index}
              className="relative rounded-3xl overflow-hidden shadow-[0_20px_40px_-18px_rgba(24,3,5,.35)] h-[34rem]"
            >
              <img
                src={fitur.image}
                alt={fitur.judul}
                className="w-full h-full object-cover object-[50%_20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140405] from-0% via-[#140405]/30 via-30% to-transparent to-65%" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 flex items-end justify-between gap-8">
                <div>
                  <h3 className="font-serif italic font-semibold text-3xl text-white mb-3">
                    {fitur.judul}
                  </h3>
                  <p className="text-white/70 text-base max-w-lg leading-relaxed">
                    {fitur.deskripsi}
                  </p>
                </div>

                <button className="group hidden md:flex items-center gap-2 shrink-0 text-[#D9A85C] text-sm font-semibold uppercase tracking-wider border-b border-[#D9A85C]/40 pb-1 hover:border-[#D9A85C] transition-colors duration-300">
                  Selengkapnya
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-1.5 -mx-4">
          {dataFeature.map((fitur, index) => {
            const Icon = fitur.Icon;
            return (
              <div key={index} className="relative">
                <div
                  className="relative h-60 overflow-hidden"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 82%, 0 100%)" }}
                >
                  <img
                    src={fitur.image}
                    alt={fitur.judul}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3.5 left-3.5 bg-white/90 text-[#7A0E12] text-[11px] font-extrabold px-3.5 py-1.5 rounded-full">
                    MobilKu
                  </span>
                </div>
                <div
                  className="h-1 bg-gradient-to-r from-[#7A0E12] via-[#B5321A] to-transparent -mt-[3px]"
                  style={{ transform: "skewY(-2deg)", transformOrigin: "left" }}
                />
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B5321A] to-[#7A0E12] flex items-center justify-center shadow-lg border-4 border-white absolute left-5 -mt-7 z-10">
                  <Icon className="text-white text-lg" />
                </div>
                <div className="bg-white pt-9 pb-4 px-5">
                  <h3 className="font-extrabold text-base text-gray-900 mb-1.5">
                    {fitur.judul}
                  </h3>
                  <p className="text-[12.5px] text-gray-400 leading-relaxed mb-4">
                    {fitur.deskripsi}
                  </p>
                  <div className="flex justify-between items-center border-gray-100 pt-3.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A0E12]">
                      Lihat Semua
                    </span>
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B5321A] to-[#7A0E12] text-white flex items-center justify-center text-sm">
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Banner Jual Mobil + Testimoni */}
      <div className="relative max-w-7xl mx-auto my-12 md:my-16 px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[24px] ring-1 ring-[#D9A85C]/25 shadow-[0_30px_70px_-30px_rgba(24,3,5,0.6)]">

          {/* Zona: Jual Mobil */}
          <div className="relative bg-gradient-to-br from-[#D4172F] to-[#2A0508] px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#D9A85C]/10 blur-[80px]" />

            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4172F] to-[#8f1117] flex items-center justify-center flex-shrink-0 shadow-[0_10px_22px_-8px_rgba(0,0,0,0.4)]">
                <FaCar className="text-white text-3xl md:text-4xl flex-shrink-0" />
              </div>
              <div>
                <h3 className="font-serif italic text-xl md:text-2xl text-[#FBF3E9] leading-snug">
                  Ingin Menjual Mobil Anda?
                </h3>
                <p className="text-[#FBF3E9]/70 text-sm mt-1">
                  Pasang iklan gratis dan temukan pembeli dengan cepat!
                </p>
              </div>
            </div>

            <Link
              to="/jual-mobil"
              className="group relative w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-3 overflow-hidden bg-white text-[#D4172F] font-bold text-sm rounded-full pl-6 pr-2.5 py-3 shadow-lg hover:-translate-y-0.5 transition-transform duration-300 whitespace-nowrap"
            >
              <span className="absolute top-0 left-0 w-2/5 h-full bg-gradient-to-r from-transparent via-[#f72803]/30 to-transparent skew-x-[-12deg] animate-[shine_2.8s_ease-in-out_infinite]" />
              <span className="relative flex items-center gap-2">
                <FaPlus className="text-xs" />
                Jual Mobil Sekarang
              </span>
              <span className="relative w-6 h-6 rounded-full bg-[#2A0508] text-[#D9A85C] flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>

          {/* Garis Pemisah */}
          <div className="h-px bg-[#D9A85C]/30" />

          {/* Zona: Tulis Testimoni */}
          <div className="bg-[#FBF3E9] px-6 md:px-10 py-5 text-center">
            <p className="text-xs text-gray-500 mb-2">
              Sudah pernah beli di MobilKu?
            </p>
            <TestimoniForm compact />
          </div>
        </div>
      </div>
      <TestimoniSlider />

      {/* Section FAQ */}
      <section className="max-w-7xl mx-auto mt-14 md:mt-20 px-4 md:px-6">
        <div className="text-center py-6">
          <div className="w-10 h-1 bg-red-700 mx-auto mb-3" />
          <h2 className="text-2xl font-bold">FAQ</h2>
        </div>

        <div className="py-6">
          {dataFaq.map((faq, index) => (
            <FaqItem
              key={index}
              pertanyaan={faq.pertanyaan}
              jawaban={faq.jawaban}
            />
          ))}
        </div>

        <div className="text-center py-6">
          <div className="w-10 h-1 bg-red-700 mx-auto mb-3" />
          <h2 className="text-xl font-bold">FAQ lainnya</h2>
        </div>
      </section>

      <ShowroomMap />
      <Footer />
    </>
  );
}

export default Home;
