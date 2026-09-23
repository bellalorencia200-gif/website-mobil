import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfilModal from "../components/ProfilModal.jsx";
import GantiPasswordModal from "../components/GantiPasswordModal.jsx";
import BottomNav from "../components/BottomNav.jsx";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [dropdownAkunTerbuka, setDropdownAkunTerbuka] = useState(false);
  const [akunLoading, setAkunLoading] = useState(false);
  const [profilModalTerbuka, setProfilModalTerbuka] = useState(false);
  const [passwordModalTerbuka, setPasswordModalTerbuka] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  const jalankanAksiAkun = (aksi) => {
    setDropdownAkunTerbuka(false);
    setAkunLoading(true);
    setTimeout(() => {
      setAkunLoading(false);
      aksi();
    }, 400);
  };

  const tutupMenu = () => setMenuTerbuka(false);
  const bukaMenu = () => {
    setMenuLoading(true);
    setTimeout(() => {
      setMenuLoading(false);
      setMenuTerbuka(true);
    }, 400);
  };
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-red-700 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={bukaMenu} className="p-1" aria-label="Buka menu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Mobilku</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownAkunTerbuka((sebelumnya) => !sebelumnya)}
            className="w-9 h-9 rounded-full bg-[#ffe0c2] border-2 border-white/60 flex items-center justify-center flex-shrink-0 overflow-hidden p-0"
            aria-label="Menu akun"
          >
            <svg width="38" height="38" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="32" fill="#ffe0c2" />
              <path
                d="M32 6c14 0 22 10 22 22 0 4-1 7-2 9-2-3-4-5-7-6 1-3 1-6 0-9-3 4-8 6-13 6s-10-2-13-6c-1 3-1 6 0 9-3 1-5 3-7 6-1-2-2-5-2-9 0-12 8-22 22-22z"
                fill="#3f2d20"
              />
              <circle cx="23" cy="34" r="4.2" fill="#2b2b2b" />
              <circle cx="41" cy="34" r="4.2" fill="#2b2b2b" />
              <circle cx="24.3" cy="32.3" r="1.3" fill="#ffffff" />
              <circle cx="42.3" cy="32.3" r="1.3" fill="#ffffff" />
              <circle cx="18" cy="40" r="3.5" fill="#ffb3ab" opacity="0.7" />
              <circle cx="46" cy="40" r="3.5" fill="#ffb3ab" opacity="0.7" />
              <path
                d="M27 44c2 2 8 2 10 0"
                stroke="#a1594a"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {dropdownAkunTerbuka && (
            <>
              <div
                onClick={() => setDropdownAkunTerbuka(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 top-11 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() =>
                    jalankanAksiAkun(() => setProfilModalTerbuka(true))
                  }
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profil Saya
                </button>
                <button
                  onClick={() =>
                    jalankanAksiAkun(() => setPasswordModalTerbuka(true))
                  }
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Pengaturan Akun
                </button>

                <div className="border-t border-gray-200 my-1" />
                <button
                  onClick={() => jalankanAksiAkun(handleLogout)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {menuLoading && (
        <div className="md:hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      {menuTerbuka && (
        <div
          onClick={tutupMenu}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      <div
        className={`w-64 bg-red-700 text-white p-4 min-h-screen flex flex-col fixed md:static top-0 left-0 z-50 transition-transform duration-300 ${
          menuTerbuka ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <h1 className="text-2xl font-bold mb-4">Mobilku</h1>
        <ul className="list-none flex flex-col gap-2">
          <li>
            <NavLink
              to="/admin"
              end
              onClick={tutupMenu}
              className={({ isActive }) =>
                isActive
                  ? "btn bg-white text-red-700 w-full mb-1"
                  : "btn bg-red-700 text-white hover:bg-red-800 w-full mb-1"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/mobil"
              onClick={tutupMenu}
              className={({ isActive }) =>
                isActive
                  ? "btn bg-white text-red-700 w-full mb-1"
                  : "btn bg-red-700 text-white hover:bg-red-800 w-full mb-1"
              }
            >
              Kelola Mobil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/kategori"
              onClick={tutupMenu}
              className={({ isActive }) =>
                isActive
                  ? "btn bg-white text-red-700 w-full mb-1"
                  : "btn bg-red-700 text-white hover:bg-red-800 w-full mb-1"
              }
            >
              Kelola Kategori
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/user"
              onClick={tutupMenu}
              className={({ isActive }) =>
                isActive
                  ? "btn bg-white text-red-700 w-full mb-1"
                  : "btn bg-red-700 text-white hover:bg-red-800 w-full mb-1"
              }
            >
              Kelola User
            </NavLink>
          </li>
          <li>
          <NavLink
              to="/admin/lokasi"
              onClick={tutupMenu}
              className={({ isActive }) =>
                isActive
                  ? "btn bg-white text-red-700 w-full mb-1"
                  : "btn bg-red-700 text-white hover:bg-red-800 w-full mb-1"
              }
            >
              Pengaturan Lokasi
            </NavLink>
            </li>
             <li>
            <NavLink
              to="/admin/testimoni"
              onClick={tutupMenu}
              className={({ isActive }) =>
                isActive
                  ? "btn bg-white text-red-700 w-full mb-1"
                  : "btn bg-red-700 text-white hover:bg-red-800 w-full mb-1"
              }
            >
              Kelola Testimoni
            </NavLink>
          </li>
        </ul>
        <div className="mt-auto pt-6 border-t border-red-400">
          <p className="text-white text-sm font-semibold">Halo, Admin</p>
          <p className="text-red-200 text-xs mb-3">Administrator</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-white text-sm py-2 px-3 rounded hover:bg-red-800 active:bg-red-900 transition"
          >
            Keluar
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0 p-8 pt-20 pb-24 md:pt-8 md:pb-8">
        <Outlet />
      </div>

      {akunLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      {profilModalTerbuka && (
        <ProfilModal onClose={() => setProfilModalTerbuka(false)} />
      )}

      {passwordModalTerbuka && (
        <GantiPasswordModal onClose={() => setPasswordModalTerbuka(false)} />
      )}

      <BottomNav />
    </div>
  );
};

export default Admin;
