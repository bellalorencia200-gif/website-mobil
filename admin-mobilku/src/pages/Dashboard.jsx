import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { FaCar, FaTag, FaUsers, FaBoxOpen, FaArrowRight, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";
import bannerDashboard from "../assets/bannerdashboard.png";
import KategoriMobilCard from "./KategoriMobilCard.jsx";
import AktivitasTerbaruCard from "./AktivitasTerbaruCard.jsx";

const Dashboard = () => {
  // ==========================================
  // LOGIC AREA (TIDAK DITUKAR / DIUBAH)
  // ==========================================
  // ⚡ Ingatan sementara: angka terakhir disimpan agar kartu langsung tampil
  //    saat Dashboard dibuka lagi, lalu diperbarui diam-diam dari server.
  const CACHE_KEY = "dashboardStats";
  const [cache] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(CACHE_KEY)) || null;
    } catch {
      return null;
    }
  });

  const [totalMobil, setTotalMobil] = useState(cache?.totalMobil ?? 0);
  const [totalKategori, setTotalKategori] = useState(cache?.totalKategori ?? 0);
  const [totalUser, setTotalUser] = useState(cache?.totalUser ?? 0);
  const [totalStok, setTotalStok] = useState(cache?.totalStok ?? 0);
  const [isLoading, setIsLoading] = useState(!cache);
  const token = localStorage.getItem("token");

  useEffect(() => {
    Promise.allSettled([
      axios.get("/api/mobil"),
      axios.get("/api/categories"),
      axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]).then(([mobilResult, kategoriResult, userResult]) => {
      const baru = { ...(cache || {}) };

      if (mobilResult.status === "fulfilled") {
        const response = mobilResult.value;
        baru.totalMobil = response.data.mobil.length;
        baru.totalStok = response.data.mobil.reduce((acc, item) => acc + item.stok, 0);
        setTotalMobil(baru.totalMobil);
        setTotalStok(baru.totalStok);
      }

      if (kategoriResult.status === "fulfilled") {
        baru.totalKategori = kategoriResult.value.data.categories.length;
        setTotalKategori(baru.totalKategori);
      }

      if (userResult.status === "fulfilled") {
        baru.totalUser = userResult.value.data.users.length;
        setTotalUser(baru.totalUser);
      }

      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(baru));
      } catch {
        // abaikan jika penyimpanan browser tidak tersedia
      }

      setIsLoading(false);
    });
  }, [token]);

  // ==========================================
  // KARTU STATISTIK DETAIL, MEWAH & BERSIH (MAROON & PUTIH)
  // ==========================================
  const Card = ({ to, icon, title, value, desc, badgeText }) => (
    <Link
      to={to}
      className="
        group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6.5
        bg-white border border-rose-100/80
        shadow-[0_10px_30px_-8px_rgba(121,13,18,0.05)]
        hover:shadow-[0_20px_40px_-10px_rgba(121,13,18,0.22)]
        hover:border-[#790D12]/40
        transition-all duration-500 ease-out hover:-translate-y-2
        flex flex-col justify-between font-['Raleway',sans-serif]
      "
    >
      {/* Garis Aksen Maroon Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#790D12] via-[#B81D24] to-[#58090D] opacity-90 group-hover:h-2 transition-all duration-300" />

      {/* Efek Ambient Glow saat Hover */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#790D12]/5 rounded-full blur-2xl group-hover:bg-[#790D12]/12 transition-all duration-500 pointer-events-none" />

      {/* Header Card: Icon Container + Badge + Arrow Nav */}
      <div className="flex items-center justify-between relative z-10">
        {/* Icon Container Maroon Luxury */}
        <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#790D12] via-[#62090E] to-[#400508] text-white flex items-center justify-center shadow-lg shadow-[#790D12]/25 ring-4 ring-[#790D12]/10 group-hover:scale-110 group-hover:ring-[#790D12]/20 transition-all duration-500">
          <span className="text-lg sm:text-2xl text-rose-100">{icon}</span>
        </div>

        {/* Badge Status & Action Button */}
        <div className="flex items-center gap-2">
          {badgeText && (
            <span className="hidden sm:flex text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-[#790D12] border border-rose-200/60 shadow-2xs items-center gap-1">
              <FaChartLine className="text-[9px]" />
              {badgeText}
            </span>
          )}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-50/80 text-[#790D12] flex items-center justify-center group-hover:bg-[#790D12] group-hover:text-white transition-all duration-300 shadow-xs">
            <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Body Card: Label, Angka Statistik, & Deskripsi Detail */}
      <div className="mt-4 sm:mt-6 relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-wider uppercase truncate">
            {title}
          </p>
          {/* Live Indicator Dot */}
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#790D12] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#790D12]"></span>
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-1 group-hover:text-[#790D12] transition-colors duration-300">
          {value}
        </h2>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-1 font-medium line-clamp-1">{desc}</p>
      </div>

      {/* Watermark Dynamic Background Icon */}
      <div className="absolute -right-4 -bottom-4 text-6xl sm:text-8xl text-[#790D12]/[0.04] group-hover:text-[#790D12]/[0.10] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 ease-out pointer-events-none">
        {icon}
      </div>
    </Link>
  );

  return (
    <div className="w-full space-y-5 md:space-y-10 px-0 py-2 md:p-6 font-['Raleway',sans-serif] bg-gray-50/50 min-h-screen">
      {/* 🔥 BANNER SEAMLESS & MINIMALIS
          (HP: penuh dari tepi ke tepi, menempel di bawah topbar | Laptop: tetap seperti semula) */}
      <div className="relative overflow-hidden -mx-4 -mt-3.5 rounded-none md:mx-0 md:mt-0 md:rounded-3xl min-h-[260px] md:min-h-[320px] shadow-sm">
        <img
          src={bannerDashboard}
          alt="Banner Dashboard"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Smooth Dark Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Banner Content */}
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full min-h-[260px] md:min-h-[320px] max-w-xl text-white">
          <span className="text-[#E4B87C] text-xs font-semibold tracking-[0.2em] mb-2 uppercase">
            Selamat Datang Kembali
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Dashboard Admin
          </h1>

          <p className="text-slate-200 mt-3 text-xs md:text-sm leading-relaxed font-normal opacity-90">
            Kelola inventaris kendaraan, pantau stok, dan optimalkan operasional
            bisnis <span className="text-white font-semibold">MobilKu</span> secara efisien dan modern.
          </p>

          <div className="hidden sm:flex items-center gap-3 mt-6">
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-white/90 border border-white/10 flex items-center gap-2">
              <span>🚗</span> Kelola Data
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-white/90 border border-white/10 flex items-center gap-2">
              <span>📦</span> Pantau Stok
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-white/90 border border-white/10 flex items-center gap-2">
              <span>⚡</span> Lebih Efisien
            </span>
          </div>
        </div>
      </div>

      {/* 🔥 KARTU STATISTIK MEWAH & RAPI */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-36 sm:h-44 rounded-2xl sm:rounded-3xl bg-slate-200/70 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card
              to="/admin/mobil"
              icon={<FaCar />}
              title="Total Mobil"
              value={totalMobil}
              desc="Unit armada terdaftar"
              badgeText="Aktif"
            />

            <Card
              to="/admin/kategori"
              icon={<FaTag />}
              title="Total Kategori"
              value={totalKategori}
              desc="Kategori tipe kendaraan"
              badgeText="Tersedia"
            />

            <Card
              to="/admin/user"
              icon={<FaUsers />}
              title="Total User"
              value={totalUser}
              desc="Pengguna terintegrasi"
              badgeText="Terverifikasi"
            />

            <Card
              to="/admin/mobil"
              icon={<FaBoxOpen />}
              title="Total Stok"
              value={totalStok}
              desc="Mobil siap dipasarkan"
              badgeText="Ready"
            />
          </div>
        )}
      </div>
      {/* 🔥 KATEGORI MOBIL (2/3) + AKTIVITAS TERBARU (1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        <div className="xl:col-span-2">
          <KategoriMobilCard />
        </div>
        <AktivitasTerbaruCard/>
      </div>
    </div>
  );
};

export default Dashboard;
