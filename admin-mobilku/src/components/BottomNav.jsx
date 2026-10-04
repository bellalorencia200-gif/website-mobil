import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Loading spinner saat pindah menu
  const [isNavigating, setIsNavigating] = useState(false);

  const handleMenuClick = (path) => (e) => {
    // klik menu yang sedang aktif: tidak perlu loading
    if (location.pathname === path) return;
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 400);
  };

  const petaTombolTambah = {
    "/admin/mobil": "btn-tambah-mobil",
    "/admin/kategori": "btn-tambah-kategori",
    "/admin/user": "btn-tambah-user",
  };

  const idTombolTambah = petaTombolTambah[location.pathname];

  const handleTambahClick = () => {
    if (idTombolTambah) {
      document.getElementById(idTombolTambah)?.click();
    }
  };

  const kelasMenu = ({ isActive }) =>
    `flex-1 flex flex-col items-center gap-0.5 py-1 ${
      isActive ? "text-[#8f1117]" : "text-gray-400"
    }`;

  return (
    <>
    {isNavigating && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    )}
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#D9A85C]/30 flex items-center px-1 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+6px)]">
      <NavLink to="/admin" end onClick={handleMenuClick("/admin")} className={kelasMenu}>
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
        <span className="text-[10px] font-bold">Dashboard</span>
      </NavLink>

      <NavLink to="/admin/mobil" onClick={handleMenuClick("/admin/mobil")} className={kelasMenu}>
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 17h14M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zM5 17l1.5-6.5A2 2 0 018.4 9h7.2a2 2 0 011.9 1.5L19 17M5 17H3m16 0h2M8 9V6a1 1 0 011-1h6a1 1 0 011 1v3" />
        </svg>
        <span className="text-[10px] font-bold">Mobil</span>
      </NavLink>

      <div className="flex-1 flex justify-center">
        <button
          onClick={handleTambahClick}
          disabled={!idTombolTambah}
          aria-label="Tambah"
          className={`w-11 h-11 rounded-full flex items-center justify-center -mt-5 border-4 border-white shadow-lg ${
            idTombolTambah
              ? "bg-gradient-to-br from-[#a5161d] to-[#5f0a0d] ring-1 ring-[#D9A85C]/50"
              : "bg-gray-300"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <NavLink to="/admin/kategori" onClick={handleMenuClick("/admin/kategori")} className={kelasMenu}>
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24L3 3v6.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.83 0l4.59-4.59a2 2 0 000-2.83z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
        <span className="text-[10px] font-bold">Kategori</span>
      </NavLink>

      <NavLink to="/admin/user" onClick={handleMenuClick("/admin/user")} className={kelasMenu}>
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
        </svg>
        <span className="text-[10px] font-bold">User</span>
      </NavLink>
    </div>
    </>
  );
};

export default BottomNav;
