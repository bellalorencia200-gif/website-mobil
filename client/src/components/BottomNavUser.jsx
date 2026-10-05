import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCar,
  FaUser, // ← BARU: ikon Akun (menggantikan FaCommentDots)
} from "react-icons/fa";

function BottomNavUser() {
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === "/";
  const isKatalog =
    path.startsWith("/katalog") || path.startsWith("/mobil");
  const isAkun = path.startsWith("/profile"); // ← BARU

  // loading spinner saat menu diklik
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const pindahHalaman = (tujuan) => (e) => {
    // Sudah berada di halaman yang sama → biarkan seperti biasa (tanpa spinner)
    if (location.pathname + location.search === tujuan) return;

    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(tujuan);
      setIsNavigating(false);
    }, 400);
  };

  // ← BARU: klik menu Akun
  // - sudah login  → buka halaman Profil
  // - belum login  → munculkan pop-up Login
  const handleAkun = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // dicek setiap kali diklik

    if (token) {
      if (path === "/profile") return; // sudah di Profil
      setIsNavigating(true);
      setTimeout(() => {
        navigate("/profile");
        setIsNavigating(false);
      }, 400);
      return;
    }

    const modalLogin = document.getElementById("my_modal_1");
    if (modalLogin) {
      modalLogin.showModal();
    } else {
      // cadangan: kalau di halaman ini tidak ada pop-up Login, kembali ke Beranda
      navigate("/");
    }
  };

  return (
    <>
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div
        className="
          relative
          grid
          grid-cols-3
          items-center
          h-[66px]
          bg-[#F7F3ED]/95
          backdrop-blur-xl
          shadow-[0_-8px_25px_-12px_rgba(24,3,5,0.35)]
        "
      >
        {/* Garis atas */}
        <div className="absolute top-1 left-0 right-0 h-px bg-[#E5E1DB]" />

        {/* ================= HOME ================= */}
        <Link
          to="/"
          onClick={pindahHalaman("/")}
          className="h-full flex items-center justify-center"
        >
          <div
            className={`
              relative
              flex
              flex-col
              items-center
              justify-center
              gap-0.5
              transition-all
              duration-300
              ease-out
              ${
                isHome
                  ? `
                    -translate-y-2
                    w-[64px]
                    h-[60px]
                    rounded-[18px]
                    bg-gradient-to-b
                    from-[#8F1117]
                    to-[#70090F]
                    border
                    border-[#D9A85C]/80
                    shadow-[0_6px_18px_-8px_rgba(122,16,24,0.65)]
                  `
                  : `
                    w-[58px]
                    h-[54px]
                  `
              }
            `}
          >
            <FaHome
              className={`
                transition-all
                duration-300
                ${
                  isHome
                    ? "text-white text-[18px] scale-105"
                    : "text-[#6B7280] text-[16px]"
                }
              `}
            />

            <span
              className={`
                text-[9px]
                transition-all
                duration-300
                ${
                  isHome
                    ? "text-white font-bold"
                    : "text-[#6B7280] font-semibold"
                }
              `}
            >
              Home
            </span>

            {isHome && (
              <span
                className="
                  absolute
                  -bottom-1
                  w-7
                  h-[3px]
                  rounded-full
                  bg-[#D9A85C]
                "
              />
            )}
          </div>
        </Link>

        {/* ================= KATALOG ================= */}
        <Link
          to="/katalog"
          onClick={pindahHalaman("/katalog")}
          className="h-full flex items-center justify-center"
        >
          <div
            className={`
              relative
              flex
              flex-col
              items-center
              justify-center
              gap-0.5
              transition-all
              duration-300
              ease-out
              ${
                isKatalog
                  ? `
                    -translate-y-2
                    w-[64px]
                    h-[60px]
                    rounded-[18px]
                    bg-gradient-to-b
                    from-[#8F1117]
                    to-[#70090F]
                    border
                    border-[#D9A85C]/80
                    shadow-[0_6px_18px_-8px_rgba(122,16,24,0.65)]
                  `
                  : `
                    w-[58px]
                    h-[54px]
                  `
              }
            `}
          >
            <FaCar
              className={`
                transition-all
                duration-300
                ${
                  isKatalog
                    ? "text-white text-[19px] scale-105"
                    : "text-[#6B7280] text-[16px]"
                }
              `}
            />

            <span
              className={`
                text-[9px]
                transition-all
                duration-300
                ${
                  isKatalog
                    ? "text-white font-bold"
                    : "text-[#6B7280] font-semibold"
                }
              `}
            >
              Katalog
            </span>

            {isKatalog && (
              <span
                className="
                  absolute
                  -bottom-1
                  w-7
                  h-[3px]
                  rounded-full
                  bg-[#D9A85C]
                  shadow-[0_0_8px_rgba(217,168,92,0.45)]
                "
              />
            )}
          </div>
        </Link>

        {/* ================= AKUN (BARU, menggantikan Chats) ================= */}
        <Link
          to="/profile"
          onClick={handleAkun}
          aria-label="Akun"
          className="h-full flex items-center justify-center"
        >
          <div
            className={`
              relative
              flex
              flex-col
              items-center
              justify-center
              gap-0.5
              transition-all
              duration-300
              ease-out
              active:scale-95
              ${
                isAkun
                  ? `
                    -translate-y-2
                    w-[64px]
                    h-[60px]
                    rounded-[18px]
                    bg-gradient-to-b
                    from-[#8F1117]
                    to-[#70090F]
                    border
                    border-[#D9A85C]/80
                    shadow-[0_6px_18px_-8px_rgba(122,16,24,0.65)]
                  `
                  : `
                    w-[58px]
                    h-[54px]
                  `
              }
            `}
          >
            <FaUser
              className={`
                transition-all
                duration-300
                ${
                  isAkun
                    ? "text-white text-[17px] scale-105"
                    : "text-[#6B7280] text-[15px]"
                }
              `}
            />

            <span
              className={`
                text-[9px]
                transition-all
                duration-300
                ${
                  isAkun
                    ? "text-white font-bold"
                    : "text-[#6B7280] font-semibold"
                }
              `}
            >
              Akun
            </span>

            {isAkun && (
              <span
                className="
                  absolute
                  -bottom-1
                  w-7
                  h-[3px]
                  rounded-full
                  bg-[#D9A85C]
                  shadow-[0_0_8px_rgba(217,168,92,0.45)]
                "
              />
            )}
          </div>
        </Link>
      </div>
    </div>

      {/* LOADING SPINNER SAAT KLIK MENU */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
    </>
  );
}

export default BottomNavUser;