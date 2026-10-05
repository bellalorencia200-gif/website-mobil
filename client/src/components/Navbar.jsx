import {
  FaUser,
  FaPhoneAlt,
  FaMobileAlt,
  FaHome,
  FaCar,
  FaInfoCircle,
  FaSignOutAlt,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiOutlineChevronDown } from "react-icons/hi";
import LoginModal from "./LoginModal.jsx";
import DaftarModal from "./DaftarModal.jsx";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoMobilku from "../assets/logomobilkuwhite.png";
import useSettings from "../hooks/useSettings.js";

function Navbar() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [username, setUsername] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const profileMenuRef = useRef(null);
  const { nomorTampil, linkWa } = useSettings();

  const createRipple = (event) => {
    const button = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;

    const ripple = button.getElementsByClassName("ripple-span")[0];
    if (ripple) ripple.remove();

    circle.classList.add("ripple-span");
    button.appendChild(circle);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (token) {
      setLoggedIn(true);
    }
    if (storedUser) {
      setUserName(storedUser.fullName);
      setUsername(storedUser.username);
    }
  }, [isLoggedIn]);

  // Tutup menu profil kalau klik di luar area menu
  useEffect(() => {
    function tanganKlikDiluarProfile(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", tanganKlikDiluarProfile);

    return () => {
      document.removeEventListener("mousedown", tanganKlikDiluarProfile);
    };
  }, []);

  // Tutup menu profil otomatis kalau pindah halaman
  useEffect(() => {
    setShowProfileMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setShowProfileMenu(false);
    navigate("/");
  };


  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const handleMenuClick = (path) => (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
      document.getElementById("my-drawer-1").checked = false;
    }, 400);
  };


  return (
    <nav className="sticky top-0 z-40 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)]">


      <div className="drawer">
        <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* ===== TOP BAR ===== */}
          <div className="flex justify-between items-center bg-[#6e0d10] text-white text-xs md:text-sm px-4 md:px-6 py-2">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="hidden sm:flex items-center gap-1.5 opacity-90 hover:opacity-100 transition">
                 <FaPhoneAlt className="text-[11px]" />
                {nomorTampil}
              </span>
              <span className="flex items-center gap-1.5 ml-auto md:ml-0">
                <Link
                  to="/buka-di-hp"
                  className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-white transition"
                >
                  <FaMobileAlt className="text-[12px]" />
                  Dapatkan Aplikasi
                </Link>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-[12px]">
              <span className="flex items-center gap-1.5 opacity-90">
                <FaShieldAlt className="text-[11px]" />
                Aman &amp; Terpercaya
              </span>
              <span className="w-px h-3 bg-white/25" />
              <span className="flex items-center gap-1.5 opacity-90">
                <FaTruck className="text-[11px]" />
                Pengiriman Seluruh Indonesia
              </span>
            </div>
          </div>

          {/* ===== MAIN NAVBAR ===== */}
         <div className="relative flex items-center justify-between bg-gradient-to-b from-[#b3141c] via-[#96131a] to-[#7a0e12] shadow-lg px-4 md:px-6 py-2.5 md:py-3">
            {/* Efek glow di belakang logo */}
            <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>


{/* Hamburger + Logo (berdampingan di kiri) */}
<div className="flex items-center gap-2">
  {/* Hamburger (mobile): tampilkan loading sebentar, lalu buka menu samping */}
  <label
    htmlFor="my-drawer-1"
    className="md:hidden cursor-pointer z-10"
    onClick={(e) => {
      e.preventDefault();
      setIsNavigating(true);
      setTimeout(() => {
        setIsNavigating(false);
        document.getElementById("my-drawer-1").checked = true;
      }, 400);
    }}
  >
    <RxHamburgerMenu className="text-white text-2xl" />
  </label>

  {/* Logo */}
  <Link to="/" className="flex flex-col gap-1 relative z-10 group">
    {/* Mobile: teks saja, gaya serif */}
    <span
      className="md:hidden text-white text-xl font-normal"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      MobilKu
    </span>

    {/* Desktop: logo gambar + subtitle (tidak berubah) */}
    <img
      src={logoMobilku}
      alt="MobilKu"
      className="hidden md:block md:h-7 w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.55)] group-hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.8)] transition duration-300"
    />
    <span className="hidden md:block text-[8px] font-semibold tracking-[0.35em] text-white/80 pl-0.5">
      PREMIUM AUTO
    </span>
  </Link>
</div>

            {/* Desktop Menu - Center */}
            <ul className="hidden md:flex items-center gap-8 list-none text-white absolute left-1/2 -translate-x-1/2">
              <li>
                <Link
                  to="/"
                  onClick={handleMenuClick("/")}
                  className={`flex items-center gap-1.5 pb-1 text-[13px] font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 ${
                    location.pathname === "/"
                      ? "border-white text-white"
                      : "border-transparent text-white/80 hover:text-white hover:border-white/50"
                  }`}
                >
                  <FaHome className="text-sm" />
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/katalog"
                  onClick={handleMenuClick("/katalog")}
                  className={`flex items-center gap-1.5 pb-1 text-[13px] font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 ${
                    location.pathname === "/katalog"
                      ? "border-white text-white"
                      : "border-transparent text-white/80 hover:text-white hover:border-white/50"
                  }`}
                >
                  Katalog
                  <HiOutlineChevronDown className="text-xs opacity-70" />
                </Link>
              </li>
              <li>
                <Link
                  to="/tentang-kami"
                  onClick={handleMenuClick("/tentang-kami")}
                  className={`flex items-center gap-1.5 pb-1 text-[13px] font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 ${
                    location.pathname === "/tentang-kami"
                      ? "border-white text-white"
                      : "border-transparent text-white/80 hover:text-white hover:border-white/50"
                  }`}
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-4 relative z-10">
              {isLoggedIn ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="cursor-pointer"
                  >
          <div
  className="
    relative
    w-7 h-7
    rounded-full
    overflow-hidden
    flex items-center justify-center
    bg-gradient-to-br
    from-[#b5161f]
    via-[#8f0f15]
    to-[#5a070b]
    ring-2
    ring-[#d4af62]
    ring-offset-1
    ring-offset-[#8f0f15]
    shadow-[0_4px_14px_rgba(0,0,0,0.28)]
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-[0_6px_18px_rgba(212,175,98,0.4)]
  "
>
  {/* ===== GLOSSY HIGHLIGHT ===== */}
  <span
    className="
      absolute
      -top-4
      -left-3
      w-9
      h-6
      rotate-[-25deg]
      rounded-full
      bg-white/20
      blur-[2px]
    "
  />

  {/* ===== ICON USER ===== */}
  <FaUser
    className="
      relative
      z-20
      text-white
      text-[14px]
      drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]
    "
  />

  {/* ===== AKSEN MERAH ===== */}
  <span
    className="
      absolute
      -bottom-[6px]
      -left-[9px]
      w-[58px]
      h-[13px]
      rotate-[-18deg]
      rounded-full
      bg-gradient-to-r
      from-[#68070c]
      via-[#c51b25]
      to-[#8f1015]
      opacity-95
    "
  />

  {/* ===== AKSEN PUTIH ===== */}
  <span
    className="
      absolute
      -bottom-[7px]
      left-[4px]
      w-[48px]
      h-[8px]
      rotate-[-18deg]
      rounded-full
      bg-gradient-to-r
      from-white
      via-white/85
      to-white/10
      opacity-90
    "
  />

  {/* ===== AKSEN GOLD ===== */}
  <span
    className="
      absolute
      bottom-[2px]
      left-[9px]
      w-[34px]
      h-[1px]
      rotate-[-18deg]
      rounded-full
      bg-[#e1c276]/80
    "
  />
</div>
                  </button>

{showProfileMenu && (
  <>
    {/* BACKDROP */}
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998]"
      onClick={() => setShowProfileMenu(false)}
    />

    {/* CARD WRAPPER */}
    <div
      className="
        absolute right-0 top-full mt-3 z-[999]
        w-[85vw] max-w-xs md:w-80
      "
    >
      {/* CARET */}
      <div className="absolute -top-2 right-5 w-4 h-4 bg-[#5f0a0d] rotate-45 z-10"></div>

      {/* HEADER CARD */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#7a0e12] via-[#5f0a0d] to-[#3a0d11] px-4 py-4 shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
        {/* dekorasi gelombang */}
        <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 400 160" preserveAspectRatio="none">
          <path d="M180 0 C 260 40, 300 -10, 400 30 L 400 160 L 180 160 Z" fill="rgba(255,255,255,0.05)" />
          <path d="M240 0 C 300 60, 340 20, 400 60 L 400 160 L 240 160 Z" fill="rgba(255,255,255,0.04)" />
        </svg>

        <div className="relative flex items-center gap-3">
          {/* avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ecd7a4] via-[#d4af62] to-[#a9793a] text-[#3A0D11] flex items-center justify-center font-extrabold text-[16px] shadow-lg">
              {getInitials(userName)}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#5f0a0d] rounded-full" />
          </div>

          {/* info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[15px] text-white leading-tight truncate">{userName}</p>
            <p className="text-white/60 text-[12px] truncate">@{username}</p>
          </div>

          <span className="text-white/40 text-lg shrink-0">›</span>
        </div>
      </div>

      {/* MENU CARD */}
      <div className="-mt-px rounded-2xl overflow-hidden bg-black/55 backdrop-blur-xl border-t border-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.5)] text-white">

        {/* ITEM */}
        <Link
          to="/profile"
          onClick={(e) => {
            createRipple(e);
            setShowProfileMenu(false);
            // ← BARU: tampilkan spinner dulu, baru pindah halaman
            e.preventDefault();
            setIsNavigating(true);
            setTimeout(() => {
              navigate("/profile");
              setIsNavigating(false);
            }, 400);
          }}
          className="ripple relative overflow-hidden flex items-center gap-3.5 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/10"
        >
          <span className="w-10 h-10 shrink-0 rounded-xl bg-[#5f0a0d]/70 text-white flex items-center justify-center">
            <FaUser className="text-[15px]" />
          </span>
          <span className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-white">Profil</p>
            <p className="text-[11.5px] text-white/55">Kelola akun</p>
          </span>
          <span className="text-white/30 text-lg">›</span>
        </Link>

        <Link
          to="/profile?edit=true"
          onClick={(e) => {
            createRipple(e);
            setShowProfileMenu(false);
            // ← BARU: tampilkan spinner dulu, baru pindah halaman
            e.preventDefault();
            setIsNavigating(true);
            setTimeout(() => {
              navigate("/profile?edit=true"); // ← DIPERBAIKI: langsung ke mode edit
              setIsNavigating(false);
            }, 400);
          }}
          className="ripple relative overflow-hidden flex items-center gap-3.5 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/10"
        >
          <span className="w-10 h-10 shrink-0 rounded-xl bg-[#5f0a0d]/70 text-white flex items-center justify-center">
            <FaShieldAlt className="text-[15px]" />
          </span>
          <span className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-white">Pengaturan</p>
            <p className="text-[11.5px] text-white/55">Keamanan</p>
          </span>
          <span className="text-white/30 text-lg">›</span>
        </Link>

        <a
          href={linkWa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={createRipple}
          className="ripple relative overflow-hidden flex items-center gap-3.5 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/10"
        >
          <span className="w-10 h-10 shrink-0 rounded-xl bg-[#5f0a0d]/70 text-white flex items-center justify-center">
            <FaPhoneAlt className="text-[15px]" />
          </span>
          <span className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-white">Bantuan</p>
            <p className="text-[11.5px] text-white/55">Hubungi kami</p>
          </span>
          <span className="text-white/30 text-lg">›</span>
        </a>

        {/* LOGOUT */}
        {/* ← DIPERBAIKI: dikembalikan seperti semula (keluar lalu ke Beranda) */}
        <button
          onClick={(e) => {
            createRipple(e);
            handleLogout();
          }}
          className="ripple relative overflow-hidden w-full flex items-center gap-3.5 px-4 py-3.5 bg-[#d92020] hover:bg-[#e33131] transition-colors"
        >
          <span className="w-10 h-10 shrink-0 rounded-xl bg-white/15 text-white flex items-center justify-center">
            <FaSignOutAlt className="text-[15px]" />
          </span>
          <span className="flex-1 min-w-0 text-left">
            <p className="text-[14px] font-bold text-white">Keluar</p>
            <p className="text-[11.5px] text-white/70">Akhiri sesi akun</p>
          </span>
          <span className="text-white/50 text-lg">›</span>
        </button>

      </div>
    </div>
  </>
)}


                </div>
              ) : (
                <>
                  {/* jarak pemisah tipis sebelum tombol aksi */}
                  <span className="hidden md:block w-px h-7 bg-white/25" />

                  {/* Login Button */}
                  <button
                    className="flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-full border border-white/80 text-white text-xs font-semibold uppercase tracking-wide hover:bg-white hover:text-red-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaUser className="text-xs" />
                    <span>Login</span>
                  </button>
{/* Daftar Button */}
<button
  className="hidden md:flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-full bg-white text-red-700 text-xs font-bold uppercase tracking-wide shadow-md hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
  onClick={() =>
    document.getElementById("my_modal_2").showModal()
  }
>
  <FaUser className="text-xs" />
  <span>Daftar</span>
</button>

                </>
              )}
            </div>
          </div>
        </div>

       {/* ===== MOBILE DRAWER ===== */}
<div className="drawer-side z-50">
  <label
    htmlFor="my-drawer-1"
    aria-label="close sidebar"
    className="drawer-overlay"
  ></label>

  <ul
    className="
      relative
      min-h-full
      w-72
      overflow-hidden
      p-5
      text-white
      bg-gradient-to-b
      from-[#4d0508]
      via-[#720a0f]
      to-[#430407]
    "
  >

    {/* ===== AKSEN GOLD ATAS ===== */}
    <div
      className="
        absolute
        -top-16
        -left-16
        w-72
        h-28
        rotate-[-20deg]
        border-t
        border-[#d4af62]/80
        pointer-events-none
      "
    />

    {/* ===== GLOW MAROON ===== */}
    <div
      className="
        absolute
        top-[25%]
        -left-20
        w-64
        h-64
        rounded-full
        bg-[#b3141c]/10
        blur-3xl
        pointer-events-none
      "
    />

    {/* ================================================= */}
    {/* LOGO - TIDAK DIUBAH */}
    {/* ================================================= */}
    <li className="relative z-10 mb-5 pb-4 border-b border-white/10">
      <div className="flex items-center gap-2 px-2 hover:bg-transparent cursor-default">
        <img
          src={logoMobilku}
          alt="MobilKu"
          className="h-8 w-auto"
        />
      </div>
    </li>

    {/* ================================================= */}
    {/* BERANDA */}
    {/* ================================================= */}
    <li className="relative z-10">
      <Link
        to="/"
        onClick={handleMenuClick("/")}
        className={`
          flex items-center gap-3
          rounded-xl
          py-3 px-4
          transition-all duration-300
          ${
            location.pathname === "/"
              ? "bg-gradient-to-r from-[#a5161d] to-[#790b10] border-l-[3px] border-[#d8b76a] shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
              : "hover:bg-white/10"
          }
        `}
      >
        <FaHome
          className={
            location.pathname === "/"
              ? "text-[#f1d58c]"
              : "text-white"
          }
        />

        <span className="text-sm font-semibold">
          Beranda
        </span>
      </Link>
    </li>

    {/* ================================================= */}
    {/* KATALOG */}
    {/* ================================================= */}
    <li className="relative z-10">
      <Link
        to="/katalog"
        onClick={handleMenuClick("/katalog")}
        className={`
          flex items-center justify-between
          rounded-xl
          py-3 px-4
          transition-all duration-300
          ${
            location.pathname === "/katalog"
              ? "bg-gradient-to-r from-[#a5161d] to-[#790b10] border-l-[3px] border-[#d8b76a] shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
              : "hover:bg-white/10"
          }
        `}
      >
        <span className="flex items-center gap-3">
          <FaCar
            className={
              location.pathname === "/katalog"
                ? "text-[#f1d58c]"
                : "text-white"
            }
          />

          <span className="text-sm font-semibold">
            Katalog
          </span>
        </span>

        <span
          className={
            location.pathname === "/katalog"
              ? "text-[#f1d58c] text-lg"
              : "text-white/60 text-lg"
          }
        >
          ›
        </span>
      </Link>
    </li>

    {/* ================================================= */}
    {/* TENTANG KAMI */}
    {/* ================================================= */}
    <li className="relative z-10">
      <Link
        to="/tentang-kami"
        onClick={handleMenuClick("/tentang-kami")}
        className={`
          flex items-center gap-3
          rounded-xl
          py-3 px-4
          transition-all duration-300
          ${
            location.pathname === "/tentang-kami"
              ? "bg-gradient-to-r from-[#a5161d] to-[#790b10] border-l-[3px] border-[#d8b76a] shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
              : "hover:bg-white/10"
          }
        `}
      >
        <FaInfoCircle
          className={
            location.pathname === "/tentang-kami"
              ? "text-[#f1d58c]"
              : "text-white"
          }
        />

        <span className="text-sm font-semibold">
          Tentang Kami
        </span>
      </Link>
    </li>

    {/* ================================================= */}
    {/* WELCOME SECTION */}
    {/* ================================================= */}
    <li className="relative z-10 mt-25 px-2">

      {/* Gold divider */}
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af62]" />

        <span className="text-[#d4af62] text-xs">
          ✦
        </span>

        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af62]" />
      </div>

      {/* Label */}
      <p
        className="
          text-[9px]
          uppercase
          tracking-[0.28em]
          font-semibold
          text-[#d8b76a]
          mb-2
        "
      >
        Selamat Datang
      </p>

      {/* Judul */}
      <h2
        className="
          text-[21px]
          leading-tight
          text-white
          font-medium
        "
        style={{
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Selamat Datang
        <br />
        di MobilKu
      </h2>

      {/* Deskripsi */}
      <p className="mt-3 text-[11px] leading-relaxed text-white/65 max-w-[210px]">
        Pusat terpercaya dalam penyedia mobil second berkualitas.
      </p>

      {/* Gold divider bawah */}
      <div className="flex items-center gap-3 mt-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af62]/70" />

        <span className="text-[#d4af62]/80 text-[10px]">
          ✦
        </span>

        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af62]/70" />
      </div>

    </li>

  </ul>
</div>





      </div>

      <LoginModal setLoggedIn={setLoggedIn} />
      <DaftarModal setLoggedIn={setLoggedIn} />

      {isNavigating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
    </nav>
  );
}

export default Navbar;