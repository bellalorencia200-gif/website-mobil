import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ferariadmin from "../assets/ferariadmin.avif";
import logoMobilku from "../assets/logomobilkuwhite.png";
import ProfilModal from "../components/ProfilModal.jsx";
import GantiPasswordModal from "../components/GantiPasswordModal.jsx";
import BottomNav from "../components/BottomNav.jsx";
import axios from "../api/axiosInstance";

import {
  FaTachometerAlt,
  FaCarSide,
  FaThLarge,
  FaUsers,
  FaMapMarkerAlt,
  FaComments,
  FaHandshake,
  FaSignOutAlt,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [dropdownAkunTerbuka, setDropdownAkunTerbuka] = useState(false);

  const [profilModalTerbuka, setProfilModalTerbuka] = useState(false);
  const [passwordModalTerbuka, setPasswordModalTerbuka] = useState(false);

  // Loading spinner saat pindah menu
  const [isNavigating, setIsNavigating] = useState(false);

   /* =========================================================
     NOTIFIKASI: JUMLAH PENGAJUAN JUAL YANG MASIH "BARU"
     - dicek saat halaman dibuka, saat pindah menu, tiap 30 detik,
       dan langsung setelah admin mengubah/menghapus pengajuan
  ========================================================= */
  const [pengajuanBaru, setPengajuanBaru] = useState(0);

  useEffect(() => {
    const cekPengajuanBaru = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      axios
        .get("/api/jual-mobil", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const daftar = response.data.pengajuan || [];
          setPengajuanBaru(daftar.filter((p) => p.status === "baru").length);
        })
        .catch(() => {});
    };

    cekPengajuanBaru();
    const timer = setInterval(cekPengajuanBaru, 30000);
    window.addEventListener("focus", cekPengajuanBaru);
    window.addEventListener("pengajuan-berubah", cekPengajuanBaru);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", cekPengajuanBaru);
      window.removeEventListener("pengajuan-berubah", cekPengajuanBaru);
    };
  }, [location.pathname]);

  /* =========================================================
     SCROLL KE ATAS SAAT PINDAH HALAMAN
  ========================================================= */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* =========================================================
     LOGOUT
  ========================================================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  /* =========================================================
     MOBILE MENU
  ========================================================= */
  const tutupMenu = () => {
    setMenuTerbuka(false);
  };

  // Klik tombol ☰ (HP): tampilkan loading sebentar, lalu buka menu samping
  const bukaMenu = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
      setMenuTerbuka(true);
    }, 400);
  };

  /* =========================================================
     KLIK MENU: TAMPILKAN SPINNER LALU PINDAH HALAMAN
  ========================================================= */
  const handleMenuClick = (path) => (e) => {
    // klik menu yang sedang aktif: cukup tutup menu, tanpa spinner
    if (location.pathname === path) {
      tutupMenu();
      return;
    }
    e.preventDefault();
    setIsNavigating(true);
    tutupMenu();
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 400);
  };

  /* =========================================================
     DATA MENU
  ========================================================= */
  const menuItems = [
    {
      to: "/admin",
      label: "Dashboard",
      deskripsi: "Ringkasan data & aktivitas",
      icon: FaTachometerAlt,
      grup: "Utama",
    },
    {
      to: "/admin/mobil",
      label: "Manajemen Mobil",
      deskripsi: "Kelola unit, harga & galeri",
      icon: FaCarSide,
      grup: "Manajemen Data",
    },
    {
      to: "/admin/kategori",
      label: "Kategori Kendaraan",
      deskripsi: "Pengelompokan jenis & segmen",
      icon: FaThLarge,
      grup: "Manajemen Data",
    },
    {
      to: "/admin/user",
      label: "Manajemen Pengguna",
      deskripsi: "Kontrol akun & hak akses",
      icon: FaUsers,
      grup: "Manajemen Data",
    },

    {
      to: "/admin/pengajuan",
      label: "Pengajuan Jual",
      deskripsi: "Mobil yang ingin dijual ke kami",
      icon: FaHandshake,
      grup: "Manajemen Data",
      badge: pengajuanBaru,
    },
    {
      to: "/admin/lokasi",
      label: "Lokasi Showroom",
      deskripsi: "Alamat, area & jam operasional",
      icon: FaMapMarkerAlt,
      grup: "Pengaturan",
    },
    {
      to: "/admin/testimoni",
      label: "Ulasan Pelanggan",
      deskripsi: "Feedback & pengalaman pengguna",
      icon: FaComments,
      grup: "Pengaturan",
    },
  ];

  const grupMenu = ["Utama", "Manajemen Data", "Pengaturan"];

  return (
    <div className="flex min-h-screen bg-[#F7F3ED] overflow-x-clip text-gray-900 font-sans">
      {/* =====================================================
          MOBILE TOPBAR BANNER
      ===================================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-[68px] bg-gradient-to-r from-[#790D12] via-[#58090D] to-[#320609] flex items-center justify-between px-4 text-white border-b border-white/[0.07] shadow-[0_8px_25px_rgba(50,0,0,0.25)]">
        {/* MOBILE LEFT */}
        <div className="relative flex items-center gap-3">
          <button
            onClick={menuTerbuka ? tutupMenu : bukaMenu}
            className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center text-white hover:bg-white/[0.13] active:scale-95 transition"
          >
            {menuTerbuka ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
          </button>
          {/* titik merah: ada pengajuan jual baru */}
          {pengajuanBaru > 0 && !menuTerbuka && (
            <span className="absolute left-[24px] -top-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold leading-[18px] text-center ring-2 ring-[#58090D] pointer-events-none">
              {pengajuanBaru > 9 ? "9+" : pengajuanBaru}
            </span>
          )}

          {/* Mobile: tulisan MobilKu saja (tanpa logo mobil) */}
          <span
            className="text-white text-xl font-normal leading-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            MobilKu
          </span>
        </div>

        {/* MOBILE ACCOUNT */}
        <div className="relative">
          <button
            onClick={() => setDropdownAkunTerbuka(!dropdownAkunTerbuka)}
            className="relative w-9 h-9 rounded-full border border-[#E4B87C]/70 bg-gradient-to-br from-[#F0CE94] to-[#B98442] text-[#5E0D12] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition"
          >
            <FaUserCircle className="text-lg" />
            <span className="absolute right-[-1px] bottom-[-1px] w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#58090D]" />
          </button>

          {/* MOBILE ACCOUNT DROPDOWN */}
          {dropdownAkunTerbuka && (
            <div className="absolute top-12 right-0 w-48 rounded-2xl bg-white text-gray-800 shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden py-1 z-[70]">
              <button
                onClick={() => {
                  setProfilModalTerbuka(true);
                  setDropdownAkunTerbuka(false);
                }}
                className="w-full flex items-center px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 transition"
              >
                Lihat Profil
              </button>

              <button
                onClick={() => {
                  setPasswordModalTerbuka(true);
                  setDropdownAkunTerbuka(false);
                }}
                className="w-full flex items-center px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 transition"
              >
                Ganti Password
              </button>

              <div className="h-px bg-gray-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BACKDROP UNTUK MOBILE */}
      {menuTerbuka && (
        <div
          onClick={tutupMenu}
          className="md:hidden fixed inset-0 bg-black/50 z-[55] backdrop-blur-sm transition-opacity"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-[60] w-[300px] h-screen md:self-start shrink-0 flex flex-col overflow-hidden text-white px-5 py-7 shadow-[12px_0_45px_rgba(40,0,0,0.2)] transition-transform duration-300 ease-out ${
          menuTerbuka ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* BASE COLOR */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#810D12] via-[#62090E] to-[#35070A] z-0" />

        {/* FOTO FERRARI BACKGROUND */}
        <div className="absolute left-0 right-0 bottom-0 h-[61%] z-[1] pointer-events-none overflow-hidden">
          <img
            src={ferariadmin}
            alt=""
            className="w-full h-full object-cover object-center opacity-[0.44] scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#62090E] via-[#62090E]/40 via-[45%] to-[#280508]/95" />
          <div className="absolute bottom-[12%] left-[15%] w-[260px] h-[150px] rounded-full bg-red-600/10 blur-3xl" />
        </div>

        {/* GOLD ATMOSPHERE */}
        <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-[#E4B87C]/[0.045] blur-3xl z-[2]" />
        <div className="absolute bottom-[150px] left-[-100px] w-[220px] h-[220px] rounded-full bg-[#E4B87C]/[0.035] blur-3xl z-[2]" />

        {/* ANIMATION STYLES */}
        <style>{`
          @keyframes menuMasuk {
            from { opacity: 0; transform: translateX(-14px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes goldPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(246, 212, 122, 0.5); }
            50% { box-shadow: 0 0 0 5px rgba(246, 212, 122, 0); }
          }
          @keyframes goldShine {
            0% { transform: translateX(-180%) skewX(-20deg); }
            60%, 100% { transform: translateX(450%) skewX(-20deg); }
          }
          .menu-masuk { animation: menuMasuk 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
          .gold-pulse { animation: goldPulse 2s ease-in-out infinite; }
          .gold-shine { animation: goldShine 4s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .menu-masuk, .gold-pulse, .gold-shine { animation: none; }
          }
        `}</style>

        {/* LOGO */}
        <div className="relative z-10 flex items-center px-2 mb-8">
          <img
            src={logoMobilku}
            alt="Mobilku Premium Auto"
            className="w-[190px] h-auto object-contain object-left"
          />
        </div>

        {/* MENU NAVIGASI */}
        <nav className="relative z-10 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {grupMenu.map((namaGrup, indexGrup) => (
            <div key={namaGrup} className={indexGrup > 0 ? "mt-6" : ""}>
              <div className="flex items-center gap-3 px-3 mb-2.5">
                <span className="text-[10px] font-extrabold tracking-[0.28em] uppercase text-[#E4B87C]/85 whitespace-nowrap">
                  {namaGrup}
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-[#E4B87C]/35 to-transparent" />
              </div>

              <ul className="space-y-1.5">
                {menuItems
                  .filter((item) => item.grup === namaGrup)
                  .map((item) => {
                    const Icon = item.icon;
                    const urutan = menuItems.indexOf(item);

                    return (
                      <li
                        key={item.to}
                        className="menu-masuk"
                        style={{ animationDelay: `${urutan * 70}ms` }}
                      >
                        <NavLink
                          to={item.to}
                          end={item.to === "/admin"}
                          onClick={handleMenuClick(item.to)}
                          className={({ isActive }) =>
                            `group relative flex items-center gap-3 w-full pl-3 pr-3.5 py-2.5 rounded-2xl overflow-hidden transition-all duration-300 ${
                              isActive
                                ? "bg-gradient-to-r from-[#F6D47A] via-[#E4B87C] to-[#D6A760] text-[#5A0E12] shadow-[0_10px_28px_rgba(228,184,124,0.25)] ring-1 ring-[#F6D47A]/70"
                                : "text-white hover:bg-white/[0.055] hover:text-white hover:translate-x-1 hover:ring-1 hover:ring-white/[0.08]"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-8 rounded-r-full bg-[#FFF0C8] shadow-[0_0_12px_rgba(246,212,122,0.7)] transition-transform duration-300 ${
                                  isActive ? "scale-y-100" : "scale-y-0"
                                }`}
                              />

                              {isActive && (
                                <span className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/25 to-transparent gold-shine pointer-events-none" />
                              )}

                              <span
                                className={`relative w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                  isActive
                                    ? "bg-white/35 text-[#5A0E12] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                                    : "bg-white/[0.055] text-[#F0D09B] ring-1 ring-white/[0.08] group-hover:bg-[#E4B87C]/15 group-hover:text-[#F6D47A] group-hover:ring-[#E4B87C]/30 group-hover:scale-105"
                                }`}
                              >
                                <Icon className="text-[16px]" />
                              </span>

                              <span className="relative flex-1 min-w-0">
                                <span
                                  className={`block text-[14px] font-bold tracking-[0.05px] leading-[1.25] whitespace-nowrap transition-colors duration-300 ${
                                    isActive ? "text-[#4F0A0E]" : "text-white"
                                  }`}
                                >
                                  {item.label}
                                </span>
                                <span
                                  className={`block text-[10.5px] font-medium leading-[1.35] mt-1 truncate transition-colors duration-300 ${
                                    isActive
                                      ? "text-[#74451F]"
                                      : "text-white/65 group-hover:text-white/80"
                                  }`}
                                >
                                  {item.deskripsi}
                                </span>
                              </span>

                                                           {item.badge > 0 ? (
                                <span
                                  className={`relative shrink-0 min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-extrabold leading-[22px] text-center shadow-[0_4px_12px_rgba(239,68,68,0.45)] ${
                                    isActive ? "bg-[#8f1117] text-white" : "bg-[#EF4444] text-white"
                                  }`}
                                  title={`${item.badge} pengajuan baru`}
                                >
                                  {item.badge > 99 ? "99+" : item.badge}
                                </span>
                              ) : isActive ? (
                                <span className="relative w-2 h-2 shrink-0 rounded-full bg-[#8B531C] gold-pulse" />
                              ) : (
                                <FaChevronRight className="shrink-0 text-[9px] text-[#E4B87C]/70 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                              )}
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        {/* PROFILE ADMIN FOOTER SIDEBAR */}
        <div className="relative z-20 mt-4 pt-4 border-t border-white/[0.09]">
          {/* DROPDOWN AKUN DESKTOP */}
          {dropdownAkunTerbuka && (
            <div className="hidden md:block absolute bottom-[78px] left-0 right-0 rounded-2xl bg-white text-gray-800 shadow-[0_20px_45px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden py-1 z-[80]">
              <button
                onClick={() => {
                  setProfilModalTerbuka(true);
                  setDropdownAkunTerbuka(false);
                }}
                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 transition"
              >
                Lihat Profil
              </button>
              <button
                onClick={() => {
                  setPasswordModalTerbuka(true);
                  setDropdownAkunTerbuka(false);
                }}
                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 transition"
              >
                Ganti Password
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 px-2 py-2.5 rounded-2xl bg-white/[0.035] border border-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <button
              onClick={() => setDropdownAkunTerbuka(!dropdownAkunTerbuka)}
              className="relative w-11 h-11 shrink-0 rounded-full border border-[#E4B87C]/80 bg-gradient-to-br from-[#7F171C] to-[#3D090C] flex items-center justify-center text-[#E4B87C] shadow-[0_4px_15px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition"
            >
              <FaUserCircle className="text-xl" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-[#3D090C]" />
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-bold text-white tracking-[0.1px] truncate">
                Admin MobilKu
              </p>
              <p className="text-[11px] text-[#E4B87C]/80 font-medium truncate">
                Super Administrator
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition"
              title="Keluar"
            >
              <FaSignOutAlt className="text-xs" />
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT AREA
      ===================================================== */}
      <div className="flex-1 flex flex-col min-w-0 pt-[68px] md:pt-0">
        {/* OUTLET PAGE CONTENT (HP: ruang bawah ekstra agar konten tidak tertutup menu bawah) */}
        <main className="flex-1 overflow-y-auto pt-1.5 pb-28 px-4 md:pt-2 md:pb-6 md:px-6 bg-[#F7F3ED]">
          <Outlet />
        </main>

        <BottomNav />
      </div>

      {/* LOADING SPINNER SAAT PINDAH MENU */}
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      {/* MODAL COMPONENTS */}
      {profilModalTerbuka && (
        <ProfilModal onClose={() => setProfilModalTerbuka(false)} />
      )}
      {passwordModalTerbuka && (
        <GantiPasswordModal onClose={() => setPasswordModalTerbuka(false)} />
      )}
    </div>
  );
};

export default Admin;
