import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaWhatsapp,
  FaPen,
  FaArrowLeft,
  FaUser,
  FaLock,
  FaCheck,
} from "react-icons/fa";

const Profil = () => {
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [noHp, setNoHp] = useState("");
  const [username, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Kalau dibuka dari tombol "Pengaturan" (/profile?edit=true), langsung
  // tampilkan form edit (konsep lama), bukan kartu profil.
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true",
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const user = response.data.user;
        setFullName(user.fullName);
        setNoHp(user.noHp || "");
        setuserName(user.username);
        setEmail(user.email);
        setIsLoading(false);
      });
  }, []);

  // Halaman "/profile" dan "/profile?edit=true" sama-sama membuka
  // komponen ini, jadi kalau usernya sudah ada di halaman ini lalu klik
  // "Profil" atau "Pengaturan" lagi, komponennya TIDAK dibuat ulang -
  // cuma URL-nya yang berubah. Tanpa ini, isEditing tidak ikut ter-update
  // (itu penyebab "macet" saat klik Profil/Pengaturan berulang kali).
  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    axios
      .put(
        `/api/auth/profile`,
        { fullName, noHp },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        alert(response.data.message);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const updatedUser = { ...storedUser, fullName, noHp };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload();
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "Gagal menyimpan perubahan. Coba lagi.",
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("password baru dan konfirmasi password tidak cocok");
      return;
    }
    setIsChangingPassword(true);
    axios
      .put(
        "/api/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        alert(response.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "Gagal mengubah password. Coba lagi.",
        );
      })
      .finally(() => {
        setIsChangingPassword(false);
      });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner text-[#8f1117]"></span>
      </div>
    );
  }

  const cleanedPhone = noHp ? noHp.replace(/\D/g, "") : "";
  const waLink = cleanedPhone
    ? `https://wa.me/${
        cleanedPhone.startsWith("62")
          ? cleanedPhone
          : "62" + cleanedPhone.replace(/^0/, "")
      }`
    : null;

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto px-4 pt-6 pb-10">
        {/* ===== GREETING ===== */}
        <div className="mb-6">
          <h1 className="text-[18px] font-semibold text-gray-800">
            Selamat datang,
            <span className="text-[#8f1117] font-bold"> {fullName}</span> 👋
          </h1>
          <p className="text-[12px] text-gray-500 mt-1">
            Senang melihat Anda kembali di MobilKu
          </p>
        </div>

        {!isEditing ? (
          // ===== VIEW MODE =====
          <div className="max-w-sm mx-auto">
            <div className="rounded-[30px] bg-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden pt-4 pb-6 px-5">
              {/* COVER */}
              <div className="relative h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-[#8f1117] via-[#6e0d10] to-[#3a0d11]">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />

                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white text-[#8f1117] flex items-center justify-center shadow-md"
                >
                  <FaPen size={13} />
                </button>
              </div>

              {/* AVATAR */}
              <div className="flex justify-center -mt-10 mb-3 relative z-10">
                <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-br from-[#f0d9a0] via-[#d4af62] to-[#a9793a] flex items-center justify-center text-[#3A0D11] font-extrabold text-[20px] border-[4px] border-white">
                  {getInitials(fullName)}
                </div>
              </div>

              {/* TEXT */}
              <p className="text-center text-[13px] text-gray-400">
                Hi,{" "}
                <span className="text-[#8f1117] font-semibold">
                  {fullName}
                </span>{" "}
                👋
              </p>

              <h2 className="text-center font-bold text-[18px] text-gray-900 mt-1">
                {fullName}
              </h2>

              <p className="text-center text-[12px] text-gray-500 mt-2">
                Member MobilKu · pembeli terpercaya mobil berkualitas
              </p>

              {/* ACTION */}
              <div className="flex justify-center gap-3 mt-4">
                <a
                  href={`mailto:${email}`}
                  className="w-10 h-10 rounded-full bg-red-50 text-[#8f1117] flex items-center justify-center"
                >
                  <FaEnvelope size={14} />
                </a>

                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-red-50 text-[#8f1117] flex items-center justify-center"
                  >
                    <FaWhatsapp size={14} />
                  </a>
                )}
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#b5161f] to-[#7a0e12] text-white py-3 font-bold"
              >
                Edit Profil & Keamanan
              </button>
            </div>
          </div>
        ) : (
          // ===== EDIT MODE (lebih menarik) =====
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 text-sm text-[#8f1117] font-semibold mb-4 hover:underline"
            >
              <FaArrowLeft className="text-[12px]" /> Kembali
            </button>

            {/* DATA DIRI */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden mb-6"
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#8f1117] via-[#d4af62] to-[#8f1117]" />
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-white border border-red-100 text-[#8f1117] flex items-center justify-center">
                    <FaUser className="text-[14px]" />
                  </span>
                  <h2 className="text-[15px] font-bold text-gray-900">
                    Data Diri
                  </h2>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#5f0a0d] mb-1.5 block">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-[14px]">
                      <FaUser />
                    </span>
                    <input
                      value={username}
                      disabled
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Username tidak bisa diubah
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#5f0a0d] mb-1.5 block">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-[14px]">
                      <FaEnvelope />
                    </span>
                    <input
                      value={email}
                      disabled
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Email tidak bisa diubah
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#5f0a0d] mb-1.5 block">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f1117]/50 text-[14px]">
                      <FaUser />
                    </span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama lengkap"
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8f1117]/25 focus:border-[#8f1117] transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#5f0a0d] mb-1.5 block">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f1117]/50 text-[14px]">
                      <FaWhatsapp />
                    </span>
                    <input
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8f1117]/25 focus:border-[#8f1117] transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#a5161d] to-[#790b10] text-white text-sm font-bold py-2.5 shadow-[0_8px_20px_-6px_rgba(143,17,23,0.5)] hover:shadow-[0_10px_26px_-6px_rgba(143,17,23,0.6)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <FaCheck className="text-[12px]" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* UBAH PASSWORD */}
            <form
              onSubmit={handleChangePassword}
              className="bg-white rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden"
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#8f1117] via-[#d4af62] to-[#8f1117]" />
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-white border border-red-100 text-[#8f1117] flex items-center justify-center">
                    <FaLock className="text-[13px]" />
                  </span>
                  <h2 className="text-[15px] font-bold text-gray-900">
                    Ubah Password
                  </h2>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#5f0a0d] mb-1.5 block">
                    Password Lama
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f1117]/50 text-[14px]">
                      <FaLock />
                    </span>
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan password lama"
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-10 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8f1117]/25 focus:border-[#8f1117] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8f1117] transition-colors"
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#5f0a0d] mb-1.5 block">
                    Password Baru
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f1117]/50 text-[14px]">
                      <FaLock />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru"
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-10 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8f1117]/25 focus:border-[#8f1117] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8f1117] transition-colors"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#5f0a0d] mb-1.5 block">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f1117]/50 text-[14px]">
                      <FaLock />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Masukkan password baru"
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-10 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8f1117]/25 focus:border-[#8f1117] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8f1117] transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={isChangingPassword}
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#a5161d] to-[#790b10] text-white text-sm font-bold py-2.5 shadow-[0_8px_20px_-6px_rgba(143,17,23,0.5)] hover:shadow-[0_10px_26px_-6px_rgba(143,17,23,0.6)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <FaCheck className="text-[12px]" />
                      Konfirmasi Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Profil;
