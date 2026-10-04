import { useState } from "react"; // ← BARU
import { Link, useNavigate } from "react-router-dom"; // ← BARU: tambah useNavigate
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import showroomtoyota from "../assets/showroomtoyota.png";
import asd1 from "../assets/asd1.png";
import asd2 from "../assets/asd2.jpeg";
import asd3 from "../assets/asd3.png";
import TestimoniSlider from "../components/TestimoniSlider";
import TestimoniForm from "../components/TestimoniForm";


import {
  FaCar,
  FaShieldAlt,
  FaFileAlt,
  FaBolt,
  FaTags,
  FaSearch,
  FaArrowRight,
  FaCheck,
  FaPlus,
} from "react-icons/fa";

const TentangKami = () => {
  // ← BARU: loading spinner saat tombol "Cari Mobil" / "Jual Mobil" diklik
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const pindahHalaman = (tujuan) => (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(tujuan);
      setIsNavigating(false);
    }, 400);
  };

  // ================= DATA MISI =================
  const dataMisi = [
    "Menyediakan pilihan mobil bekas berkualitas dari berbagai merek, tipe, dan harga.",
    "Memberikan informasi kendaraan secara transparan, lengkap, dan mudah dipahami.",
    "Mempermudah proses jual beli mobil agar lebih praktis dan efisien.",
    "Membangun transaksi yang aman dan terpercaya bagi pembeli maupun penjual.",
    "Memberikan pengalaman terbaik kepada pengguna dalam mencari dan menjual kendaraan.",
  ];

  // Kata kunci di tiap misi yang ditebalkan (urutannya sama dengan dataMisi)
  const sorotMisi = [
    "pilihan mobil bekas berkualitas",
    "transparan, lengkap, dan mudah dipahami",
    "lebih praktis dan efisien",
    "aman dan terpercaya",
    "pengalaman terbaik",
  ];

  // ================= DATA KEUNGGULAN =================
  const dataKeunggulan = [
    {
      Icon: FaCar,
      judul: "Pilihan Mobil Beragam",
      deskripsi:
        "Temukan berbagai merek, tipe, tahun, dan rentang harga sesuai kebutuhan Anda.",
    },
    {
      Icon: FaShieldAlt,
      judul: "Aman & Terpercaya",
      deskripsi:
        "Informasi kendaraan disajikan secara transparan agar Anda dapat memilih dengan lebih yakin.",
    },
    {
      Icon: FaFileAlt,
      judul: "Dokumen Lengkap",
      deskripsi:
        "Informasi dan kelengkapan dokumen tersedia untuk membantu proses transaksi.",
    },
    {
      Icon: FaBolt,
      judul: "Proses Lebih Mudah",
      deskripsi:
        "Nikmati proses pencarian dan komunikasi yang praktis tanpa langkah yang rumit.",
    },
    {
      Icon: FaTags,
      judul: "Harga Kompetitif",
      deskripsi:
        "Pilihan kendaraan dengan harga kompetitif sesuai kondisi dan pasar.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#FBF9F6]">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={showroomtoyota}
            alt="Showroom MobilKu"
            className="
              h-full
              w-full
              object-cover
              object-[75%_62%]
              md:object-[72%_62%]
            "
          />

          {/* Hero overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/90
              via-black/70
              to-black/20

              md:bg-gradient-to-r
              md:from-[#FBF9F6]
              md:via-[#FBF9F6]/90
              md:via-[48%]
              md:to-transparent
              md:to-[72%]
            "
          />

          {/* Soft desktop overlay */}
          <div
            className="
              absolute
              inset-0
              hidden
              md:block
              bg-gradient-to-l
              from-black/10
              via-transparent
              to-transparent
            "
          />

          {/* Fade bawah (desktop) - foto menyatu halus ke warna krem di
              bawahnya, jadi tidak ada batas keras */}
          <div className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-b from-transparent to-[#FBF9F6] md:block" />
        </div>

        {/* Hero content */}
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[520px]
            max-w-7xl
            items-end
            px-5
            py-14

            md:min-h-[600px]
            md:items-center
            md:px-10
            md:py-20

            lg:px-12
          "
        >
          <div
            className="
              w-full
              max-w-xl
              text-center
              md:text-left
            "
          >
            {/* Label */}
            <div
              className="
                mb-4
                flex
                items-center
                justify-center
                gap-2
                md:justify-start
              "
            >
              <span className="h-px w-7 bg-[#D9A85C]" />

              <p
                className="
                  text-[10px]
                  font-bold
                  tracking-[0.3em]
                  text-[#D9A85C]
                "
              >
                TENTANG KAMI
              </p>

              <span className="h-px w-7 bg-[#D9A85C] md:hidden" />
            </div>

            {/* Heading */}
            <h1
              className="
                text-[28px]
                leading-[1.15]
                sm:text-[32px]
                md:text-5xl
                md:leading-tight
                lg:text-[52px]
              "
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              <span
                className="
                  block
                  font-semibold
                  text-white
                  [text-shadow:_0_2px_12px_rgb(0_0_0_/_45%)]
                  md:text-gray-900
                  md:[text-shadow:none]
                "
              >
                Kami Hadir untuk
              </span>

              <span
                className="
                  mt-1
                  block
                  font-bold
                  italic
                  text-[#ff5c63]
                  drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]

                  md:text-[#D90416]
                  md:drop-shadow-[0_2px_8px_rgba(217,4,22,0.15)]
                "
              >
                Mobil Impian Anda
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-4
                max-w-lg
                text-[13px]
                leading-relaxed
                text-gray-200
                [text-shadow:_0_1px_8px_rgb(0_0_0_/_40%)]

                md:text-base
                md:text-gray-600
                md:[text-shadow:none]
              "
            >
              Platform terpercaya untuk menemukan mobil bekas berkualitas
              dengan harga transparan dan proses aman dari awal hingga akhir.
            </p>

            {/* Buttons (Navigasi Link) */}
            <div
              className="
                mt-6
                flex
                justify-center
                gap-3
                md:justify-start
              "
            >
              <Link
                to="/katalog"
                onClick={pindahHalaman("/katalog")} // ← BARU
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-gradient-to-r
                  from-[#8f1117]
                  to-[#5f0a0d]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-[#8f1117]/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
              >
                Cari Mobil
                <FaArrowRight className="text-[11px]" />
              </Link>

              <Link
                to="/jual-mobil"
                onClick={pindahHalaman("/jual-mobil")} // ← BARU
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/60
                  bg-white/5
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-[#8f1117]

                  md:border-[#8f1117]/40
                  md:bg-white/50
                  md:text-[#8f1117]
                "
              >
                Jual Mobil
              </Link>
            </div>

            {/* Trust */}
            <div
              className="
                mt-6
                flex
                flex-wrap
                justify-center
                gap-x-5
                gap-y-2
                text-[11px]
                text-white/85

                md:justify-start
                md:text-gray-600
              "
            >
              <span className="flex items-center gap-1.5">
                <FaShieldAlt className="text-[#D9A85C]" />
                Aman
              </span>

              <span className="flex items-center gap-1.5">
                <FaSearch className="text-[#D9A85C]" />
                Terverifikasi
              </span>

              <span className="flex items-center gap-1.5">
                <FaBolt className="text-[#D9A85C]" />
                Cepat
              </span>
            </div>
          </div>
        </div>
      </section>

   {/* ================= VISI MISI ================= */}
<section className="bg-[#FBF9F6] px-5 pt-8 pb-4 md:pb-20 md:pt-12">
  <div className="max-w-7xl mx-auto">

    {/* ================= JUDUL SECTION ================= */}
    <div className="mb-10 text-center md:mb-12">
      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-[#D9A85C]" />
        <p className="text-[11px] font-bold tracking-[0.35em] text-[#b8893f]">
          TENTANG MOBILKU
        </p>
        <span className="h-px w-10 bg-[#D9A85C]" />
      </div>

      <h2
        className="text-3xl font-bold leading-tight text-gray-900 md:text-[44px]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Visi <span className="italic text-[#8f1117]">&amp;</span> Misi Kami
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500 md:text-[15px]">
        Arah dan komitmen yang menjadi dasar setiap layanan MobilKu.
      </p>

      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="h-[2px] w-12 rounded-full bg-[#8f1117]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D9A85C]" />
        <span className="h-[2px] w-12 rounded-full bg-[#8f1117]" />
      </div>
    </div>

    {/* ================= VISI ================= */}
    {/* HP: full kiri-kanan (-mx-5 menutup padding section), tanpa sudut
        membulat. Desktop (md:) tetap kartu membulat seperti sebelumnya. */}
    <div className="relative -mx-5 h-[560px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.25)] md:mx-0 md:h-[620px] md:rounded-[32px]">

      {/* IMAGE */}
      <img
        src={asd1}
        alt="Visi MobilKu"
        className="absolute inset-0 h-full w-full object-cover object-[30%_top] md:object-center"
      />

      {/* OVERLAY - HP: gelap dari bawah (foto terlihat jelas di atas,
          tulisan di bawah); desktop: gelap dari kanan seperti sebelumnya */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t from-[#4d0a0d] via-[#8f1117]/85 via-45% to-transparent
          md:bg-gradient-to-l md:from-[#5f0a0d]/95 md:via-[#8f1117]/75 md:to-black/25
        "
      />

      {/* BINGKAI TIPIS DI DALAM (kesan premium) */}
      <div className="pointer-events-none absolute inset-4 hidden rounded-[24px] border border-white/10 md:block" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-end justify-center px-6 pb-10 md:items-center md:justify-end md:px-16 md:pb-0">

        <div className="max-w-lg text-center text-white md:text-right">

          {/* LABEL */}
          <div className="mb-4 flex items-center justify-center gap-2.5 md:justify-end">
            <span className="h-px w-8 bg-[#F1C77A] md:hidden" />
            <p className="text-[11px] font-bold tracking-[0.35em] text-[#F1C77A]">
              VISI
            </p>
            <span className="h-px w-8 bg-[#F1C77A]" />
          </div>

          {/* TITLE */}
          <h2
            className="text-[30px] md:text-5xl font-bold leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Menjadi Pilihan
            <span className="block text-[#F1C77A] italic">
              Terpercaya
            </span>
          </h2>

          {/* GARIS EMAS */}
          <div className="mx-auto my-5 h-px w-full max-w-[240px] bg-gradient-to-r from-transparent via-[#F1C77A]/70 to-transparent md:ml-auto md:mr-0 md:max-w-[380px] md:bg-gradient-to-l md:from-[#F1C77A]/70 md:via-[#F1C77A]/30 md:to-transparent" />

          {/* DESC (FIX UTAMA) */}
          <p
            className="
              text-sm
              md:text-base
              leading-relaxed
              text-white/95
              [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]
            "
          >
            Kami berkomitmen menjadi platform jual beli mobil bekas terpercaya
            yang memberikan pengalaman terbaik, aman, dan transparan bagi setiap pelanggan.
          </p>

          {/* FITUR - dibuat jadi pil/badge rapi */}
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 md:justify-end">
            {["Aman", "Mudah", "Berkualitas"].map((fitur) => (
              <span
                key={fitur}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm"
              >
                <FaCheck className="text-[10px] text-[#F1C77A]" />
                {fitur}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>

    {/* ================= MISI ================= */}
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-12 md:mt-20">

      {/* LEFT - desain tulisan baru (isi tetap sama) */}
      <div>
        {/* LABEL */}
        <div className="mb-4 flex items-center gap-2.5">
          <span className="h-px w-8 bg-[#D9A85C]" />
          <p className="text-[11px] font-bold tracking-[0.3em] text-[#b8893f]">
            MISI KAMI
          </p>
        </div>

        {/* JUDUL */}
        <h3
          className="text-3xl md:text-[42px] font-bold leading-[1.1] text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Yang Kami{" "}
          <span className="italic text-[#8f1117]">Wujudkan</span>
        </h3>

        {/* AKSEN BAWAH JUDUL */}
        <div className="mt-4 mb-7 flex items-center gap-2">
          <span className="h-[3px] w-12 rounded-full bg-[#8f1117]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#D9A85C]" />
        </div>

        {/* PARAGRAF PEMBUKA (gaya kutipan) */}
        <p className="mb-8 max-w-md border-l-2 border-[#D9A85C] pl-4 text-sm md:text-[15px] leading-7 text-gray-600">
          Kami hadir untuk memberikan layanan terbaik dalam proses jual beli
          mobil dengan fokus pada{" "}
          <span className="font-semibold text-gray-800">
            kenyamanan, kepercayaan, dan kemudahan
          </span>{" "}
          bagi pelanggan.
        </p>

        {/* DAFTAR MISI - kartu dengan nomor & kata kunci yang ditonjolkan */}
        <ol className="space-y-3">
          {dataMisi.map((item, i) => {
            // Bagian kalimat yang ditebalkan (isi kalimatnya tetap sama)
            const sorot = sorotMisi[i];
            const posisi = sorot ? item.indexOf(sorot) : -1;

            return (
              <li
                key={i}
                className="
                  group relative flex items-center gap-4 overflow-hidden
                  rounded-2xl border border-gray-100 bg-white px-4 py-4
                  shadow-[0_6px_18px_-12px_rgba(0,0,0,0.15)]
                  transition-all duration-300
                  hover:translate-x-1 hover:border-[#D9A85C]/40
                  hover:shadow-[0_14px_30px_-14px_rgba(143,17,23,0.25)]
                  md:px-5
                "
              >
                {/* Garis emas di kiri (muncul saat disorot) */}
                <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-gradient-to-b from-[#D9A85C] to-[#8f1117] transition-transform duration-300 group-hover:scale-y-100" />

                {/* Nomor */}
                <span
                  className="
                    flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                    bg-gradient-to-br from-[#a5161d] to-[#5f0a0d]
                    text-[17px] font-bold text-white lining-nums
                    shadow-[0_8px_16px_-8px_rgba(143,17,23,0.6)]
                    ring-1 ring-[#D9A85C]/30
                  "
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Teks */}
                <p className="text-[13px] leading-relaxed text-gray-600 md:text-[14px]">
                  {posisi >= 0 ? (
                    <>
                      {item.slice(0, posisi)}
                      <span className="font-semibold text-[#8f1117]">{sorot}</span>
                      {item.slice(posisi + sorot.length)}
                    </>
                  ) : (
                    item
                  )}
                </p>
              </li>
            );
          })}
        </ol>

        {/* PENUTUP */}
        <div className="mt-5 md:mt-8 border-t border-[#D9A85C]/25 pt-4 md:pt-5">
          <p className="text-[10px] md:text-[10.5px] font-semibold tracking-[0.22em] text-[#b8893f]">
            MOBILKU • SOLUSI MOBIL BEKAS TERBAIK UNTUK ANDA
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-6">

        {/* CARD 1 */}
        <div className="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_16px_40px_-18px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-18px_rgba(95,10,13,0.25)]">

          {/* FOTO + LABEL */}
          <div className="relative h-60 md:h-72 overflow-hidden">
            <img
              src={asd2}
              alt="Mobil Impian Jadi Nyata"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          </div>

          {/* ISI */}
          <div className="p-6 md:p-7">
            <h4
              className="text-xl md:text-[22px] font-bold leading-snug text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Mobil Impian{" "}
              <span className="italic text-[#8f1117]">Jadi Nyata</span>
            </h4>

            <span className="mt-3 mb-3 block h-[2px] w-8 rounded-full bg-[#D9A85C] transition-all duration-500 group-hover:w-14" />

            <p className="text-sm md:text-[14px] leading-relaxed text-gray-600">
              Membantu Anda menemukan kendaraan terbaik dengan proses yang mudah dan nyaman.
            </p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_16px_40px_-18px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-18px_rgba(95,10,13,0.25)]">

          {/* FOTO + LABEL */}
          <div className="relative h-60 md:h-72 overflow-hidden">
            <img
              src={asd3}
              alt="Transaksi Aman dan Transparan"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          </div>

          {/* ISI */}
          <div className="p-6 md:p-7">
            <h4
              className="text-xl md:text-[22px] font-bold leading-snug text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Transaksi Aman{" "}
              <span className="italic text-[#8f1117]">& Transparan</span>
            </h4>

            <span className="mt-3 mb-3 block h-[2px] w-8 rounded-full bg-[#D9A85C] transition-all duration-500 group-hover:w-14" />

            <p className="text-sm md:text-[14px] leading-relaxed text-gray-600">
              Memberikan pengalaman transaksi yang jelas, cepat, dan terpercaya tanpa keraguan.
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>

    {/* =====================================================
    KEUNGGULAN (VERSI PREMIUM FIX)
===================================================== */}
<section className="relative overflow-hidden bg-[#FBF9F6] px-5 pt-5 md:pt-24 pb-10 md:pb-12">

  {/* BACKGROUND CURVE */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#8f1117]/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-[#D9A85C]/10 rounded-full blur-3xl" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto">

    {/* ================= HEADER ================= */}
    <div className="text-center max-w-2xl mx-auto mb-16">

      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="h-px w-10 bg-[#D9A85C]" />
        <p className="text-[10px] tracking-[0.4em] font-bold text-[#D9A85C]">
          MENGAPA MEMILIH MOBILKU
        </p>
        <span className="h-px w-10 bg-[#D9A85C]" />
      </div>

      <h2
        className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Keunggulan{" "}
        <span className="text-[#8f1117] italic relative">
          Kami
          <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#D9A85C]/60 rounded-full" />
        </span>
      </h2>

      <p className="mt-5 text-gray-500 text-sm md:text-[15px] leading-relaxed">
        Kami menghadirkan pengalaman jual beli mobil bekas yang mengutamakan
        kualitas, transparansi, keamanan, dan kenyamanan dalam setiap prosesnya.
      </p>

      <div className="mt-6 flex justify-center items-center gap-2">
        <span className="w-14 h-[2px] bg-[#8f1117]" />
        <span className="w-2 h-2 rounded-full bg-[#D9A85C]" />
        <span className="w-6 h-[2px] bg-[#8f1117]/30" />
      </div>
    </div>

    {/* ================= GRID ================= */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">

  {dataKeunggulan.map((item, i) => {
    const Icon = item.Icon;

    return (
      <div
        key={i}
        className="
          group relative overflow-hidden rounded-[26px] p-[1px]
          bg-gradient-to-br from-[#8f1117]/40 via-transparent to-[#D9A85C]/30
          transition-all duration-500 hover:-translate-y-2
        "
      >
        {/* INNER GLASS */}
        <div
          className="
            relative h-full rounded-[26px] px-6 py-8
            bg-white/70 backdrop-blur-xl
            border border-white/40
            shadow-[0_10px_30px_rgba(0,0,0,0.1)]

            group-hover:bg-[#8f1117]/90
            group-hover:border-[#8f1117]/60
            group-hover:shadow-[0_25px_60px_rgba(143,17,23,0.45)]
            transition-all duration-500
          "
        >

          {/* GLOW EFFECT */}
          <div className="
            pointer-events-none absolute inset-0 rounded-[26px] opacity-0 group-hover:opacity-100
            bg-gradient-to-br from-[#8f1117]/40 via-transparent to-transparent
            transition duration-500
          " />

          {/* ICON */}
          <div className="relative flex justify-center mb-6">
            <div
              className="
                flex items-center justify-center w-16 h-16 rounded-full
                bg-[#8f1117]/10 text-[#8f1117]
                transition-all duration-500

                group-hover:bg-white/20
                group-hover:text-white
                group-hover:scale-110
                group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]
              "
            >
              <Icon className="text-xl" />
            </div>
          </div>

          {/* TITLE */}
          <h3
            className="
              relative text-center font-bold text-[15px] leading-snug
              text-gray-900
              group-hover:text-white
              transition duration-300
            "
          >
            {item.judul}
          </h3>

          {/* DESC */}
          <p
            className="
              relative text-center mt-3 text-[12px] leading-6
              text-gray-500
              group-hover:text-white/80
              transition duration-300
            "
          >
            {item.deskripsi}
          </p>

          {/* LINE */}
          <div className="relative mt-6 flex justify-center">
            <div
              className="
                h-[2px] w-8 rounded-full bg-[#8f1117]/40
                transition-all duration-500
                group-hover:w-16 group-hover:bg-white
              "
            />
          </div>

        </div>
      </div>
    );
  })}
</div>

    {/* ================= TRUST ================= */}
    <div className="mt-14 flex justify-center">
      <div className="flex items-center gap-4 bg-white border border-[#D9A85C]/20 px-6 py-4 rounded-2xl shadow-sm">

        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#8f1117] text-white">
          <FaShieldAlt className="text-sm" />
        </div>

        <div>
          <p className="text-[11px] font-bold text-[#8f1117] tracking-wide">
            KOMITMEN MOBILKU
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Transparansi, kenyamanan, dan kepercayaan dalam setiap transaksi.
          </p>
        </div>

      </div>
    </div>

  </div>
</section>
      {/* =====================================================
          BANNER JUAL MOBIL + TULIS TESTIMONI
          Latar dibagi dua: setengah atas krem (menyambung Keunggulan),
          setengah bawah putih (menyambung Testimoni). Banner jadi
          "menjembatani" dua section, tanpa jarak kosong di bawahnya.
      ===================================================== */}
      <section className="bg-[linear-gradient(to_bottom,#FBF9F6_50%,#ffffff_50%)]">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
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
      </section>

      {/* ================= TESTIMONI PELANGGAN ================= */}
      {/* Dibungkus supaya ada jarak putih di bawah kartu testimoni sebelum
          banner merah "Temukan Mobil Impianmu" (komponennya sendiri tidak
          diubah, jadi tampilan di halaman lain tetap sama) */}
      <div className="bg-white pb-12 md:pb-16">
        <TestimoniSlider />
      </div>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          bg-[#8f1117]
          px-5
          py-12
          text-center
          text-white
        "
      >
        {/* Decorations */}
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-[#D9A85C]/10" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-[#D9A85C]">
            MOBILKU PREMIUM AUTO
          </p>

          <h2
            className="text-2xl font-bold md:text-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Temukan Mobil Impianmu
          </h2>

          <p className="mt-2 text-sm text-white/80">
            Jelajahi berbagai pilihan mobil terbaik sekarang.
          </p>
        </div>
      </section>

      <Footer />

      {/* ← BARU: LOADING SPINNER SAAT KLIK "CARI MOBIL" / "JUAL MOBIL" */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
    </>
  );
};

export default TentangKami;