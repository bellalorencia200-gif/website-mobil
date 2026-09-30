import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCar,
  FaCommentDots,
} from "react-icons/fa";

function BottomNavUser() {
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === "/";
  const isKatalog =
  path.startsWith("/katalog") || path.startsWith("/mobil");

  return (
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

        {/* ================= CHATS ================= */}
        
         <a href="https://wa.me/6282176957132"
          target="_blank"
          rel="noopener noreferrer"
          className="h-full flex items-center justify-center"
        >
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-0.5
              w-[58px]
              h-[54px]
              transition-all
              duration-200
              active:scale-95
            "
          >
            <FaCommentDots className="text-[16px] text-[#6B7280]" />

            <span className="text-[9px] text-[#6B7280] font-semibold">
              Chats
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default BottomNavUser;