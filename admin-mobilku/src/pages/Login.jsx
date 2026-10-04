import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useState, useEffect } from "react";
import bannerlogin from "../assets/bannerlogin.png";
import logomobilkuwhite from "../assets/logomobilkuwhite.png";

// =====================================================
// DAFTAR MEREK UNTUK SLIDER (tinggal tambah / ganti di sini)
// =====================================================
const daftarMerek = [
  {
    merek: "Toyota",
    sebutan: "All New",
    model: "Rush",
    tagline: ["Tangguh", "Modern", "Pilihan Tepat"],
  },
  {
    merek: "Honda",
    sebutan: "All New",
    model: "HR-V",
    tagline: ["Sporty", "Efisien", "Nyaman"],
  },
  {
    merek: "Toyota",
    sebutan: "New",
    model: "Fortuner",
    tagline: ["Gagah", "Tangguh", "Berkelas"],
  },
  {
    merek: "Mitsubishi",
    sebutan: "New",
    model: "Pajero Sport",
    tagline: ["Gagah", "Bertenaga", "Andal"],
  },
  {
    merek: "Toyota",
    sebutan: "All New",
    model: "Innova Zenix",
    tagline: ["Mewah", "Nyaman", "Bertenaga"],
  },
  {
    merek: "Honda",
    sebutan: "All New",
    model: "CR-V",
    tagline: ["Elegan", "Lapang", "Premium"],
  },
  {
    merek: "Mitsubishi",
    sebutan: "New",
    model: "Xpander",
    tagline: ["Modern", "Lapang", "Keluarga"],
  },
  {
    merek: "Toyota",
    sebutan: "New",
    model: "Avanza",
    tagline: ["Lega", "Irit", "Andalan"],
  },
  {
    merek: "Suzuki",
    sebutan: "New",
    model: "Ertiga",
    tagline: ["Hemat", "Nyaman", "Serbaguna"],
  },
  {
    merek: "Hyundai",
    sebutan: "New",
    model: "Creta",
    tagline: ["Stylish", "Canggih", "Kekinian"],
  },
];

// Lama setiap merek tampil (milidetik). 4000 = 4 detik
const DURASI_SLIDE = 4000;

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ PARALLAX STATE
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // ✅ SLIDER MEREK STATE
  const [slide, setSlide] = useState({ aktif: 0, keluar: null, putaran: 0 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;

    const x = (e.clientX - innerWidth / 2) / 60;
    const y = (e.clientY - innerHeight / 2) / 60;

    setOffset({ x, y });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ✅ GANTI MEREK OTOMATIS
  useEffect(() => {
    if (daftarMerek.length < 2) return;

    const timer = setInterval(() => {
      setSlide((s) => ({
        aktif: (s.aktif + 1) % daftarMerek.length,
        keluar: s.aktif,
        putaran: s.putaran + 1,
      }));
    }, DURASI_SLIDE);

    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    setIsSubmitting(true);

    axios
      .post("/api/auth/login", { identifier: username, password })
      .then((response) => {
        if (response.data.user.role !== "admin") {
          setError("Akun ini tidak memiliki akses ke panel admin");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/admin");
      })
      .catch((error) => {
        setError(
          error.response?.data?.message || "Username atau password salah"
        );
        setIsSubmitting(false);
      });
  };

  // ✅ ISI SATU SLIDE MEREK
  const isiMerek = (data) => (
    <>
      {/* BRAND */}
      <p className="text-[13px] font-semibold tracking-[5px] uppercase text-white/90 leading-none">
        {data.merek}
      </p>

      {/* SUB-TITLE */}
      <p className="mt-3 text-[15px] font-extrabold italic tracking-[2px] uppercase text-white/90 leading-none pl-1">
        {data.sebutan}
      </p>

      {/* NAMA MODEL (teks perak) */}
      <p className="mt-2 text-[42px] font-black italic tracking-tight leading-none pb-1 whitespace-nowrap bg-gradient-to-b from-white via-[#d9d9d9] to-[#7d7d7d] bg-clip-text text-transparent drop-shadow-[0_6px_14px_rgba(0,0,0,0.8)]">
        {data.model}
      </p>

      {/* TAGLINE */}
      <p className="mt-3 text-[13px] font-medium tracking-[3px] text-white/80 uppercase leading-none whitespace-nowrap">
        {data.tagline.map((kata, i) => (
          <span key={i}>
            {i > 0 && <span className="text-[#D9A85C] mx-2">•</span>}
            {kata}
          </span>
        ))}
      </p>
    </>
  );

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      onMouseMove={window.innerWidth > 1024 ? handleMouseMove : undefined}
    >

      {/* ===== ANIMASI SLIDER MEREK ===== */}
      <style>{`
        @keyframes merekMasuk {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes merekKeluar {
          from { transform: translateY(0);     opacity: 1; }
          to   { transform: translateY(-100%); opacity: 0; }
        }
        .merek-masuk  { animation: merekMasuk  0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .merek-keluar { animation: merekKeluar 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .merek-masuk, .merek-keluar { animation: none; }
          .merek-keluar { display: none; }
        }
      `}</style>

      {/* ===== BACKGROUND BLUR (DEPTH) ===== */}
      <img
        src={bannerlogin}
        alt="bg-blur"
        className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-40"
      />

      {/* ===== BACKGROUND MAIN ===== */}
      <img
        src={bannerlogin}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
        style={{
          transform: `scale(1.1) translate(${offset.x}px, ${offset.y}px)`
        }}
      />

      {/* ===== OVERLAY ===== */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

      {/* ===== LOADING ===== */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      {/* ===== MAIN ===== */}
      <div className="relative z-20 flex items-center justify-between min-h-screen px-6 lg:px-20 py-10">

        {/* ================= LEFT SIDE ================= */}
        <div
          className="hidden lg:flex flex-col justify-center max-w-xl text-white transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${offset.x * 0.4}px, ${offset.y * 0.4}px)`
          }}
        >

          {/* LOGO */}
          <img
            src={logomobilkuwhite}
            alt="MobilKu Logo"
            className="w-60 mb-6 drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
            style={{
              transform: `translate(${offset.x * 0.2}px, ${offset.y * 0.2}px)`
            }}
          />

          {/* PREMIUM AUTO */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-14 bg-[#D9A85C]" />
            <p className="text-[11px] tracking-[6px] text-white/70 uppercase">
              Premium Auto
            </p>
            <div className="h-[1px] w-14 bg-[#D9A85C]" />
          </div>

          {/* HEADING */}
          <h2
            className="text-5xl md:text-6xl font-bold leading-[1.15] mb-6 font-serif tracking-tight"
            style={{
              transform: `translate(${offset.x * 0.1}px, ${offset.y * 0.1}px)`
            }}
          >
            Selamat Datang <br />
            <span className="text-[#F1C77A]">Kembali</span>
          </h2>

          {/* ACCENT */}
          <div className="w-20 h-[2px] bg-gradient-to-r from-[#D9A85C] to-transparent mb-5" />

          {/* DESC */}
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-md">
            Masuk ke dashboard eksklusif MobilKu untuk mengelola data,
            memantau sistem, dan menjalankan operasional dengan{" "}
            <span className="text-white font-medium">aman</span> dan{" "}
            <span className="text-white font-medium">profesional</span>.
          </p>

          {/* ================= SLIDER MEREK ================= */}
          <div
            className="flex items-stretch gap-5 mt-14 select-none"
            style={{
              transform: `translate(${offset.x * 0.25}px, ${offset.y * 0.25}px)`
            }}
          >
            {/* GARIS GOLD (tetap diam) */}
            <div className="w-[2px] bg-[#D9A85C] rounded-full shrink-0" />

            <div className="flex flex-col py-1">
              {/* AREA SLIDE (tulisan hanya terlihat di dalam area ini) */}
              <div className="relative h-[126px] w-[420px] overflow-hidden">
                {slide.keluar !== null && (
                  <div
                    key={`keluar-${slide.putaran}`}
                    className="absolute inset-0 merek-keluar"
                    aria-hidden="true"
                  >
                    {isiMerek(daftarMerek[slide.keluar])}
                  </div>
                )}

                <div
                  key={`masuk-${slide.putaran}`}
                  className="absolute inset-0 merek-masuk"
                >
                  {isiMerek(daftarMerek[slide.aktif])}
                </div>
              </div>

              {/* TITIK PENANDA */}
              <div className="mt-4 flex items-center gap-1.5">
                {daftarMerek.map((item, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === slide.aktif ? "w-6 bg-[#D9A85C]" : "w-1.5 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE (FORM LOGIN) ================= */}
        <div className="w-full max-w-[440px] mx-auto lg:mx-0 lg:mr-10 pt-12">

          <div className="relative bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.45)] border border-white/40 px-8 pb-7">

            {/* HIASAN GELOMBANG ATAS */}
            <div className="absolute inset-x-0 top-0 h-24 overflow-hidden rounded-t-[28px] pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 420 112" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gelombangMerah" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a5161d" />
                    <stop offset="100%" stopColor="#5f0a0d" />
                  </linearGradient>
                </defs>
                <path d="M0 0 H420 V18 C330 10 250 30 170 52 C110 68 50 84 0 92 Z" fill="url(#gelombangMerah)" />
                <path d="M0 98 C60 88 120 70 180 54 C260 32 340 14 420 22" fill="none" stroke="#D9A85C" strokeWidth="2" />
              </svg>
            </div>

            {/* HIASAN SUDUT BAWAH */}
            <div className="absolute right-0 bottom-0 w-24 h-12 overflow-hidden rounded-br-[28px] pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 112 64" preserveAspectRatio="none">
                <path d="M112 10 C80 30 50 48 20 64 H112 Z" fill="#8f1117" opacity="0.9" />
                <path d="M112 2 C78 24 46 44 10 64" fill="none" stroke="#D9A85C" strokeWidth="1.5" />
              </svg>
            </div>

            {/* ICON PERISAI */}
            <div className="relative z-10 w-20 h-20 -mt-10 mx-auto rounded-full bg-gradient-to-br from-[#b3141c] to-[#5f0a0d] border-4 border-white ring-2 ring-[#D9A85C] shadow-[0_10px_25px_rgba(95,10,13,0.5)] flex items-center justify-center">
              <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
              </svg>
            </div>

            {/* JUDUL */}
            <div className="relative z-10 text-center mt-6 mb-7">
              <h1 className="font-serif text-[42px] font-bold leading-none text-[#8f1117] tracking-tight">
                MobilKu
              </h1>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="h-px w-12 bg-[#D9A85C]" />
                <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-gray-700">
                  Premium Auto
                </p>
                <div className="h-px w-12 bg-[#D9A85C]" />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin}>

              {/* USERNAME */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <svg className="w-4 h-4 text-[#8f1117]" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
                  </svg>
                  Username / Email
                </label>
                <div className="mt-2 flex items-center gap-3 h-12 px-4 rounded-xl border border-gray-200 bg-white transition focus-within:border-[#8f1117] focus-within:ring-4 focus-within:ring-[#8f1117]/10">
                  <svg className="w-5 h-5 text-[#8f1117] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                  </svg>
                  <input
                    type="text"
                    className="w-full h-full outline-none text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
                    placeholder="Username / Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <svg className="w-4 h-4 text-[#8f1117]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10V7a5 5 0 0110 0v3h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1zm2 0h6V7a3 3 0 00-6 0v3z" />
                  </svg>
                  Password
                </label>
                <div className="mt-2 flex items-center gap-3 h-12 px-4 rounded-xl border border-gray-200 bg-white transition focus-within:border-[#8f1117] focus-within:ring-4 focus-within:ring-[#8f1117]/10">
                  <svg className="w-5 h-5 text-[#8f1117] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full h-full outline-none text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-[#8f1117] transition shrink-0"
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10 10 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9M6.6 6.6C3.9 8.4 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* TOMBOL MASUK */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-b from-[#a5161d] to-[#5f0a0d] text-white text-[15px] font-semibold shadow-[0_12px_25px_rgba(95,10,13,0.4)] flex items-center justify-center gap-3 transition hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                {isSubmitting ? "Memproses..." : "Masuk ke Dashboard"}
              </button>
            </form>

            {/* FOOTER */}
            <div className="relative z-10 mt-7 pt-5 border-t border-gray-200 flex items-center justify-between gap-2 pr-6 text-[10.5px] text-gray-600 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Aman &amp; Terpercaya
              </div>
              <div className="w-px h-4 bg-gray-200 shrink-0" />
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
                </svg>
                Sistem Terlindungi
              </div>
              <div className="w-px h-4 bg-gray-200 shrink-0" />
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 14v-2a9 9 0 0118 0v2" />
                  <rect x="2" y="14" width="4" height="6" rx="1.5" />
                  <rect x="18" y="14" width="4" height="6" rx="1.5" />
                </svg>
                24/7 Support
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
