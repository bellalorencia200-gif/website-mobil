import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import {
  FaTimes,
  FaUser,
  FaAt,
  FaEnvelope,
  FaPhoneAlt,
  FaUserShield,
  FaCheckCircle,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

// Tanggal bergabung dari ID (ULID) — hanya untuk tampilan
const HURUF_ULID = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const waktuDariId = (id) => {
  if (typeof id !== "string" || id.length !== 26) return null;
  let ms = 0;
  for (const huruf of id.slice(0, 10).toUpperCase()) {
    const nilai = HURUF_ULID.indexOf(huruf);
    if (nilai === -1) return null;
    ms = ms * 32 + nilai;
  }
  if (ms < Date.UTC(2020, 0, 1) || ms > Date.now() + 86400000) return null;
  return ms;
};

const ProfilModal = ({ onClose }) => {
  const [profil, setProfil] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfil(response.data.user);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data profil");
        setIsLoading(false);
      });
  }, []);

  // ==========================================
  // TAMPILAN SAJA
  // ==========================================
  const inisial = (nama) =>
    String(nama || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((k) => k[0])
      .join("")
      .toUpperCase();

  const bergabung = (() => {
    if (!profil) return "";
    const t = profil.createdAt ? new Date(profil.createdAt).getTime() : waktuDariId(profil.id);
    return t
      ? new Date(t).toLocaleDateString("id-ID", { month: "short", year: "numeric" })
      : "";
  })();

  const daftarInfo = profil
    ? [
        { icon: FaUser, label: "Nama Lengkap", nilai: profil.fullName, kapital: true },
        { icon: FaAt, label: "Username", nilai: profil.username },
        { icon: FaEnvelope, label: "Email", nilai: profil.email },
        { icon: FaPhoneAlt, label: "No HP", nilai: profil.noHp },
      ]
    : [];

  return (
    // HP: area popup berhenti di atas menu bawah (BottomNav tetap terlihat & bisa diklik)
    <div className="fixed inset-x-0 top-0 bottom-[72px] md:bottom-0 z-[60] flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-[#1a0507]/55 backdrop-blur-[3px]" />

      <div className="relative w-full max-w-[360px] sm:max-w-[400px] max-h-full overflow-y-auto bg-white rounded-3xl shadow-[0_30px_70px_-20px_rgba(30,0,0,0.6)] ring-1 ring-black/5">
        {/* ================= COVER ================= */}
        <div className="relative h-[72px] overflow-hidden bg-[#3a0609]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#a5161d] via-[#6d0c11] to-[#2a0407]" />
          {/* pola garis halus */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #F6D47A 0 1px, transparent 1px 14px)",
            }}
          />
          <div className="absolute -top-20 right-0 w-64 h-64 rounded-full bg-[#F6D47A]/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E0A82E]/70 to-transparent" />

          <div className="relative flex items-start justify-between px-5 pt-3.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F6D47A]">
              <FaShieldAlt className="text-[10px]" /> Akun Administrator
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 border border-white/15 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#8f1117] transition"
              aria-label="Tutup"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>

        {/* ================= IDENTITAS ================= */}
        <div className="px-5">
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0 -mt-7">
              <div className="w-16 h-16 rounded-2xl p-[3px] bg-gradient-to-br from-[#F6D47A] via-[#D9A85C] to-[#8a6326] shadow-[0_16px_30px_-12px_rgba(60,5,8,0.7)]">
                <div className="w-full h-full rounded-[13px] bg-gradient-to-br from-[#b3141c] to-[#4a080b] flex items-center justify-center text-xl font-black tracking-tight text-[#F6D47A] ring-[3px] ring-white">
                  {profil ? inisial(profil.fullName || profil.username) : <FaUser className="text-xl" />}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#22C55E] border-[3px] border-white" />
            </div>

            <div className="min-w-0 pt-2">
              {profil ? (
                <>
                  <p className="text-base font-black text-[#1c0a0b] capitalize leading-tight truncate">
                    {profil.fullName || profil.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">@{profil.username}</p>
                </>
              ) : (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 w-40 rounded bg-[#F1E8DE]" />
                  <div className="h-3 w-24 rounded bg-[#F1E8DE]" />
                </div>
              )}
            </div>
          </div>

          {/* Ringkasan singkat */}
          {profil && (
            <div className="mt-3.5 grid grid-cols-3 rounded-xl ring-1 ring-[#EFE6DC] bg-[#FCFAF7] divide-x divide-[#EFE6DC]">
              <div className="px-2 py-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Role</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-extrabold text-[#8f1117] capitalize">
                  <FaUserShield className="text-[11px]" /> {profil.role}
                </p>
              </div>
              <div className="px-2 py-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Status</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-extrabold text-[#047857]">
                  <FaCheckCircle className="text-[11px]" /> Aktif
                </p>
              </div>
              <div className="px-2 py-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Bergabung</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-extrabold text-[#1c0a0b] whitespace-nowrap">
                  <FaCalendarAlt className="text-[10px] text-[#B5791A]" />
                  {bergabung || "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= INFORMASI AKUN ================= */}
        <div className="px-5 pt-4 pb-5">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-6 h-[3px] rounded-full bg-[#8f1117]" />
            <span className="w-2.5 h-[3px] rounded-full bg-[#E0A82E]" />
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#1c0a0b]">
              Informasi Akun
            </p>
          </div>

          {isLoading && (
            <div className="rounded-2xl ring-1 ring-[#EFE6DC] divide-y divide-[#F3ECE3] animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F1E8DE]" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-16 rounded bg-[#F1E8DE]" />
                    <div className="h-3 w-40 rounded bg-[#F1E8DE]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 px-4 py-3 text-sm font-semibold text-red-600 text-center">
              {error}
            </div>
          )}

          {profil && (
            <div className="rounded-2xl ring-1 ring-[#EFE6DC] divide-y divide-[#F3ECE3] overflow-hidden">
              {daftarInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#FDFAF6] transition-colors"
                  >
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-[#8f1117]/[0.07] text-[#8f1117] flex items-center justify-center">
                      <Icon className="text-xs" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold text-gray-400 leading-tight">{item.label}</p>
                      <p
                        className={`text-[13px] font-bold truncate ${
                          item.nilai ? "text-[#1c0a0b]" : "text-gray-300 font-medium italic"
                        } ${item.kapital ? "capitalize" : ""}`}
                      >
                        {item.nilai || "Belum diisi"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white text-sm font-bold shadow-[0_10px_22px_-10px_rgba(143,17,23,0.7)] hover:from-[#8f1117] hover:to-[#4d0a0d] transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilModal;
