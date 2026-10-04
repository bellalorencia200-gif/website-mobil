import { useState } from "react";
import axios from "../api/axiosInstance";
import {
  FaTimes,
  FaLock,
  FaKey,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const GantiPasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Semua field wajib diisi");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak sama");
      return;
    }

    setIsSubmitting(true);
    axios
      .put(
        "/api/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        setSuccess("Password berhasil diubah");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsSubmitting(false);
        setTimeout(() => {
          onClose();
        }, 1500);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Gagal mengubah password");
        setIsSubmitting(false);
      });
  };

  // ==========================================
  // TAMPILAN SAJA
  // ==========================================
  const cocok = confirmPassword.length > 0 && confirmPassword === newPassword;
  const tidakCocok = confirmPassword.length > 0 && confirmPassword !== newPassword;

  const kolom = [
    {
      label: "Password Lama",
      icon: FaLock,
      value: oldPassword,
      setValue: setOldPassword,
      show: showOldPassword,
      setShow: setShowOldPassword,
      placeholder: "Masukkan password saat ini",
    },
    {
      label: "Password Baru",
      icon: FaKey,
      value: newPassword,
      setValue: setNewPassword,
      show: showNewPassword,
      setShow: setShowNewPassword,
      placeholder: "Buat password baru",
    },
    {
      label: "Konfirmasi Password Baru",
      icon: FaShieldAlt,
      value: confirmPassword,
      setValue: setConfirmPassword,
      show: showConfirmPassword,
      setShow: setShowConfirmPassword,
      placeholder: "Ulangi password baru",
    },
  ];

  return (
    // HP: area popup berhenti di atas menu bawah (BottomNav tetap terlihat & bisa diklik)
    <div className="fixed inset-x-0 top-0 bottom-[72px] md:bottom-0 z-[60] flex items-center justify-center px-4">
      {isSubmitting && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
      {success && (
        <div className="toast toast-top toast-center z-[70]">
          <div className="alert alert-success text-sm">
            <span>{success}</span>
          </div>
        </div>
      )}
      <div onClick={onClose} className="absolute inset-0 bg-[#1a0507]/55 backdrop-blur-[3px]" />

      <div className="relative w-full max-w-[360px] sm:max-w-[400px] max-h-full overflow-y-auto bg-white rounded-3xl shadow-[0_30px_70px_-20px_rgba(30,0,0,0.6)] ring-1 ring-black/5">
        {/* ================= HEADER ================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#a5161d] via-[#6d0c11] to-[#2a0407] px-5 pt-4 pb-5">
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #F6D47A 0 1px, transparent 1px 14px)",
            }}
          />
          <div className="absolute -top-16 right-0 w-48 h-48 rounded-full bg-[#F6D47A]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E0A82E]/70 to-transparent" />

          <div className="relative flex items-center gap-3">
            <span className="w-11 h-11 shrink-0 rounded-2xl bg-white/10 ring-1 ring-[#F6D47A]/40 text-[#F6D47A] flex items-center justify-center">
              <FaLock />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F6D47A]">
                Keamanan Akun
              </p>
              <h3 className="text-base font-black text-white leading-tight">
                Ganti Password
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 border border-white/15 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#8f1117] transition"
              aria-label="Tutup"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5 flex flex-col gap-3.5">
          {kolom.map((k) => {
            const Icon = k.icon;
            const isKonfirmasi = k.label === "Konfirmasi Password Baru";
            return (
              <div key={k.label}>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {k.label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#B5791A] pointer-events-none z-10" />
                  <input
                    type={k.show ? "text" : "password"}
                    value={k.value}
                    onChange={(e) => k.setValue(e.target.value)}
                    placeholder={k.placeholder}
                    className={`input w-full h-11 rounded-xl bg-[#FBF8F4] pl-10 pr-11 text-[15px] text-[#1c0a0b] font-semibold placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:outline-none focus:bg-white focus:ring-2 ${
                      isKonfirmasi && tidakCocok
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : isKonfirmasi && cocok
                          ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
                          : "border-[#EADFD2] focus:border-[#D9A85C] focus:ring-[#D9A85C]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => k.setShow((sebelumnya) => !sebelumnya)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#8f1117] hover:bg-[#fdf3ee] z-10"
                    aria-label={k.show ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {k.show ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>

                {isKonfirmasi && (cocok || tidakCocok) && (
                  <p
                    className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold ${
                      cocok ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {cocok ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {cocok ? "Password cocok" : "Password belum sama"}
                  </p>
                )}
              </div>
            );
          })}

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 ring-1 ring-red-200 px-3.5 py-2.5 text-[13px] font-semibold text-red-600">
              <FaExclamationCircle className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-white border border-[#EADFD2] text-gray-700 text-sm font-bold hover:bg-[#FBF8F4] transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[1.6] h-11 rounded-xl bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white text-sm font-bold shadow-[0_10px_22px_-10px_rgba(143,17,23,0.7)] hover:from-[#8f1117] hover:to-[#4d0a0d] disabled:opacity-60 transition"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default GantiPasswordModal;
