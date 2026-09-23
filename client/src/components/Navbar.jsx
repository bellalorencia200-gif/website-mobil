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
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [username, setUsername] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
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
      {/* Garis aksen tipis di puncak header */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      <div className="drawer">
        <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* ===== TOP BAR ===== */}
          <div className="flex justify-between items-center bg-[#6e0d10] border-b border-white/10 text-white text-xs md:text-sm px-4 md:px-6 py-2">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="hidden sm:flex items-center gap-1.5 opacity-90 hover:opacity-100 transition">
                <FaPhoneAlt className="text-[11px]" />
                082176957132
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
          <div className="relative flex items-center justify-between bg-gradient-to-b from-[#b3141c] via-[#96131a] to-[#7a0e12] border-b-2 border-white shadow-lg px-4 md:px-6 py-2.5 md:py-3 overflow-hidden">
            {/* Efek glow di belakang logo */}
            <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>

            {/* Hamburger (mobile) */}
            <label
              htmlFor="my-drawer-1"
              className="md:hidden cursor-pointer z-10"
            >
              <RxHamburgerMenu className="text-white text-2xl" />
            </label>

            {/* Logo */}
            <Link to="/" className="flex flex-col gap-1 relative z-10 group">
              {/* Mobile: teks saja, gaya serif */}
              <span
                className="md:hidden text-white text-xl font-normal -ml-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                MobilKu
              </span>

              {/* Desktop: logo gambar + subtitle (tidak berubah) */}
              <img
                src="/src/assets/logomobilkuwhite.png"
                alt="MobilKu"
                className="hidden md:block h-8 md:h-10 w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.55)] group-hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.8)] transition duration-300"
              />
              <span className="hidden md:block text-[9px] font-semibold tracking-[0.35em] text-white/80 pl-0.5">
                PREMIUM AUTO
              </span>
            </Link>

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
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white to-gray-100 text-red-700 flex items-center justify-center text-xs font-bold shadow-md ring-1 ring-white/60">
                      {getInitials(userName)}
                    </div>
                  </div>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-white rounded-xl z-[50] w-64 p-2 shadow-xl text-gray-800 border border-gray-100 mt-2"
                  >
                    <li className="mb-2 pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-3 px-2 py-1 hover:bg-transparent cursor-default">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {getInitials(userName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {userName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            @{username}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="hover:bg-red-50 rounded-lg transition"
                      >
                        Profil Saya
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="hover:bg-red-50 rounded-lg transition"
                      >
                        Pengaturan Akun
                      </Link>
                    </li>
                    <li>
                      <a
                        href="https://wa.me/6282176957132"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-red-50 rounded-lg transition"
                      >
                        Pusat Bantuan
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FaSignOutAlt />
                        Logout
                      </a>
                    </li>
                  </ul>
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
                    className="flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-full bg-white text-red-700 text-xs font-bold uppercase tracking-wide shadow-md hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
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
          <ul className="menu bg-gradient-to-b from-[#96131a] to-[#7a0e12] text-white min-h-full w-72 p-5 gap-1">
            <li className="mb-5 pb-4 border-b border-white/15">
              <div className="flex items-center gap-2 px-2 hover:bg-transparent cursor-default">
                <img
                  src="/src/assets/logomobilkuwhite.png"
                  alt="MobilKu"
                  className="h-8 w-auto"
                />
              </div>
            </li>
            <li>
              <Link
                to="/"
                onClick={handleMenuClick("/")}
                className="flex items-center gap-3 hover:bg-white/10 rounded-lg py-3 transition"
              >
                <FaHome />
                Beranda
              </Link>
            </li>
            <li>
              <Link
                to="/katalog"
                onClick={handleMenuClick("/katalog")}
                className="flex items-center gap-3 hover:bg-white/10 rounded-lg py-3 transition"
              >
                <FaCar />
                Katalog
              </Link>
            </li>
            <li>
              <Link
                to="/tentang-kami"
                onClick={handleMenuClick("/tentang-kami")}
                className="flex items-center gap-3 hover:bg-white/10 rounded-lg py-3 transition"
              >
                <FaInfoCircle />
                Tentang Kami
              </Link>
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
