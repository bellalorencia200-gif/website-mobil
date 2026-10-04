import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import CropModal from "./CropModal.jsx";
import {
  FaCarSide,
  FaPlus,
  FaPen,
  FaTrashAlt,
  FaStar,
  FaArrowUp,
  FaCheckCircle,
  FaCoins,
  FaThLarge,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEllipsisV,
} from "react-icons/fa";

// ==========================================
// PENGATURAN TAMPILAN TABEL
// ==========================================
const PER_HALAMAN = 10;

// Warna label kategori (sama dengan grafik di Dashboard)
const WARNA_KATEGORI = [
  "#BE123C",
  "#C27C0E",
  "#6D28D9",
  "#0D9488",
  "#C026D3",
  "#65A30D",
  "#2563EB",
  "#EA580C",
];

// Waktu dibuat dari ID (ULID) — untuk "x baru bulan ini"
const HURUF_ULID = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const waktuDariId = (id) => {
  if (typeof id !== "string" || id.length !== 26) return null;
  let ms = 0;
  for (const huruf of id.slice(0, 10).toUpperCase()) {
    const nilai = HURUF_ULID.indexOf(huruf);
    if (nilai === -1) return null;
    ms = ms * 32 + nilai;
  }
  return ms;
};

// Tampilan harga dengan titik (250000000 -> 250.000.000).
// Yang disimpan & dikirim ke server tetap angka tanpa titik.
const angkaSaja = (nilai) =>
  typeof nilai === "number"
    ? String(Math.trunc(nilai))
    : String(nilai ?? "").replace(/\D/g, "");
const pakaiTitik = (nilai) => {
  const angka = angkaSaja(nilai);
  return angka ? Number(angka).toLocaleString("id-ID") : "";
};

const bacaSebagaiDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const KelolaMobil = () => {
  const [dataMobil, setDataMobil] = useState([]);
  const [dataKategori, setDataKategori] = useState([]);
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tahun, setTahun] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [imagesAsli, setImagesAsli] = useState([]);
  const [fotoLama, setFotoLama] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hapusLoading, setHapusLoading] = useState(false);
  const [bukaTambahLoading, setBukaTambahLoading] = useState(false);
  const [merek, setMerek] = useState("");
  const [kilometer, setKilometer] = useState("");
  const [transmisi, setTransmisi] = useState("");
  const [bahanBakar, setBahanBakar] = useState("");
  const [kapasitasMesin, setKapasitasMesin] = useState("");
  const [warna, setWarna] = useState("");
  const [isPromo, setIsPromo] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropIndex, setCropIndex] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  useEffect(() => {
    axios.get("/api/mobil").then((response) => {
      setDataMobil(response.data.mobil);
      setIsLoading(false);
    });

    axios.get("/api/categories").then((response) => {
      setDataKategori(response.data.categories);
    });
  }, []);

  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (images.length === 0) {
      setPreviewUrls([]);
      return;
    }
    let dibatalkan = false;
    Promise.all(images.map(bacaSebagaiDataUrl)).then((hasil) => {
      if (!dibatalkan) setPreviewUrls(hasil);
    });
    return () => {
      dibatalkan = true;
    };
  }, [images]);

  const token = localStorage.getItem("token");

  const handlePilihFoto = async (e) => {
    const filesTerpilih = Array.from(e.target.files);
    if (filesTerpilih.length > 4) {
      alert("Maksimal 4 foto per mobil");
      e.target.value = "";
      setImages([]);
      setImagesAsli([]);
      return;
    }
    setImages(filesTerpilih);
    setImagesAsli(filesTerpilih);
    if (filesTerpilih.length > 0) {
      setCropIndex(0);
      const dataUrl = await bacaSebagaiDataUrl(filesTerpilih[0]);
      setCropImageSrc(dataUrl);
      setCropModalOpen(true);
    }
  };

  const handleJadikanUtama = (index) => {
    const fotoUtama = images[index];
    const sisanya = images.filter((_, i) => i !== index);
    setImages([fotoUtama, ...sisanya]);

    const asliUtama = imagesAsli[index];
    const asliSisanya = imagesAsli.filter((_, i) => i !== index);
    setImagesAsli([asliUtama, ...asliSisanya]);

    setCropIndex(0);
    setCropImageSrc(previewUrls[index]);
    setCropModalOpen(true);
  };

  const bukaCropUtama = () => {
    if (!previewUrls[0]) return;
    setCropIndex(0);
    setCropImageSrc(previewUrls[0]);
    setCropModalOpen(true);
  };

  const handleSimpanCrop = (fileHasilCrop) => {
    setImages((prev) =>
      prev.map((file, i) => (i === cropIndex ? fileHasilCrop : file)),
    );
    setCropModalOpen(false);
    setCropIndex(null);
  };

  const handleTambahMobil = (e) => {
    e.preventDefault();
    console.log(editId);
    if (images.length === 0 && !editId) {
      alert("Foto mobil wajib di isi (minimal 1, maksimal 4)");
      return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    formData.append("tahun", tahun);
    formData.append("harga", harga);
    formData.append("stok", stok);
    formData.append("categoryId", categoryId);
    images.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("merek", merek);
    formData.append("kilometer", kilometer);
    formData.append("transmisi", transmisi);
    formData.append("bahanBakar", bahanBakar);
    formData.append("kapasitasMesin", kapasitasMesin);
    formData.append("warna", warna);
    formData.append("isPromo", isPromo);

    setIsSubmitting(true);

    if (!editId) {
      axios
        .post("/api/mobil", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          (document.getElementById("modal_tambah_mobil").close(),
            axios.get("/api/mobil").then((response) => {
              setDataMobil(response.data.mobil);
            }));
          setNama("");
          setDeskripsi("");
          setTahun("");
          setHarga("");
          setStok("");
          setCategoryId("");
          setMerek("");
          setKilometer("");
          setTransmisi("");
          setBahanBakar("");
          setKapasitasMesin("");
          setWarna("");
          setIsPromo(false);
          setImages([]);
          setEditId(null);
          setIsSubmitting(false);
        })

        .catch((error) => {
          alert(error.response.data.message);
          setIsSubmitting(false);
        });
    } else {
      axios
        .put(`/api/mobil/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          document.getElementById("modal_tambah_mobil").close();
          axios.get("/api/mobil").then((response) => {
            setDataMobil(response.data.mobil);
          });
          setNama("");
          setDeskripsi("");
          setTahun("");
          setHarga("");
          setStok("");
          setCategoryId("");
          setMerek("");
          setKilometer("");
          setTransmisi("");
          setBahanBakar("");
          setKapasitasMesin("");
          setWarna("");
          setIsPromo(false);
          setImages([]);
          setEditId(null);
          setIsSubmitting(false);
        })
        .catch((error) => {
          alert(error.response.data.message);
          setIsSubmitting(false);
        });
    }
  };
  const handleHapusMobil = (id) => {
    if (window.confirm("Yakin mau hapus mobil ini?")) {
      setHapusLoading(true);
      axios
        .delete(`/api/mobil/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        .then((response) => {
          alert(response.data.message);
          axios.get("/api/mobil").then((response) => {
            setDataMobil(response.data.mobil);
            setHapusLoading(false);
          });
        })
        .catch((error) => {
          alert(error.response.data.message);
          setHapusLoading(false);
        });
    }
  };

  const handleEditClick = (mobil) => {
    setNama(mobil.nama);
    setDeskripsi(mobil.deskripsi);
    setTahun(mobil.tahun);
    setHarga(mobil.harga);
    setStok(mobil.stok);
    setCategoryId(mobil.categoryId);
    setMerek(mobil.merek);
    setKilometer(mobil.kilometer ?? "");
    setTransmisi(mobil.transmisi ?? "");
    setBahanBakar(mobil.bahanBakar ?? "");
    setKapasitasMesin(mobil.kapasitasMesin ?? "");
    setWarna(mobil.warna ?? "");
    setIsPromo(mobil.isPromo ?? false);
    setEditId(mobil.id);
    setImages([]);
    setImagesAsli([]);
    setFotoLama(mobil.images || []);
    document.getElementById("modal_tambah_mobil").showModal();
  };

  // ==========================================
  // TAMPILAN TABEL (cari, filter, urut, halaman)
  // Hanya mengatur tampilan, tidak mengubah data di server
  // ==========================================
  const [cari, setCari] = useState("");
  const [filterMerek, setFilterMerek] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [tab, setTab] = useState("semua");
  const [urut, setUrut] = useState({ kolom: null, arah: "asc" });
  const [halaman, setHalaman] = useState(1);
  const [menuTerbuka, setMenuTerbuka] = useState(null);

  useEffect(() => {
    setHalaman(1);
  }, [cari, filterMerek, filterKategori, tab]);

  const namaKategori = (id) =>
    dataKategori.find((k) => String(k.id) === String(id))?.name || "";

  const warnaKategori = (id) => {
    const i = dataKategori.findIndex((k) => String(k.id) === String(id));
    return WARNA_KATEGORI[(i < 0 ? 0 : i) % WARNA_KATEGORI.length];
  };

  const totalStok = dataMobil.reduce((acc, m) => acc + (Number(m.stok) || 0), 0);
  const mobilTersedia = dataMobil.filter((m) => Number(m.stok) > 0).length;
  const nilaiAset = dataMobil.reduce(
    (acc, m) => acc + (Number(m.harga) || 0) * (Number(m.stok) || 0),
    0,
  );
  const baruBulanIni = dataMobil.filter((m) => {
    const t = waktuDariId(m.id);
    return t && Date.now() - t < 30 * 24 * 3600 * 1000;
  }).length;

  const daftarMerek = [...new Set(dataMobil.map((m) => m.merek).filter(Boolean))].sort();

  const kataCari = cari.trim().toLowerCase();
  const mobilTersaring = dataMobil
    .filter((m) => {
      if (tab === "tersedia" && !(Number(m.stok) > 0)) return false;
      if (tab === "promo" && !m.isPromo) return false;
      if (filterMerek && m.merek !== filterMerek) return false;
      if (filterKategori && String(m.categoryId) !== String(filterKategori)) return false;
      if (!kataCari) return true;
      return [m.nama, m.merek, namaKategori(m.categoryId)]
        .filter(Boolean)
        .some((teks) => String(teks).toLowerCase().includes(kataCari));
    })
    .sort((a, b) => {
      if (!urut.kolom) return 0;
      const nilai = (m) =>
        urut.kolom === "kategori"
          ? namaKategori(m.categoryId).toLowerCase()
          : Number(m[urut.kolom]) || 0;
      const x = nilai(a);
      const y = nilai(b);
      const hasil = x < y ? -1 : x > y ? 1 : 0;
      return urut.arah === "asc" ? hasil : -hasil;
    });

  const jumlahHalaman = Math.max(1, Math.ceil(mobilTersaring.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, jumlahHalaman);
  const awal = (halamanAktif - 1) * PER_HALAMAN;
  const mobilTampil = mobilTersaring.slice(awal, awal + PER_HALAMAN);

  const gantiUrut = (kolom) =>
    setUrut((u) =>
      u.kolom === kolom
        ? { kolom, arah: u.arah === "asc" ? "desc" : "asc" }
        : { kolom, arah: "asc" },
    );

  const IkonUrut = ({ kolom }) =>
    urut.kolom !== kolom ? (
      <FaSort className="text-[9px] opacity-40" />
    ) : urut.arah === "asc" ? (
      <FaSortUp className="text-[9px] text-[#8f1117]" />
    ) : (
      <FaSortDown className="text-[9px] text-[#8f1117]" />
    );

  const formatRupiah = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  // Ringkas: Rp 5,98 Miliar / Rp 850 Juta (agar tidak terpotong di kartu)
  const rupiahRingkas = (n) => {
    const angka = Number(n) || 0;
    const ringkas = (nilai, satuan, singkat) => (
      <>
        Rp {nilai.toLocaleString("id-ID", { maximumFractionDigits: 2 })}{" "}
        <span className="md:hidden">{singkat}</span>
        <span className="hidden md:inline">{satuan}</span>
      </>
    );
    if (angka >= 1e12) return ringkas(angka / 1e12, "Triliun", "T");
    if (angka >= 1e9) return ringkas(angka / 1e9, "Miliar", "M");
    if (angka >= 1e6) return ringkas(angka / 1e6, "Juta", "Jt");
    return formatRupiah(angka);
  };

  const StatusStok = ({ stok }) =>
    Number(stok) > 0 ? (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#047857] bg-[#10B981]/10 ring-1 ring-[#10B981]/25 px-2.5 py-1 rounded-full whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
        Tersedia
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#BE123C] bg-[#BE123C]/10 ring-1 ring-[#BE123C]/25 px-2.5 py-1 rounded-full whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-[#BE123C]" />
        Habis
      </span>
    );

  const LabelKategori = ({ id }) => {
    const nama = namaKategori(id);
    if (!nama) return <span className="text-xs text-gray-400">—</span>;
    const w = warnaKategori(id);
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
        style={{ color: w, backgroundColor: `${w}14`, boxShadow: `inset 0 0 0 1px ${w}30` }}
      >
        <FaCarSide className="text-[11px]" />
        {nama}
      </span>
    );
  };

  const Halaman = () => (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={halamanAktif === 1}
        onClick={() => setHalaman(halamanAktif - 1)}
        className="w-8 h-8 rounded-lg border border-[#EADFD2] flex items-center justify-center text-gray-600 hover:bg-[#fdf3ee] disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="Sebelumnya"
      >
        <FaChevronLeft className="text-[10px]" />
      </button>
      {Array.from({ length: jumlahHalaman }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setHalaman(n)}
          className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
            n === halamanAktif
              ? "bg-gradient-to-br from-[#a5161d] to-[#5f0a0d] text-white shadow-[0_6px_14px_-6px_rgba(143,17,23,0.8)]"
              : "border border-[#EADFD2] text-gray-600 hover:bg-[#fdf3ee]"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={halamanAktif === jumlahHalaman}
        onClick={() => setHalaman(halamanAktif + 1)}
        className="w-8 h-8 rounded-lg border border-[#EADFD2] flex items-center justify-center text-gray-600 hover:bg-[#fdf3ee] disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="Berikutnya"
      >
        <FaChevronRight className="text-[10px]" />
      </button>
    </div>
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
              Manajemen Mobil
            </h1>
            <p className="text-xs md:text-[13px] text-gray-500 mt-1">
              Kelola seluruh unit kendaraan, harga, stok, dan informasi galeri.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Dekorasi garis miring */}
          <div className="hidden lg:flex items-center gap-1.5 -skew-x-[35deg] mr-2" aria-hidden="true">
            <span className="block w-4 h-12 bg-gradient-to-b from-[#F6D47A] to-[#C9973F] rounded-sm" />
            <span className="block w-3 h-12 bg-gradient-to-b from-[#a5161d] to-[#5f0a0d] rounded-sm" />
          </div>

          <button
            onClick={() => {
              setBukaTambahLoading(true);
              setTimeout(() => {
                setNama("");
                setDeskripsi("");
                setTahun("");
                setHarga("");
                setStok("");
                setCategoryId("");
                setMerek("");
                setKilometer("");
                setTransmisi("");
                setBahanBakar("");
                setKapasitasMesin("");
                setWarna("");
                setIsPromo(false);
                setImages([]);
                setImagesAsli([]);
                setFotoLama([]);
                setEditId(null);
                document.getElementById("modal_tambah_mobil").showModal();
                setBukaTambahLoading(false);
              }, 400);
            }}
            className="btn bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d] w-full md:w-auto rounded-xl px-5 shadow-[0_10px_22px_-10px_rgba(143,17,23,0.7)]"
            id="btn-tambah-mobil"
          >
            <FaPlus className="text-xs text-[#F6D47A]" /> Tambah Mobil Baru
          </button>
        </div>
      </div>

      {/* ==================================================
          KARTU RINGKASAN
      ================================================== */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-5">
        {[
          {
            label: "Total Mobil",
            nilai: dataMobil.length,
            satuan: "",
            ket:
              baruBulanIni > 0 ? (
                <span className="inline-flex items-center gap-1 text-[#047857] font-semibold">
                  <FaArrowUp className="text-[9px]" /> {baruBulanIni} baru<span className="hidden sm:inline"> · 30 hari terakhir</span>
                </span>
              ) : (
                "Unit terdaftar"
              ),
            icon: FaCarSide,
            dari: "#b3141c",
            ke: "#4a080b",
          },
          {
            label: "Stok Tersedia",
            nilai: totalStok,
            satuan: "Unit",
            ket: `${mobilTersedia} mobil siap dijual`,
            icon: FaCheckCircle,
            dari: "#22A06B",
            ke: "#0F6B4A",
          },
          {
            label: "Nilai Aset",
            nilai: rupiahRingkas(nilaiAset),
            satuan: "",
            ket: formatRupiah(nilaiAset),
            icon: FaCoins,
            dari: "#E0A82E",
            ke: "#A86B12",
          },
          {
            label: "Kategori",
            nilai: dataKategori.length,
            satuan: "",
            ket: "Jenis kendaraan",
            icon: FaThLarge,
            dari: "#7C3AED",
            ke: "#4C1D95",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_14px_35px_-24px_rgba(80,30,20,0.4)] p-3 md:p-5 flex items-center gap-2.5 md:gap-4"
            >
              <span
                className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl text-white flex items-center justify-center shadow-[0_10px_20px_-8px_rgba(0,0,0,0.35)]"
                style={{ background: `linear-gradient(135deg, ${s.dari}, ${s.ke})` }}
              >
                <Icon className="text-lg md:text-2xl" />
              </span>
              <div className="min-w-0 relative z-10">
                <p className="text-[11px] md:text-xs font-bold text-gray-700">{s.label}</p>
                <p className="text-base md:text-2xl font-black text-[#1c0a0b] leading-tight mt-0.5 truncate">
                  {isLoading ? "–" : s.nilai}
                  {s.satuan && (
                    <span className="ml-1.5 text-sm md:text-base font-bold">{s.satuan}</span>
                  )}
                </p>
                <p className="text-[10px] md:text-[11px] text-gray-500 mt-0.5 truncate">{s.ket}</p>
              </div>
              <Icon
                className="hidden md:block absolute -right-3 -bottom-3 text-[86px] pointer-events-none"
                style={{ color: `${s.dari}12` }}
              />
            </div>
          );
        })}
      </div>

      {/* ==================================================
          PENCARIAN & FILTER
      ================================================== */}
      <div className="rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_14px_35px_-26px_rgba(80,30,20,0.4)] p-3 md:p-4 mb-5 flex flex-col lg:flex-row lg:items-center gap-3">
        <label className="w-full lg:flex-1 flex items-center gap-2.5 h-11 shrink-0 px-4 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] focus-within:ring-[#D9A85C] transition">
          <FaSearch className="text-sm text-gray-400" />
          <input
            type="text"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama mobil, merek, atau kategori..."
            className="flex-1 bg-transparent outline-none text-sm text-[#1c0a0b] placeholder:text-gray-400"
          />
          {cari && (
            <button type="button" onClick={() => setCari("")} className="text-gray-400 hover:text-[#8f1117]" aria-label="Hapus pencarian">
              <FaTimes className="text-xs" />
            </button>
          )}
        </label>

        <div className="grid grid-cols-2 gap-3 lg:flex">
          <div className="relative lg:w-44">
            <span className="absolute left-3.5 top-1.5 text-[9px] font-bold text-gray-400 pointer-events-none">Merek</span>
            <select
              value={filterMerek}
              onChange={(e) => setFilterMerek(e.target.value)}
              className="w-full h-11 pt-3.5 pl-3 pr-8 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] text-xs font-semibold text-[#1c0a0b] outline-none appearance-none cursor-pointer focus:ring-[#D9A85C]"
            >
              <option value="">Semua Merek</option>
              {daftarMerek.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none" />
          </div>

          <div className="relative lg:w-44">
            <span className="absolute left-3.5 top-1.5 text-[9px] font-bold text-gray-400 pointer-events-none">Kategori</span>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full h-11 pt-3.5 pl-3 pr-8 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] text-xs font-semibold text-[#1c0a0b] outline-none appearance-none cursor-pointer focus:ring-[#D9A85C]"
            >
              <option value="">Semua Kategori</option>
              {dataKategori.map((k) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] lg:ml-2">
          {[
            { id: "semua", label: "Semua" },
            { id: "tersedia", label: "Tersedia" },
            { id: "promo", label: "Promo" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 lg:flex-none px-4 h-9 rounded-lg text-xs font-bold transition ${
                tab === t.id
                  ? "bg-gradient-to-r from-[#8f1117] to-[#4a080b] text-white shadow-[0_8px_16px_-8px_rgba(143,17,23,0.8)]"
                  : "text-gray-600 hover:text-[#8f1117]"
              }`}
            >
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
          {/* Penutup menu titik tiga saat klik di luar */}
          {menuTerbuka !== null && (
            <div className="fixed inset-0 z-20" onClick={() => setMenuTerbuka(null)} />
          )}

          {/* ==================================================
              TABEL (DESKTOP)
          ================================================== */}
          <div className="hidden md:block rounded-2xl bg-white ring-1 ring-[#EADFD2] shadow-[0_18px_45px_-28px_rgba(80,30,20,0.4)]">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-600 bg-[#FBF7F2]">
                  <th className="py-3.5 pl-5 pr-3 rounded-tl-2xl">Foto &amp; Mobil</th>
                  {[
                    { kolom: "kategori", label: "Kategori" },
                    { kolom: "tahun", label: "Tahun" },
                    { kolom: "harga", label: "Harga" },
                    { kolom: "stok", label: "Stok" },
                  ].map((c) => (
                    <th key={c.kolom} className="p-3">
                      <button
                        type="button"
                        onClick={() => gantiUrut(c.kolom)}
                        className="inline-flex items-center gap-1.5 hover:text-[#8f1117] transition"
                      >
                        {c.label} <IkonUrut kolom={c.kolom} />
                      </button>
                    </th>
                  ))}
                  <th className="p-3">Status</th>
                  <th className="py-3.5 pl-3 pr-5 rounded-tr-2xl">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mobilTampil.map((mobil, index) => (
                  <tr
                    key={mobil.id ?? index}
                    className="border-t border-[#F3ECE3] transition-colors hover:bg-[#FDFAF6]"
                  >
                    <td className="py-3 pl-5 pr-3">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-[88px] h-[58px] shrink-0 rounded-lg overflow-hidden ring-1 ring-[#EADFD2] bg-[#F7F3ED]">
                          <img
                            src={mobil.images?.[0]}
                            alt={mobil.nama}
                            className="w-full h-full object-cover"
                          />
                          {mobil.images && mobil.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              +{mobil.images.length - 1}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-[#1c0a0b] text-sm truncate">
                              {mobil.nama}
                            </p>
                            {mobil.isPromo && (
                              <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wide text-[#4a080b] bg-gradient-to-r from-[#FCD34D] to-[#E0A82E] px-1.5 py-0.5 rounded-full">
                                <FaStar className="text-[7px]" /> Promo
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                            {[
                              mobil.merek,
                              mobil.kapasitasMesin ? `${mobil.kapasitasMesin} cc` : "",
                            ]
                              .filter(Boolean)
                              .join(" • ") || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <LabelKategori id={mobil.categoryId} />
                    </td>
                    <td className="p-3 text-[13px] text-gray-600">{mobil.tahun}</td>
                    <td className="p-3 text-[13px] font-bold text-[#1c0a0b] whitespace-nowrap">
                      {formatRupiah(mobil.harga)}
                    </td>
                    <td className="p-3 text-[13px] text-gray-600">{mobil.stok}</td>
                    <td className="p-3">
                      <StatusStok stok={mobil.stok} />
                    </td>
                    <td className="py-3 pl-3 pr-5">
                      <div className="relative flex items-center gap-2">
                        <button
                          className="btn btn-sm h-9 bg-white text-[#1c0a0b] border border-[#EADFD2] hover:bg-[#fdf3ee] hover:border-[#8f1117]/40 rounded-xl gap-1.5 px-3.5 font-bold"
                          onClick={() => handleEditClick(mobil)}
                        >
                          <FaPen className="text-[10px] text-[#8f1117]" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setMenuTerbuka(menuTerbuka === mobil.id ? null : mobil.id)
                          }
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                            menuTerbuka === mobil.id
                              ? "border-[#8f1117]/40 bg-[#fdf3ee] text-[#8f1117]"
                              : "border-[#EADFD2] text-gray-600 hover:bg-[#fdf3ee]"
                          }`}
                          aria-label="Menu lainnya"
                        >
                          <FaEllipsisV className="text-xs" />
                        </button>

                        {menuTerbuka === mobil.id && (
                          <div
                            className={`absolute right-0 z-30 w-44 rounded-xl bg-white ring-1 ring-[#EADFD2] shadow-[0_18px_40px_-12px_rgba(60,20,15,0.35)] p-1.5 ${
                              index >= mobilTampil.length - 2 && mobilTampil.length > 3
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setMenuTerbuka(null);
                                handleEditClick(mobil);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-[#FBF8F4]"
                            >
                              <FaPen className="text-[10px] text-gray-500" /> Edit data
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMenuTerbuka(null);
                                handleHapusMobil(mobil.id);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#BE123C] hover:bg-[#BE123C]/5"
                            >
                              <FaTrashAlt className="text-[10px]" /> Hapus mobil
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {mobilTampil.length === 0 && (
              <div className="py-14 text-center border-t border-[#F3ECE3]">
                <FaSearch className="mx-auto text-2xl text-[#C27C0E] mb-3" />
                <p className="text-sm font-semibold text-gray-500">
                  {dataMobil.length === 0 ? "Belum ada mobil" : "Mobil tidak ditemukan"}
                </p>
              </div>
            )}

            {/* FOOTER + HALAMAN */}
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-[#F3ECE3]">
              <p className="text-[11px] font-semibold text-gray-500">
                {mobilTersaring.length === 0
                  ? "Tidak ada data"
                  : `Menampilkan ${awal + 1}–${awal + mobilTampil.length} dari ${mobilTersaring.length} data`}
              </p>
              <Halaman />
            </div>
          </div>

          {/* ==================================================
              KARTU (HP)
          ================================================== */}
          <div className="flex flex-col gap-3 md:hidden">
            {mobilTampil.map((mobil, index) => (
              <div
                key={mobil.id ?? index}
                className="bg-white rounded-2xl ring-1 ring-[#EADFD2] shadow-[0_10px_25px_-18px_rgba(80,30,20,0.4)] p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-16 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-[#EADFD2]">
                    <img
                      src={mobil.images?.[0]}
                      alt={mobil.nama}
                      className="w-20 h-16 object-cover"
                    />
                    {mobil.images && mobil.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        +{mobil.images.length - 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold text-[#1c0a0b] text-sm truncate">
                        {mobil.nama}
                      </p>
                      {mobil.isPromo && (
                        <FaStar className="text-[10px] text-[#E0A82E] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {[mobil.merek, mobil.tahun].filter(Boolean).join(" • ")}
                    </p>
                    <p className="text-[15px] font-black text-[#8f1117] mt-1">
                      {formatRupiah(mobil.harga)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#F3ECE3]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <LabelKategori id={mobil.categoryId} />
                    <StatusStok stok={mobil.stok} />
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      className="btn btn-sm bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d] rounded-lg gap-1"
                      onClick={() => handleEditClick(mobil)}
                    >
                      <FaPen className="text-[9px]" /> Edit
                    </button>
                    <button
                      className="btn btn-sm bg-white text-[#8f1117] border border-[#8f1117] hover:bg-[#fdf3ee] rounded-lg"
                      onClick={() => handleHapusMobil(mobil.id)}
                      aria-label="Hapus"
                    >
                      <FaTrashAlt className="text-[10px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {mobilTampil.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-gray-500">
                  {dataMobil.length === 0 ? "Belum ada mobil" : "Mobil tidak ditemukan"}
                </p>
              </div>
            )}

            {jumlahHalaman > 1 && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <p className="text-[11px] font-semibold text-gray-500">
                  {awal + 1}–{awal + mobilTampil.length} dari {mobilTersaring.length}
                </p>
                <Halaman />
              </div>
            )}
          </div>
        </>
      )}

      <dialog id="modal_tambah_mobil" className="modal modal-bottom sm:modal-middle max-md:h-[calc(100dvh-58px-env(safe-area-inset-bottom,0px))] max-md:bg-black/40 backdrop:bg-transparent">
        <div className="modal-box w-full max-w-full max-h-[82%] rounded-t-3xl rounded-b-none p-0 flex flex-col overflow-hidden shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] sm:w-11/12 sm:max-w-3xl sm:max-h-[90vh] sm:rounded-3xl">
          <div className="relative flex items-center justify-between px-4 md:px-6 pt-4 pb-3 md:py-4 border-b border-gray-200 flex-shrink-0">
            <span className="md:hidden absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300" />
            <h3 className="font-bold text-base md:text-lg text-[#8f1117]">
              {editId ? "Edit Mobil" : "Tambah Mobil Baru"}
            </h3>
            <button
              type="button"
              onClick={() =>
                document.getElementById("modal_tambah_mobil").close()
              }
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-lg hover:bg-gray-200"
              aria-label="Tutup"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={handleTambahMobil}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-6 py-3 md:py-4 grid grid-cols-2 md:grid-cols-6 gap-x-3 md:gap-x-4 gap-y-2.5 md:gap-y-3 content-start grid-flow-row-dense md:grid-flow-row">
              <div className="col-span-2 md:col-span-6">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">Nama Mobil</label>
                <input
                  type="text"
                  placeholder="Nama Mobil"
                  className="input input-bordered w-full h-10 md:h-12 mt-1 md:mt-2 text-sm md:text-base text-[#1c0a0b] font-medium placeholder:text-gray-400 placeholder:font-normal"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div className="col-span-2 md:col-span-6">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">Deskripsi</label>
                <input
                  type="text"
                  placeholder="Deskripsi"
                  className="input input-bordered w-full h-10 md:h-12 mt-1 md:mt-2 text-sm md:text-base text-[#1c0a0b] font-medium placeholder:text-gray-400 placeholder:font-normal"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">Tahun</label>
                <input
                  type="number"
                  placeholder="Tahun"
                  className="input input-bordered w-full h-10 md:h-12 mt-1 md:mt-2 text-sm md:text-base text-[#1c0a0b] font-medium placeholder:text-gray-400 placeholder:font-normal"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                />
              </div>

              <div className="col-span-2 md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">Harga</label>
                <div className="relative mt-1 md:mt-2">
                  <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-sm md:text-base font-bold text-[#8f1117] pointer-events-none z-10">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Contoh: 250.000.000"
                    className="input input-bordered w-full h-10 md:h-12 pl-10 md:pl-12 text-sm md:text-base text-[#1c0a0b] font-semibold placeholder:text-gray-400 placeholder:font-normal"
                    value={pakaiTitik(harga)}
                    onChange={(e) => setHarga(angkaSaja(e.target.value))}
                  />
                </div>
                {angkaSaja(harga) && Number(angkaSaja(harga)) >= 1e6 && (
                  <p className="mt-1 text-[11px] text-gray-500">
                    ≈ <span className="font-semibold text-[#8f1117]">{rupiahRingkas(angkaSaja(harga))}</span>
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">Stok</label>
                <input
                  type="number"
                  placeholder="Stok"
                  className="input input-bordered w-full h-10 md:h-12 mt-1 md:mt-2 text-sm md:text-base text-[#1c0a0b] font-medium placeholder:text-gray-400 placeholder:font-normal"
                  value={stok}
                  onChange={(e) => setStok(e.target.value)}
                />
              </div>

              <div className="col-span-2 md:col-span-6 flex items-center justify-between py-2.5 md:py-3 px-3 md:px-3.5 rounded-xl border border-gray-200 bg-gray-50">
                <div className="pr-3">
                  <p className="text-[13px] md:text-sm font-bold text-gray-800">
                    Tandai sebagai Promo Eksklusif
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Mobil ini akan muncul di tab "Promo Eksklusif" pada
                    halaman Katalog
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPromo(!isPromo)}
                  className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-colors duration-200 ${
                    isPromo
                      ? "bg-gradient-to-b from-[#9d151b] to-[#70090F]"
                      : "bg-gray-300"
                  }`}
                  aria-pressed={isPromo}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                      isPromo ? "right-0.5" : "left-0.5"
                    }`}
                  ></span>
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">Kilometer</label>
                <input
                  type="number"
                  placeholder="Contoh: 35000"
                  className="input input-bordered w-full h-10 md:h-12 mt-1 md:mt-2 text-sm md:text-base text-[#1c0a0b] font-medium placeholder:text-gray-400 placeholder:font-normal"
                  value={kilometer}
                  onChange={(e) => setKilometer(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">Kapasitas Mesin (cc)</label>
                <input
                  type="number"
                  placeholder="Contoh: 1500"
                  className="input input-bordered w-full h-10 md:h-12 mt-1 md:mt-2 text-sm md:text-base text-[#1c0a0b] font-medium placeholder:text-gray-400 placeholder:font-normal"
                  value={kapasitasMesin}
                  onChange={(e) => setKapasitasMesin(e.target.value)}
                />
              </div>

              <div className="col-span-2 md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700">Warna</label>
                <input
                  type="text"
                  placeholder="Contoh: Putih"
                  className="input input-bordered w-full h-10 md:h-12 mt-1 md:mt-2 text-sm md:text-base text-[#1c0a0b] font-medium placeholder:text-gray-400 placeholder:font-normal"
                  value={warna}
                  onChange={(e) => setWarna(e.target.value)}
                />
              </div>

              <select
                className="select select-bordered w-full h-10 min-h-10 md:h-12 md:min-h-12 text-[13px] md:text-base pl-3 pr-7 md:pl-4 md:pr-10 md:col-span-3"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Pilih Kategori</option>
                {dataKategori.map((kategori, index) => (
                  <option key={index} value={kategori.id}>
                    {kategori.name}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered w-full h-10 min-h-10 md:h-12 md:min-h-12 text-[13px] md:text-base pl-3 pr-7 md:pl-4 md:pr-10 md:col-span-3"
                value={merek}
                onChange={(e) => setMerek(e.target.value)}
              >
                <option value="">Pilih Merek</option>
                <option value="Byd">Byd</option>
                <option value="Honda">Honda</option>
                <option value="Mercedes Benz">Mercedes Benz</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Toyota">Toyota</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Nissan">Nissan</option>
                <option value="Isuzu">Isuzu</option>
                <option value="Mazda">Mazda</option>
                <option value="Dfsk">Dfsk</option>
                <option value="Ford">Ford</option>
                <option value="MG">MG</option>
                <option value="Jeep">Jeep</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Bmw">Bmw</option>
                <option value="Mini">Mini</option>
                <option value="Kia">Kia</option>
                <option value="Lexus">Lexus</option>
                <option value="Wuling">Wuling</option>
                <option value="Cherry">Cherry</option>
                <option value="Gwm">Gwm</option>
                <option value="Baic">Baic</option>
              </select>

              <select
                className="select select-bordered w-full h-10 min-h-10 md:h-12 md:min-h-12 text-[13px] md:text-base pl-3 pr-7 md:pl-4 md:pr-10 md:col-span-3"
                value={transmisi}
                onChange={(e) => setTransmisi(e.target.value)}
              >
                <option value="">Pilih Transmisi</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>

              <select
                className="select select-bordered w-full h-10 min-h-10 md:h-12 md:min-h-12 text-[13px] md:text-base pl-3 pr-7 md:pl-4 md:pr-10 md:col-span-3"
                value={bahanBakar}
                onChange={(e) => setBahanBakar(e.target.value)}
              >
                <option value="">Pilih Bahan Bakar</option>
                <option value="Bensin">Bensin</option>
                <option value="Solar">Solar</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Listrik">Listrik</option>
              </select>

              <input
                type="file"
                multiple
                accept="image/*"
                className="file-input file-input-bordered file-input-sm md:file-input-md h-10 md:h-12 w-full col-span-2 md:col-span-6"
                onChange={handlePilihFoto}
              />

              {editId && fotoLama.length > 0 && images.length === 0 && (
                <div className="col-span-2 md:col-span-6">
                  <p className="text-xs text-gray-500 mb-1">
                    Foto saat ini (akan tetap dipakai jika tidak pilih foto
                    baru):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {fotoLama.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`foto-lama-${index}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="col-span-2 md:col-span-6 flex flex-wrap gap-3">
                  {images.map((file, index) => (
                    <div key={index} className="w-20">
                      <div className="relative">
                        <img
                          src={previewUrls[index]}
                          alt={`preview-${index}`}
                          className={`w-20 h-20 object-cover rounded border ${
                            index === 0 ? "ring-2 ring-[#8f1117]" : ""
                          }`}
                        />
                        {index === 0 && (
                          <span className="absolute -top-1 -left-1 bg-[#8f1117] text-white text-[9px] font-bold px-1.5 rounded">
                            Utama
                          </span>
                        )}
                      </div>

                      {index === 0 ? (
                        <button
                          type="button"
                          onClick={bukaCropUtama}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            bukaCropUtama();
                          }}
                          className="mt-1 w-full bg-white border border-gray-300 text-[10px] font-bold py-1.5 rounded text-center"
                        >
                          Atur Frame
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJadikanUtama(index)}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            handleJadikanUtama(index);
                          }}
                          className="mt-1 w-full bg-white border border-gray-300 text-[10px] font-bold py-1.5 rounded text-center"
                        >
                          Jadikan Utama
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-4 md:px-6 py-2.5 md:py-3.5 border-t border-gray-200 bg-[#FDFBF8] flex-shrink-0">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("modal_tambah_mobil").close()
                }
                className="btn h-10 min-h-10 md:h-12 md:min-h-12 flex-1 sm:flex-none sm:px-6"
              >
                Tutup
              </button>
              <button className="btn h-10 min-h-10 md:h-12 md:min-h-12 flex-[1.5] sm:flex-none sm:px-8 bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d]">
                Submit
              </button>
            </div>
          </form>
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>
        )}

        {cropModalOpen && (
          <CropModal
            imageSrc={cropImageSrc}
            fileName={imagesAsli[cropIndex]?.name || "foto-utama.jpg"}
            onClose={() => setCropModalOpen(false)}
            onSimpan={handleSimpanCrop}
          />
        )}
      </dialog>
    </div>
  );
};

export default KelolaMobil;
