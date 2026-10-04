import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import {
  FaEye,
  FaEyeSlash,
  FaUsers,
  FaUser,
  FaUserShield,
  FaUserPlus,
  FaSearch,
  FaTimes,
  FaEnvelope,
  FaPen,
  FaTrashAlt,
  FaAt,
  FaLock,
} from "react-icons/fa";

// Waktu dibuat dari ID (ULID) — untuk "Bergabung" & "Baru 30 hari"
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

const KelolaUser = () => {
  const [dataUser, setDataUser] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hapusLoading, setHapusLoading] = useState(false);
  const [bukaTambahLoading, setBukaTambahLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDataUser(response.data.users);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const handleTambahUser = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!editId) {
      axios
        .post("/api/auth/register", {
          username,
          password,
          email,
          fullName,
        })
        .then((response) => {
          alert(response.data.message);
          document.getElementById("modal_tambah_user").close();

          axios
            .get("/api/users", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setDataUser(response.data.users);
            });

          setUsername("");
          setPassword("");
          setEmail("");
          setFullName("");
          setRole("");
          setEditId(null);
          setIsSubmitting(false);
        })
        .catch((error) => {
          alert(error.response.data.message);
          setPassword("");
          setIsSubmitting(false);
          setUsername("");
          setEmail("");
          setFullName("");
          setRole("");
          setPassword("");
          setIsSubmitting(false);
        });
    } else {
      axios
        .put(
          `/api/users/${editId}`,
          { username, email, fullName, role },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          alert(response.data.message);
          document.getElementById("modal_tambah_user").close();

          // langsung update baris user ini di tabel, tanpa perlu fetch ulang
          setDataUser((prevDataUser) =>
            prevDataUser.map((user) =>
              user.id === editId
                ? { ...user, username, email, fullName, role }
                : user,
            ),
          );

          setUsername("");
          setEmail("");
          setFullName("");
          setRole("");
          setEditId(null);
          setIsSubmitting(false);
        })
        .catch((error) => {
          alert(error.response.data.message);
          setIsSubmitting(false);
        });
    }
  };

  const handleHapusUser = (id) => {
    if (window.confirm("yakin mau menghapus user id ini")) {
      setHapusLoading(true);
      axios
        .delete(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          axios
            .get("/api/users", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setDataUser(response.data.users);
              setHapusLoading(false);
            });
        })

        .catch((error) => {
          alert(error.response.data.message);
          setHapusLoading(false);
        });
    }
  };
  const handleEditClick = (user) => {
    setUsername(user.username);
    setEmail(user.email);
    setFullName(user.fullName);
    setRole(user.role);
    setEditId(user.id);
    document.getElementById("modal_tambah_user").showModal();
  };

  // ==========================================
  // TAMPILAN SAJA (cari, filter role, ringkasan)
  // ==========================================
  const [cari, setCari] = useState("");
  const [tabRole, setTabRole] = useState("semua");

  const jumlahAdmin = dataUser.filter((u) => u.role === "admin").length;
  const jumlahPelanggan = dataUser.filter((u) => u.role !== "admin").length;
  const baru30Hari = dataUser.filter((u) => {
    const t = waktuDariId(u.id);
    return t && Date.now() - t < 30 * 24 * 3600 * 1000;
  }).length;

  const kataCari = cari.trim().toLowerCase();
  const userTampil = dataUser.filter((u) => {
    if (tabRole === "admin" && u.role !== "admin") return false;
    if (tabRole === "user" && u.role === "admin") return false;
    if (!kataCari) return true;
    return [u.username, u.email, u.fullName]
      .filter(Boolean)
      .some((t) => String(t).toLowerCase().includes(kataCari));
  });

  const inisial = (user) =>
    String(user.fullName || user.username || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((k) => k[0])
      .join("")
      .toUpperCase();

  const tanggalBergabung = (user) => {
    const t = user.createdAt ? new Date(user.createdAt).getTime() : waktuDariId(user.id);
    return t
      ? new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
      : "—";
  };

  const LabelRole = ({ role }) =>
    role === "admin" ? (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8f1117] bg-[#8f1117]/10 ring-1 ring-[#8f1117]/20 px-2.5 py-1 rounded-full">
        <FaUserShield className="text-[10px]" /> Admin
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8a6326] bg-[#D9A85C]/15 ring-1 ring-[#D9A85C]/40 px-2.5 py-1 rounded-full">
        <FaUser className="text-[9px]" /> Pelanggan
      </span>
    );

  return (
    <div className="w-full">
      {hapusLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
      {bukaTambahLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
      {/* ==================================================
          HEADER HALAMAN
      ================================================== */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="flex items-stretch gap-3">
          <span className="w-1.5 rounded-full bg-gradient-to-b from-[#E0A82E] to-[#B5791A]" />
          <div>
            <h1 className="text-2xl md:text-[28px] font-black text-[#1c0a0b] tracking-tight leading-tight">
              Manajemen Pengguna
            </h1>
            <p className="text-xs md:text-[13px] text-gray-500 mt-1">
              Kelola akun admin dan pelanggan beserta hak aksesnya.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden lg:flex items-center gap-1.5 -skew-x-[35deg] mr-2" aria-hidden="true">
            <span className="block w-4 h-12 bg-gradient-to-b from-[#F6D47A] to-[#C9973F] rounded-sm" />
            <span className="block w-3 h-12 bg-gradient-to-b from-[#a5161d] to-[#5f0a0d] rounded-sm" />
          </div>

          <button
            onClick={() => {
              setBukaTambahLoading(true);
              setTimeout(() => {
                setUsername("");
                setEmail("");
                setFullName("");
                setRole("");
                setPassword("");
                setEditId(null);
                document.getElementById("modal_tambah_user").showModal();
                setBukaTambahLoading(false);
              }, 400);
            }}
            className="btn bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d] w-full md:w-auto rounded-xl px-5 shadow-[0_10px_22px_-10px_rgba(143,17,23,0.7)]"
            id="btn-tambah-user"
          >
            <FaUserPlus className="text-sm text-[#F6D47A]" /> Tambah Pengguna
          </button>
        </div>
      </div>

      {/* ==================================================
          KARTU RINGKASAN
      ================================================== */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-5">
        {[
          { label: "Total Pengguna", nilai: dataUser.length, ket: "akun terdaftar", icon: FaUsers, dari: "#b3141c", ke: "#4a080b" },
          { label: "Admin", nilai: jumlahAdmin, ket: "akses penuh panel", icon: FaUserShield, dari: "#7C3AED", ke: "#4C1D95" },
          { label: "Pelanggan", nilai: jumlahPelanggan, ket: "akun pembeli", icon: FaUser, dari: "#E0A82E", ke: "#A86B12" },
          { label: "Baru", nilai: baru30Hari, ket: "30 hari terakhir", icon: FaUserPlus, dari: "#22A06B", ke: "#0F6B4A" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_14px_35px_-24px_rgba(80,30,20,0.4)] p-3 md:p-5 flex items-center gap-2.5 md:gap-4">
              <span className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl text-white flex items-center justify-center shadow-[0_10px_20px_-8px_rgba(0,0,0,0.35)]" style={{ background: `linear-gradient(135deg, ${s.dari}, ${s.ke})` }}>
                <Icon className="text-lg md:text-2xl" />
              </span>
              <div className="min-w-0 relative z-10">
                <p className="text-[11px] md:text-xs font-bold text-gray-700">{s.label}</p>
                <p className="text-base md:text-2xl font-black text-[#1c0a0b] leading-tight mt-0.5">{isLoading ? "–" : s.nilai}</p>
                <p className="text-[10px] md:text-[11px] text-gray-500 mt-0.5 truncate">{s.ket}</p>
              </div>
              <Icon className="hidden md:block absolute -right-3 -bottom-3 text-[86px] pointer-events-none" style={{ color: `${s.dari}12` }} />
            </div>
          );
        })}
      </div>

      {/* ==================================================
          PENCARIAN & FILTER ROLE
      ================================================== */}
      <div className="rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_14px_35px_-26px_rgba(80,30,20,0.4)] p-3 md:p-4 mb-5 flex flex-col lg:flex-row lg:items-center gap-3">
        <label className="w-full lg:flex-1 flex items-center gap-2.5 h-11 px-4 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] focus-within:ring-[#D9A85C] transition shrink-0">
          <FaSearch className="text-sm text-gray-400" />
          <input type="text" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama, username, atau email..." className="flex-1 bg-transparent outline-none text-sm text-[#1c0a0b] placeholder:text-gray-400" />
          {cari && (
            <button type="button" onClick={() => setCari("")} className="text-gray-400 hover:text-[#8f1117]" aria-label="Hapus pencarian">
              <FaTimes className="text-xs" />
            </button>
          )}
        </label>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC]">
          {[
            { id: "semua", label: `Semua (${dataUser.length})` },
            { id: "admin", label: `Admin (${jumlahAdmin})` },
            { id: "user", label: `Pelanggan (${jumlahPelanggan})` },
          ].map((t) => (
            <button key={t.id} type="button" onClick={() => setTabRole(t.id)} className={`flex-1 lg:flex-none px-4 h-9 rounded-lg text-xs font-bold whitespace-nowrap transition ${tabRole === t.id ? "bg-gradient-to-r from-[#8f1117] to-[#4a080b] text-white shadow-[0_8px_16px_-8px_rgba(143,17,23,0.8)]" : "text-gray-600 hover:text-[#8f1117]"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg text-[#8f1117]"></span>
        </div>
      ) : (
        <>
          {/* ==================================================
              TABEL (DESKTOP)
          ================================================== */}
          <div className="hidden md:block rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_18px_45px_-28px_rgba(80,30,20,0.4)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-600 bg-[#FBF7F2]">
                  <th className="py-3.5 pl-5 pr-3">Pengguna</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Bergabung</th>
                  <th className="py-3.5 pl-3 pr-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {userTampil.map((user, index) => (
                  <tr key={user.id ?? index} className="border-t border-[#F3ECE3] transition-colors hover:bg-[#FDFAF6]">
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-sm font-black ring-2 ring-white shadow-[0_6px_14px_-8px_rgba(0,0,0,0.5)] ${user.role === "admin" ? "bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-[#F6D47A]" : "bg-gradient-to-br from-[#F6D47A] to-[#C9973F] text-[#4a080b]"}`}>
                          {inisial(user)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-extrabold text-[#1c0a0b] text-sm truncate capitalize">{user.fullName || "—"}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-2 text-[13px] text-gray-600">
                        <FaEnvelope className="text-[11px] text-gray-400" />
                        {user.email}
                      </span>
                    </td>
                    <td className="p-3"><LabelRole role={user.role} /></td>
                    <td className="p-3 text-[13px] text-gray-600 whitespace-nowrap">{tanggalBergabung(user)}</td>
                    <td className="py-3 pl-3 pr-5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(user)} className="btn btn-sm h-9 bg-white text-[#1c0a0b] border border-[#EADFD2] hover:bg-[#fdf3ee] hover:border-[#8f1117]/40 rounded-xl gap-1.5 px-3.5 font-bold">
                          <FaPen className="text-[10px] text-[#8f1117]" /> Edit
                        </button>
                        <button onClick={() => handleHapusUser(user.id)} className="btn btn-sm h-9 w-9 p-0 bg-white text-[#BE123C] border border-[#EADFD2] hover:bg-[#BE123C] hover:text-white hover:border-[#BE123C] rounded-xl" aria-label={`Hapus ${user.username}`} title="Hapus pengguna">
                          <FaTrashAlt className="text-[11px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {userTampil.length === 0 && (
              <div className="py-14 text-center border-t border-[#F3ECE3]">
                <FaUsers className="mx-auto text-2xl text-[#C27C0E] mb-3" />
                <p className="text-sm font-semibold text-gray-500">
                  {dataUser.length === 0 ? "Belum ada pengguna" : "Pengguna tidak ditemukan"}
                </p>
              </div>
            )}

            <div className="px-5 py-3.5 border-t border-[#F3ECE3] text-[11px] font-semibold text-gray-500">
              Menampilkan {userTampil.length} dari {dataUser.length} pengguna
            </div>
          </div>

          {/* ==================================================
              KARTU (HP)
          ================================================== */}
          <div className="flex flex-col gap-3 md:hidden">
            {userTampil.map((user, index) => (
              <div key={user.id ?? index} className="bg-white rounded-2xl ring-1 ring-[#EADFD2] shadow-[0_10px_25px_-18px_rgba(80,30,20,0.4)] p-3.5">
                <div className="flex items-center gap-3">
                  <span className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-sm font-black ${user.role === "admin" ? "bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-[#F6D47A]" : "bg-gradient-to-br from-[#F6D47A] to-[#C9973F] text-[#4a080b]"}`}>
                    {inisial(user)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-[#1c0a0b] text-[15px] truncate capitalize">{user.fullName || "—"}</p>
                    <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                  </div>
                  <LabelRole role={user.role} />
                </div>
                <p className="flex items-center gap-2 text-xs text-gray-500 mt-3 truncate">
                  <FaEnvelope className="text-[10px] text-gray-400 shrink-0" /> {user.email}
                </p>
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#F3ECE3]">
                  <span className="text-[11px] text-gray-400">Bergabung {tanggalBergabung(user)}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleEditClick(user)} className="btn btn-sm bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d] rounded-lg gap-1">
                      <FaPen className="text-[9px]" /> Edit
                    </button>
                    <button onClick={() => handleHapusUser(user.id)} className="btn btn-sm bg-white text-[#8f1117] border border-[#8f1117] hover:bg-[#fdf3ee] rounded-lg" aria-label="Hapus">
                      <FaTrashAlt className="text-[10px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {userTampil.length === 0 && (
              <p className="py-10 text-center text-sm font-semibold text-gray-500">Pengguna tidak ditemukan</p>
            )}
          </div>
        </>
      )}

      <dialog id="modal_tambah_user" className="modal modal-bottom sm:modal-middle max-md:h-[calc(100dvh-58px-env(safe-area-inset-bottom,0px))] max-md:bg-black/40 backdrop:bg-transparent">
        <div className="modal-box w-full max-w-full max-h-[85%] rounded-t-3xl shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] rounded-b-none p-0 flex flex-col overflow-hidden sm:w-11/12 sm:max-w-2xl sm:max-h-[90vh] sm:rounded-3xl">
          {/* Header */}
          <div className="relative flex items-center gap-3 px-4 md:px-6 pt-4 pb-3 md:pt-5 md:pb-4 border-b border-[#F3ECE3] flex-shrink-0">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8f1117] via-[#E0A82E] to-[#5f0a0d]" />
            <span className="w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-[#F6D47A] text-sm md:text-base flex items-center justify-center shadow-[0_10px_20px_-8px_rgba(143,17,23,0.6)]">
              {editId ? <FaPen /> : <FaUserPlus />}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-base md:text-lg text-[#1c0a0b] leading-tight">
                {editId ? "Edit User" : "Tambah User"}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                {editId ? "Perbarui data dan hak akses pengguna" : "Buat akun baru untuk admin atau pelanggan"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => document.getElementById("modal_tambah_user").close()}
              className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E1D9] text-gray-500 flex items-center justify-center hover:bg-[#8f1117] hover:text-white hover:border-[#8f1117] transition"
              aria-label="Tutup"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          <form onSubmit={handleTambahUser} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-6 py-3.5 md:py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 md:gap-y-4 content-start">
              {/* Username */}
              <div>
                <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1 md:mb-1.5">Username</label>
                <div className="relative">
                  <FaAt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#B5791A] pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="contoh: budisantoso"
                    className="input w-full h-10 min-h-10 md:h-11 md:min-h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] pl-10 text-sm md:text-[15px] text-[#1c0a0b] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:bg-white focus:border-[#D9A85C] focus:ring-2 focus:ring-[#D9A85C]/20"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1 md:mb-1.5">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#B5791A] pointer-events-none z-10" />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="input w-full h-10 min-h-10 md:h-11 md:min-h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] pl-10 text-sm md:text-[15px] text-[#1c0a0b] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:bg-white focus:border-[#D9A85C] focus:ring-2 focus:ring-[#D9A85C]/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Nama Lengkap */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1 md:mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#B5791A] pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="contoh: Budi Santoso"
                    className="input w-full h-10 min-h-10 md:h-11 md:min-h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] pl-10 text-sm md:text-[15px] text-[#1c0a0b] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:bg-white focus:border-[#D9A85C] focus:ring-2 focus:ring-[#D9A85C]/20"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* Role */}
              <div className={editId ? "sm:col-span-2" : ""}>
                <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1 md:mb-1.5">Role</label>
                <div className="relative">
                  <FaUserShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#B5791A] pointer-events-none z-10" />
                  <select
                    className="select w-full h-10 min-h-10 md:h-11 md:min-h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] pl-10 text-sm md:text-[15px] text-[#1c0a0b] font-semibold focus:outline-none focus:bg-white focus:border-[#D9A85C] focus:ring-2 focus:ring-[#D9A85C]/20"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Pilih Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              {!editId && (
                <div>
                  <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1 md:mb-1.5">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#B5791A] pointer-events-none z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="input w-full h-10 min-h-10 md:h-11 md:min-h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] pl-10 text-sm md:text-[15px] text-[#1c0a0b] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:bg-white focus:border-[#D9A85C] focus:ring-2 focus:ring-[#D9A85C]/20 pr-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#8f1117] hover:bg-[#fdf3ee] z-10"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-4 md:px-6 py-2.5 md:py-3.5 border-t border-[#F3ECE3] bg-[#FDFBF8] flex-shrink-0">
              <button
                type="button"
                onClick={() => document.getElementById("modal_tambah_user").close()}
                className="btn h-10 min-h-10 md:h-12 md:min-h-12 flex-1 sm:flex-none sm:px-6 rounded-xl bg-white border-[#EADFD2] text-gray-700 hover:bg-[#FBF8F4]"
              >
                Tutup
              </button>
              <button className="btn h-10 min-h-10 md:h-12 md:min-h-12 flex-[1.5] sm:flex-none sm:px-8 rounded-xl bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d] shadow-[0_10px_22px_-10px_rgba(143,17,23,0.7)]">
                {editId ? "Simpan Perubahan" : "Simpan User"}
              </button>
            </div>
          </form>
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>
        )}
      </dialog>
    </div>
  );
};
export default KelolaUser;
