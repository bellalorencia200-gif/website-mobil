import { useEffect, useMemo, useRef, useState } from "react";
import axios from "../api/axiosInstance";

import {
  FaPlus,
  FaPen,
  FaTrashAlt,
  FaCar,
  FaCloudUploadAlt,
  FaTimes,
  FaTag,
  FaChevronRight,
  FaThLarge,
  FaEye,
} from "react-icons/fa";

/* =========================================================
   WARNA AKSEN KATEGORI
========================================================= */

const WARNA_KATEGORI = [
  "#A5161D",
  "#B7791F",
  "#6D28D9",
  "#0F766E",
  "#BE185D",
  "#4D7C0F",
  "#1D4ED8",
  "#C2410C",
];

/* =========================================================
   DESKRIPSI DEFAULT KATEGORI
========================================================= */

const DESKRIPSI_KATEGORI = {
  suv: "Kendaraan tangguh dengan kenyamanan untuk berbagai perjalanan.",
  sedan: "Desain elegan dengan kenyamanan berkendara yang maksimal.",
  mpv: "Pilihan keluarga dengan kabin luas dan nyaman.",
  coupe: "Desain sporty dengan performa tinggi dan tampilan elegan.",
  wagon: "Mobil keluarga dengan ruang luas dan nyaman untuk perjalanan jauh.",
  van: "Kapasitas besar untuk perjalanan bersama keluarga atau rombongan.",
  truck: "Tangguh dan kuat untuk berbagai kebutuhan bisnis.",
  hatchback: "Praktis, lincah, dan nyaman untuk kebutuhan perkotaan.",
  pickup: "Kendaraan serbaguna untuk kebutuhan usaha dan aktivitas harian.",
  minibus: "Kabin luas dengan kapasitas penumpang yang nyaman.",
  crossover: "Perpaduan kenyamanan mobil keluarga dan ketangguhan SUV.",
};

/* =========================================================
   KOMPONEN
========================================================= */

const KelolaKategori = () => {
  /* =======================================================
     STATE KATEGORI
  ======================================================= */

  const [dataKategori, setDataKategori] = useState([]);

  const [nama, setNama] = useState("");
  const [icon, setIcon] = useState(null);
  const [editId, setEditId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hapusLoading, setHapusLoading] = useState(false);
  const [bukaTambahLoading, setBukaTambahLoading] = useState(false);

  /* =======================================================
     STATE MOBIL
  ======================================================= */

  const [dataMobil, setDataMobil] = useState([]);

  /* =======================================================
     PREVIEW ICON
  ======================================================= */

  const [pratinjauIcon, setPratinjauIcon] = useState("");

  /* =======================================================
     POPUP DAFTAR MOBIL PER KATEGORI (BARU)
  ======================================================= */

  const [kategoriDipilih, setKategoriDipilih] = useState(null);

  /* =======================================================
     REF MODAL
  ======================================================= */

  const modalRef = useRef(null);

  /* =======================================================
     TOKEN
  ======================================================= */

  const token = localStorage.getItem("token");

  /* =======================================================
     URL GAMBAR
  ======================================================= */

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    const baseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:3000";

    return `${baseUrl}${image}`;
  };

  /* =======================================================
     DESKRIPSI KATEGORI
  ======================================================= */

  const getDeskripsiKategori = (name) => {
    if (!name) {
      return "Kategori kendaraan yang tersedia di MobilKu.";
    }

    const key = name.trim().toLowerCase();

    return (
      DESKRIPSI_KATEGORI[key] ||
      "Pilihan kendaraan berkualitas yang tersedia di MobilKu."
    );
  };

  /* =======================================================
     FETCH KATEGORI
  ======================================================= */

  const fetchKategori = async () => {
    try {
      const response = await axios.get("/api/categories");

      setDataKategori(response.data.categories || []);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
      setDataKategori([]);
    }
  };

  /* =======================================================
     FETCH MOBIL
  ======================================================= */

  const fetchMobil = async () => {
    try {
      const response = await axios.get("/api/mobil");

      setDataMobil(response.data.mobil || []);
    } catch (error) {
      console.error("Gagal mengambil data mobil:", error);
      setDataMobil([]);
    }
  };

  /* =======================================================
     LOAD DATA AWAL
  ======================================================= */

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      await Promise.all([
        fetchKategori(),
        fetchMobil(),
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  /* =======================================================
     TUTUP POPUP DENGAN TOMBOL ESC (BARU)
  ======================================================= */

  useEffect(() => {
    if (!kategoriDipilih) return;

    const tekanTombol = (e) => {
      if (e.key === "Escape") setKategoriDipilih(null);
    };

    window.addEventListener("keydown", tekanTombol);

    return () => {
      window.removeEventListener("keydown", tekanTombol);
    };
  }, [kategoriDipilih]);

  /* =======================================================
     JUMLAH MOBIL PER KATEGORI
  ======================================================= */

  const jumlahMobil = (id) => {
    return dataMobil.filter(
      (mobil) =>
        String(mobil.categoryId) === String(id)
    ).length;
  };

  /* =======================================================
     DAFTAR MOBIL UNTUK POPUP (BARU)
  ======================================================= */

  const mobilKategoriDipilih = kategoriDipilih
    ? dataMobil.filter(
        (mobil) =>
          String(mobil.categoryId) === String(kategoriDipilih.id)
      )
    : [];

  /* =======================================================
     TOTAL MOBIL
  ======================================================= */

  const totalMobil = dataMobil.length;

  /* =======================================================
     KATEGORI TERBANYAK
  ======================================================= */

  const kategoriTerbanyak = useMemo(() => {
    if (!dataKategori.length) return null;

    return dataKategori.reduce((terbaik, kategori) => {
      if (!terbaik) return kategori;

      return jumlahMobil(kategori.id) >
        jumlahMobil(terbaik.id)
        ? kategori
        : terbaik;
    }, null);
  }, [dataKategori, dataMobil]);

  /* =======================================================
     PREVIEW FILE
  ======================================================= */

  useEffect(() => {
    if (!icon) {
      setPratinjauIcon("");
      return;
    }

    const url = URL.createObjectURL(icon);

    setPratinjauIcon(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [icon]);

  /* =======================================================
     KATEGORI YANG SEDANG DIEDIT
  ======================================================= */

  const kategoriDiedit = dataKategori.find(
    (kategori) =>
      String(kategori.id) === String(editId)
  );

  /* =======================================================
     GAMBAR FORM
  ======================================================= */

  const gambarForm =
    pratinjauIcon ||
    (editId
      ? getImageUrl(kategoriDiedit?.icon)
      : "");

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setNama("");
    setIcon(null);
    setEditId(null);
    setPratinjauIcon("");
  };

  /* =======================================================
     BUKA MODAL TAMBAH
  ======================================================= */

  const bukaTambah = () => {
    setBukaTambahLoading(true);

    setTimeout(() => {
      resetForm();

      if (modalRef.current) {
        modalRef.current.showModal();
      }

      setBukaTambahLoading(false);
    }, 200);
  };

  /* =======================================================
     TUTUP MODAL
  ======================================================= */

  const tutupModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }

    resetForm();
  };

  /* =======================================================
     EDIT KATEGORI
  ======================================================= */

  const handleEditClick = (kategori) => {
    setNama(kategori.name || "");
    setIcon(null);
    setEditId(kategori.id);
    setPratinjauIcon("");

    setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.showModal();
      }
    }, 50);
  };

  /* =======================================================
     TAMBAH / EDIT KATEGORI
  ======================================================= */

  const handleTambahKategori = async (e) => {
    e.preventDefault();

    const namaBersih = nama.trim();

    if (!namaBersih) {
      alert("Nama kategori wajib diisi.");
      return;
    }

    if (!editId && !icon) {
      alert("Silakan unggah gambar kategori terlebih dahulu.");
      return;
    }

    const formData = new FormData();

    formData.append("name", namaBersih);

    if (icon) {
      formData.append("icon", icon);
    }

    setIsSubmitting(true);

    try {
      let response;

      if (!editId) {
        response = await axios.post(
          "/api/categories",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.put(
          `/api/categories/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert(
        response.data.message ||
          "Kategori berhasil disimpan."
      );

      await fetchKategori();

      tutupModal();
    } catch (error) {
      console.error(
        "Gagal menyimpan kategori:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan kategori."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     HAPUS KATEGORI
  ======================================================= */

  const handleHapusKategori = async (id) => {
    const kategori = dataKategori.find(
      (item) =>
        String(item.id) === String(id)
    );

    const jumlah = jumlahMobil(id);

    let pesan = `Apakah Anda yakin ingin menghapus kategori "${kategori?.name || "ini"}"?`;

    if (jumlah > 0) {
      pesan += `\n\nKategori ini masih memiliki ${jumlah} mobil.`;
    }

    if (!window.confirm(pesan)) {
      return;
    }

    setHapusLoading(true);

    try {
      const response = await axios.delete(
        `/api/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Kategori berhasil dihapus."
      );

      await Promise.all([
        fetchKategori(),
        fetchMobil(),
      ]);
    } catch (error) {
      console.error(
        "Gagal menghapus kategori:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus kategori."
      );
    } finally {
      setHapusLoading(false);
    }
  };

  /* =======================================================
     STATISTIK
     Tetap dipertahankan agar fungsi/data lama tidak hilang.
  ======================================================= */

  const statistik = [
    {
      label: "Total Kategori",
      nilai: dataKategori.length,
      ket: "jenis kendaraan",
      icon: FaThLarge,
    },
    {
      label: "Total Mobil",
      nilai: totalMobil,
      ket: "unit terdaftar",
      icon: FaCar,
    },
    {
      label: "Terbanyak",
      nilai: kategoriTerbanyak?.name || "–",
      ket: kategoriTerbanyak
        ? `${jumlahMobil(kategoriTerbanyak.id)} mobil`
        : "belum ada data",
      icon: FaTag,
    },
  ];

  return (
    <div className="relative w-full min-h-full overflow-hidden text-[#241316] bg-[#FCFAF7]">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute top-0 right-0 w-[420px] h-[220px] opacity-60 overflow-hidden">
        <div
          className="
            absolute
            -top-24
            right-[-80px]
            w-[430px]
            h-[180px]
            rotate-[-27deg]
            bg-gradient-to-r
            from-transparent
            via-[#8F1117]/[0.08]
            to-[#C9A227]/[0.13]
          "
        />

        <div
          className="
            absolute
            -top-20
            right-[-120px]
            w-[430px]
            h-[145px]
            rotate-[-27deg]
            bg-gradient-to-r
            from-transparent
            via-[#C9A227]/[0.10]
            to-[#8F1117]/[0.06]
          "
        />

        <div
          className="
            absolute
            top-0
            right-[-100px]
            w-[330px]
            h-[3px]
            rotate-[-27deg]
            bg-gradient-to-r
            from-transparent
            via-[#C9A227]/40
            to-[#8F1117]/50
          "
        />
      </div>

      {/* =====================================================
          LOADING HAPUS
      ===================================================== */}

      {hapusLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#241316]/35 backdrop-blur-[4px]">
          <div className="w-[180px] rounded-2xl bg-white px-5 py-5 shadow-2xl flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-md text-[#8F1117]" />

            <p className="text-xs font-extrabold text-[#241316]">
              Menghapus kategori...
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          LOADING BUKA TAMBAH
      ===================================================== */}

      {bukaTambahLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#241316]/25 backdrop-blur-[2px]">
          <span className="loading loading-spinner loading-md text-white" />
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative z-10 px-1 pt-1 mb-7">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

          {/* LEFT HEADER */}

          <div className="flex items-start gap-4">

            {/* Decorative Line */}

            <div className="pt-4 shrink-0">
              <div className="flex items-center gap-1">
                <span className="block w-12 h-[4px] rounded-full bg-[#8F1117]" />

                <span className="block w-5 h-[4px] rounded-full bg-[#C9A227]" />
              </div>
            </div>

            <div>

              <h1
                className="
                  font-serif
                  text-[32px]
                  md:text-[38px]
                  lg:text-[42px]
                  font-black
                  leading-[1]
                  tracking-[-0.025em]
                  text-[#5F0A0D]
                "
              >
                Daftar Kategori
              </h1>

              <p className="mt-3 max-w-[700px] text-[13px] md:text-[14px] leading-[1.65] text-[#6B6870] font-medium">
                Kelola kategori mobil yang tersedia di sistem.
                Anda dapat menambah, mengedit, atau menghapus
                kategori sesuai kebutuhan.
              </p>

            </div>

          </div>

          {/* RIGHT HEADER */}

          <div className="flex items-center gap-3 md:pt-3">

            {/* Total kategori */}

            <div
              className="
                inline-flex
                items-center
                gap-2.5
                h-12
                px-5
                rounded-full
                bg-gradient-to-r
                from-[#8F1117]
                to-[#5F0A0D]
                border
                border-[#C9A227]
                text-white
                shadow-[0_12px_25px_-12px_rgba(95,10,13,0.75)]
              "
            >

              <FaThLarge className="text-[#F6D47A] text-sm" />

              <span className="text-[14px] font-black whitespace-nowrap">
                {dataKategori.length} Kategori
              </span>

            </div>

            {/* Tambah */}

            <button
              type="button"
              onClick={bukaTambah}
              className="
                group
                hidden
                lg:flex
                items-center
                justify-center
                gap-2
                h-12
                px-5
                rounded-full
                bg-white
                border
                border-[#DCC8AF]
                text-[#8F1117]
                text-sm
                font-extrabold
                shadow-[0_8px_22px_-16px_rgba(60,20,20,0.4)]
                transition-all
                duration-200
                hover:bg-[#8F1117]
                hover:text-white
                hover:border-[#8F1117]
              "
            >
              <span
                className="
                  w-6
                  h-6
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-[#F8E9E9]
                  text-[#8F1117]
                  group-hover:bg-white/10
                  group-hover:text-[#F6D47A]
                "
              >
                <FaPlus className="text-[9px]" />
              </span>

              Tambah
            </button>

          </div>

        </div>

        {/* MOBILE ADD BUTTON */}

        <button
          type="button"
          onClick={bukaTambah}
          className="
            lg:hidden
            mt-4
            w-full
            h-11
            rounded-xl
            bg-gradient-to-r
            from-[#A5161D]
            to-[#650B0F]
            text-white
            text-sm
            font-extrabold
            flex
            items-center
            justify-center
            gap-2
            shadow-[0_12px_25px_-13px_rgba(143,17,23,0.7)]
          "
        >
          <FaPlus className="text-[#F6D47A]" />
          Tambah Kategori
        </button>

      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {isLoading ? (

        <div className="min-h-[350px] flex items-center justify-center">

          <div className="flex flex-col items-center gap-3">

            <span className="loading loading-spinner loading-md text-[#8F1117]" />

            <p className="text-xs font-semibold text-gray-400">
              Memuat kategori...
            </p>

          </div>

        </div>

      ) : (

        <section className="relative z-10">

          {/* =================================================
              HEADER LIST
          ================================================= */}

          <div className="flex items-end justify-between gap-3 mb-4 px-1">

            <div>

              <div className="flex items-center gap-2">

                <span className="w-7 h-[3px] rounded-full bg-[#8F1117]" />

                <span className="w-3 h-[3px] rounded-full bg-[#C9A227]" />

              </div>

              <h2 className="mt-2 text-[17px] md:text-[19px] font-black text-[#241316]">
                Kategori Kendaraan
              </h2>

            </div>

            <span className="text-[10px] md:text-[11px] font-bold text-[#8F1117]">
              {dataKategori.length} kategori tersedia
            </span>

          </div>

          {/* =================================================
              GRID CARD
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {dataKategori.map((kategori, index) => {

              const warna =
                WARNA_KATEGORI[
                  index % WARNA_KATEGORI.length
                ];

              const jumlah = jumlahMobil(kategori.id);

              return (

                <article
                  key={kategori.id}
                  className="
                    group
                    relative
                    flex
                    flex-col
                    overflow-hidden
                    rounded-[22px]
                    bg-white
                    border-[1.5px]
                    border-[#CDB28E]
                    shadow-[0_12px_30px_-18px_rgba(65,30,20,0.35)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#A77B3E]
                    hover:shadow-[0_22px_42px_-20px_rgba(95,10,13,0.35)]
                  "
                >

                  {/* =================================================
                      GOLD TOP LINE
                  ================================================= */}

                  <div
                    className="
                      absolute
                      top-0
                      left-0
                      right-0
                      h-[3px]
                      z-30
                      bg-gradient-to-r
                      from-[#8F1117]
                      via-[#C9A227]
                      to-[#8F1117]
                    "
                  />

                  {/* =================================================
                      IMAGE AREA
                  ================================================= */}

                  <div
                    className="
                      relative
                      h-[175px]
                      overflow-hidden
                      rounded-t-[21px]
                      bg-[#FBF9F6]
                    "
                  >

                    {/* Background */}

                    <div
                      className="absolute inset-0"
                      style={{
                        background: `
                          radial-gradient(
                            circle at 45% 55%,
                            ${warna}12,
                            transparent 62%
                          ),
                          linear-gradient(
                            180deg,
                            #FFFFFF 0%,
                            #F7F2ED 100%
                          )
                        `,
                      }}
                    />

{/* =================================================
    NOMOR KATEGORI - CLEAN
================================================= */}

<div
  className="
    absolute
    top-3
    left-4
    z-20
  "
>
  <span
    className="
      text-[15px]
      font-black
      tracking-wide
      text-[#8F1117]
      drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]
    "
  >
    #{String(index + 1).padStart(2, "0")}
  </span>
</div>


                    {/* =================================================
                        JUMLAH MOBIL
                    ================================================= */}

                    <div className="absolute top-3.5 right-3.5 z-20">

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          min-h-[34px]
                          px-3.5
                          rounded-full
                          bg-white/95
                          backdrop-blur-md
                          border
                          border-[#EEE3D7]
                          shadow-[0_7px_16px_-10px_rgba(0,0,0,0.35)]
                          text-[11px]
                          font-black
                        "
                        style={{
                          color:
                            jumlah > 0
                              ? "#8F1117"
                              : "#9B9694",
                        }}
                      >

                        <FaCar className="text-[10px]" />

                        <span>
                          {jumlah} mobil
                        </span>

                      </span>

                    </div>

                    {/* =================================================
                        CAR SHADOW
                    ================================================= */}

                    <div
                      className="
                        absolute
                        bottom-4
                        left-1/2
                        -translate-x-1/2
                        w-[68%]
                        h-3
                        rounded-[50%]
                        bg-[#241316]/10
                        blur-md
                        z-[1]
                        transition-all
                        duration-500
                        group-hover:w-[74%]
                      "
                    />

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    {kategori.icon ? (

                      <img
                        src={getImageUrl(kategori.icon)}
                        alt={kategori.name}
                        className="
                          absolute
                          inset-0
                          z-[3]
                          w-full
                          h-full
                          object-contain
                          px-7
                          py-7
                          transition-transform
                          duration-500
                          ease-out
                          group-hover:scale-[1.06]
                          group-hover:-translate-y-1
                        "
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="absolute inset-0 flex items-center justify-center z-[3]">

                        <div
                          className="
                            w-20
                            h-20
                            rounded-[22px]
                            flex
                            items-center
                            justify-center
                            border
                          "
                          style={{
                            background: `${warna}12`,
                            borderColor: `${warna}25`,
                            color: warna,
                          }}
                        >

                          <FaCar className="text-4xl" />

                        </div>

                      </div>

                    )}

                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="relative flex-1 p-4 md:p-5 bg-white">

                    {/* =================================================
                        CATEGORY TITLE ROW
                    ================================================= */}

                    <div className="flex items-start gap-3">

                      {/* ICON */}

                      <div
                        className="
                          relative
                          shrink-0
                          w-[58px]
                          h-[58px]
                          rounded-[16px]
                          flex
                          items-center
                          justify-center
                          text-white
                          shadow-[0_9px_18px_-10px_rgba(95,10,13,0.6)]
                          overflow-hidden
                        "
                        style={{
                          background:
                            "linear-gradient(145deg, #A5161D, #5F0A0D)",
                        }}
                      >

                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

                        <FaCar className="relative z-10 text-[25px]" />

                      </div>

                      {/* TITLE */}

                      <div className="min-w-0 flex-1 pt-0.5">

                        <div className="flex items-center justify-between gap-2">

                          <h3
                            className="
                              font-serif
                              text-[21px]
                              md:text-[22px]
                              font-black
                              text-[#5F0A0D]
                              leading-tight
                              truncate
                            "
                          >
                            {kategori.name}
                          </h3>

                          <FaChevronRight
                            className="
                              shrink-0
                              text-[12px]
                              text-[#8F1117]
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                            "
                          />

                        </div>

                        <span className="block mt-1 text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#A47B3B]">
                          Kategori kendaraan
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p
                      className="
                        text-[11px]
                        md:text-[12px]
                        leading-[1.55]
                        text-[#777174]
                        mt-3
                        min-h-[38px]
                        line-clamp-2
                        font-medium
                      "
                    >
                      {getDeskripsiKategori(
                        kategori.name
                      )}
                    </p>

                    {/* =================================================
                        GOLD DETAIL LINE
                    ================================================= */}

                    <div className="flex items-center gap-2 mt-3 mb-3">

                      <span className="w-8 h-[2px] rounded-full bg-[#C9A227]" />

                      <span className="w-2 h-[2px] rounded-full bg-[#D8C19C]" />

                      <span className="flex-1 h-px bg-gradient-to-r from-[#E4D7C8] to-transparent" />

                    </div>

                    {/* =================================================
                        ACTION BUTTON
                    ================================================= */}

                    <div className="flex items-center gap-2">

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(kategori)
                        }
                        className="
                          group/edit
                          flex-1
                          h-11
                          rounded-xl
                          bg-gradient-to-r
                          from-[#A5161D]
                          to-[#650B0F]
                          text-white
                          flex
                          items-center
                          justify-center
                          gap-2
                          text-[12px]
                          font-black
                          shadow-[0_8px_18px_-10px_rgba(143,17,23,0.75)]
                          transition-all
                          duration-200
                          hover:from-[#8F1117]
                          hover:to-[#4D080B]
                          hover:shadow-[0_11px_22px_-9px_rgba(143,17,23,0.8)]
                          active:scale-[0.98]
                        "
                      >

                        <FaPen className="text-[11px] transition-transform group-hover/edit:-rotate-12" />

                        <span>Edit</span>

                      </button>

                      {/* LIHAT MOBIL (BARU) */}

                      <button
                        type="button"
                        onClick={() => setKategoriDipilih(kategori)}
                        className="
                          shrink-0
                          w-11
                          h-11
                          rounded-xl
                          bg-white
                          text-[#8F1117]
                          border
                          border-[#DCC8AF]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                          hover:bg-[#C9A227]
                          hover:text-white
                          hover:border-[#C9A227]
                          hover:shadow-[0_8px_16px_-9px_rgba(167,123,62,0.7)]
                          active:scale-[0.98]
                        "
                        aria-label={`Lihat mobil ${kategori.name}`}
                        title="Lihat daftar mobil"
                      >

                        <FaEye className="text-[13px]" />

                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleHapusKategori(
                            kategori.id
                          )
                        }
                        className="
                          shrink-0
                          w-11
                          h-11
                          rounded-xl
                          bg-white
                          text-[#A5161D]
                          border
                          border-[#D9A5A8]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                          hover:bg-[#A5161D]
                          hover:text-white
                          hover:border-[#A5161D]
                          hover:shadow-[0_8px_16px_-9px_rgba(143,17,23,0.7)]
                          active:scale-[0.98]
                        "
                        aria-label={`Hapus ${kategori.name}`}
                        title="Hapus kategori"
                      >

                        <FaTrashAlt className="text-[11px]" />

                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      BOTTOM GOLD ACCENT
                  ================================================= */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      w-16
                      h-1
                      rounded-tr-full
                      bg-gradient-to-r
                      from-[#8F1117]
                      to-[#C9A227]
                      opacity-80
                    "
                  />

                </article>

              );
            })}

            {/* =====================================================
                CARD TAMBAH KATEGORI
            ===================================================== */}

            <button
              type="button"
              onClick={bukaTambah}
              className="
                group
                relative
                min-h-[405px]
                rounded-[22px]
                border-[1.5px]
                border-dashed
                border-[#CDBEA9]
                bg-gradient-to-br
                from-[#FFFFFF]
                via-[#FCFAF7]
                to-[#F7F0E8]
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-5
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#8F1117]
                hover:shadow-[0_20px_40px_-22px_rgba(143,17,23,0.35)]
              "
            >

              {/* Decorative corner */}

              <div
                className="
                  absolute
                  top-0
                  left-0
                  w-20
                  h-20
                  bg-gradient-to-br
                  from-[#8F1117]/[0.08]
                  to-transparent
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  right-0
                  w-28
                  h-28
                  bg-gradient-to-tl
                  from-[#C9A227]/[0.10]
                  to-transparent
                "
              />

              {/* Plus icon */}

              <span
                className="
                  relative
                  z-10
                  w-[68px]
                  h-[68px]
                  rounded-[20px]
                  bg-gradient-to-br
                  from-[#A5161D]
                  to-[#650B0F]
                  text-[#F6D47A]
                  flex
                  items-center
                  justify-center
                  shadow-[0_14px_28px_-13px_rgba(143,17,23,0.65)]
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:rotate-3
                "
              >
                <FaPlus className="text-xl" />
              </span>

              <h3 className="relative z-10 mt-5 text-[16px] font-black text-[#5F0A0D]">
                Tambah Kategori
              </h3>

              <p className="relative z-10 text-[11px] text-[#8B8583] mt-1 max-w-[190px] leading-relaxed">
                Buat kategori kendaraan baru di MobilKu
              </p>

              <div className="relative z-10 flex items-center gap-2 mt-4">

                <span className="w-8 h-[2px] bg-[#C9A227] rounded-full" />

                <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#A47B3B]">
                  Add Category
                </span>

                <span className="w-8 h-[2px] bg-[#C9A227] rounded-full" />

              </div>

            </button>

          </div>

          {/* =====================================================
              EMPTY STATE
          ===================================================== */}

          {dataKategori.length === 0 && (

            <div className="mt-6 rounded-2xl border border-[#E8DED4] bg-white py-12 text-center shadow-sm">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F9E7E8] text-[#8F1117] flex items-center justify-center">

                <FaTag className="text-xl" />

              </div>

              <h3 className="mt-4 text-sm font-black text-[#241316]">
                Belum Ada Kategori
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Tambahkan kategori kendaraan pertama Anda.
              </p>

              <button
                type="button"
                onClick={bukaTambah}
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  h-10
                  rounded-xl
                  bg-[#8F1117]
                  text-white
                  text-xs
                  font-bold
                "
              >
                <FaPlus />
                Tambah Kategori
              </button>

            </div>

          )}

        </section>
      )}

      {/* =====================================================
          POPUP DAFTAR MOBIL PER KATEGORI (BARU)
      ===================================================== */}

      {kategoriDipilih && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#241316]/45 backdrop-blur-[3px] p-4"
          onClick={() => setKategoriDipilih(null)}
        >
          <div
            className="w-full max-w-lg rounded-[24px] bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header popup */}
            <div className="relative flex items-center gap-4 px-5 pt-5 pb-4 border-b border-[#F3ECE3] bg-gradient-to-b from-white to-[#FBF7F2]">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8F1117] via-[#C9A227] to-[#650B0F]" />

              {kategoriDipilih.icon ? (
                <img
                  src={getImageUrl(kategoriDipilih.icon)}
                  alt={kategoriDipilih.name}
                  className="w-20 h-12 object-contain shrink-0"
                />
              ) : (
                <span className="w-12 h-12 rounded-2xl bg-[#F9E7E8] text-[#8F1117] flex items-center justify-center shrink-0">
                  <FaCar className="text-lg" />
                </span>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#A47B3B]">
                  Kategori
                </p>
                <h3 className="font-serif text-xl font-black text-[#5F0A0D] leading-tight truncate">
                  {kategoriDipilih.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {mobilKategoriDipilih.length} mobil dalam kategori ini
                </p>
              </div>

              <button
                type="button"
                onClick={() => setKategoriDipilih(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E1D9] text-gray-500 flex items-center justify-center hover:bg-[#8F1117] hover:text-white hover:border-[#8F1117] transition"
                aria-label="Tutup"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Daftar mobil */}
            <div className="max-h-[360px] overflow-y-auto p-3 space-y-2">
              {mobilKategoriDipilih.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F9E7E8] text-[#8F1117] flex items-center justify-center">
                    <FaCar />
                  </div>
                  <p className="mt-3 text-sm font-bold text-gray-500">
                    Belum ada mobil di kategori ini
                  </p>
                </div>
              ) : (
                mobilKategoriDipilih.map((mobil) => (
                  <div
                    key={mobil.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl border border-[#F1E8DE] hover:bg-[#FDFAF6] transition"
                  >
                    <img
                      src={mobil.images?.[0]}
                      alt={mobil.nama}
                      className="w-20 h-14 rounded-xl object-cover ring-1 ring-[#EADFD2] bg-[#F7F3ED] shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-[#241316] truncate">
                        {mobil.nama}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {[mobil.merek, mobil.tahun].filter(Boolean).join(" • ")}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-black text-[#8F1117] whitespace-nowrap">
                        Rp {Number(mobil.harga || 0).toLocaleString("id-ID")}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          Number(mobil.stok) > 0
                            ? "text-[#047857] bg-[#10B981]/10"
                            : "text-[#BE123C] bg-[#BE123C]/10"
                        }`}
                      >
                        {Number(mobil.stok) > 0 ? `Stok ${mobil.stok}` : "Habis"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer popup */}
            <div className="px-5 py-3.5 border-t border-[#F3ECE3] flex items-center justify-between bg-[#FDFBF8]">
              <span className="text-[11px] text-gray-500">
                Klik di luar atau tekan Esc untuk menutup
              </span>
              <button
                type="button"
                onClick={() => setKategoriDipilih(null)}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#A5161D] to-[#650B0F] text-white text-xs font-extrabold shadow-[0_8px_18px_-10px_rgba(143,17,23,0.75)] hover:from-[#8F1117] hover:to-[#4D080B] transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL TAMBAH / EDIT
      ===================================================== */}

      <dialog
        ref={modalRef}
        className="modal"
        onClose={resetForm}
      >

        <div className="modal-box p-0 rounded-[26px] max-w-md overflow-hidden bg-white">

          {/* =================================================
              HEADER MODAL
          ================================================= */}

          <div className="relative px-5 pt-5 pb-4 border-b border-[#F0E7DE]">

            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8F1117] via-[#C9A227] to-[#650B0F]" />

            <div className="flex items-center gap-3">

              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#A5161D] to-[#4A080B] text-white flex items-center justify-center shadow-[0_10px_20px_-8px_rgba(143,17,23,0.6)]">
                <FaTag />
              </span>

              <div className="flex-1">

                <h3 className="font-black text-lg text-[#241316] leading-tight">
                  {editId
                    ? "Edit Kategori"
                    : "Tambah Kategori"}
                </h3>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  {editId
                    ? "Ubah nama atau ganti ikon kategori"
                    : "Unggah ikon dan beri nama kategori baru"}
                </p>

              </div>

              <button
                type="button"
                onClick={tutupModal}
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-[#FAF8F5]
                  border
                  border-[#E8E1D9]
                  text-gray-500
                  flex
                  items-center
                  justify-center
                  hover:bg-[#8F1117]
                  hover:text-white
                  hover:border-[#8F1117]
                  transition
                "
                aria-label="Tutup"
              >
                <FaTimes className="text-xs" />
              </button>

            </div>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleTambahKategori}
            className="px-5 py-5"
          >

            {/* ICON */}

            <p className="text-xs font-bold text-gray-700 mb-2">
              Ikon Kategori
            </p>

            <label
              className="
                group
                relative
                flex
                flex-col
                items-center
                justify-center
                h-40
                rounded-2xl
                border-2
                border-dashed
                border-[#E3D3BF]
                bg-gradient-to-b
                from-[#FFFDFB]
                to-[#F8F3EC]
                cursor-pointer
                transition
                hover:border-[#8F1117]/50
                overflow-hidden
              "
            >

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setIcon(
                    e.target.files?.[0] || null
                  )
                }
                className="hidden"
              />

              {gambarForm ? (

                <>
                  <img
                    src={gambarForm}
                    alt="Pratinjau ikon"
                    className="h-24 max-w-[75%] object-contain"
                  />

                  <span className="absolute bottom-2 max-w-[90%] truncate text-[10px] font-bold text-[#8a6326] bg-white/90 border border-[#EADFD2] px-2.5 py-1 rounded-full">
                    {icon
                      ? icon.name
                      : "Ikon saat ini"}{" "}
                    · klik untuk ganti
                  </span>
                </>

              ) : (

                <>
                  <span className="w-12 h-12 rounded-2xl bg-[#8F1117]/10 text-[#8F1117] flex items-center justify-center transition-transform group-hover:scale-110">
                    <FaCloudUploadAlt className="text-xl" />
                  </span>

                  <span className="mt-2 text-sm font-bold text-[#241316]">
                    Klik untuk unggah ikon
                  </span>

                  <span className="text-[11px] text-gray-500">
                    PNG transparan disarankan
                  </span>
                </>

              )}

            </label>

            {/* NAMA */}

            <label className="block text-xs font-bold text-gray-700 mt-4 mb-2">
              Nama Kategori
            </label>

            <input
              type="text"
              placeholder="Contoh: SUV, Sedan, MPV"
              value={nama}
              onChange={(e) =>
                setNama(e.target.value)
              }
              className="
                input
                w-full
                h-11
                rounded-xl
                bg-[#FBF8F4]
                border-[#EADFD2]
                text-[#241316]
                placeholder:text-gray-400
                focus:outline-none
                focus:border-[#C9A227]
                focus:ring-2
                focus:ring-[#C9A227]/10
              "
            />

            {/* BUTTON */}

            <div className="flex gap-2 mt-5">

              <button
                type="button"
                onClick={tutupModal}
                className="
                  flex-1
                  h-11
                  rounded-xl
                  bg-white
                  border
                  border-[#EADFD2]
                  text-gray-700
                  text-sm
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  hover:bg-[#FBF8F4]
                  transition
                "
              >
                <FaTimes className="text-xs" />
                Tutup
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  flex-[1.4]
                  h-11
                  rounded-xl
                  bg-gradient-to-r
                  from-[#A5161D]
                  to-[#650B0F]
                  text-white
                  text-sm
                  font-extrabold
                  hover:from-[#8F1117]
                  hover:to-[#4D0A0D]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  shadow-[0_10px_22px_-10px_rgba(143,17,23,0.7)]
                  transition-all
                "
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : editId
                    ? "Simpan Perubahan"
                    : "Simpan Kategori"}
              </button>

            </div>

          </form>

        </div>

        {/* SUBMIT LOADING */}

        {isSubmitting && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">

            <div className="bg-white rounded-2xl px-6 py-5 shadow-2xl flex flex-col items-center gap-3">

              <span className="loading loading-spinner loading-md text-[#8F1117]" />

              <p className="text-xs font-bold text-[#241316]">
                Menyimpan kategori...
              </p>

            </div>

          </div>

        )}

      </dialog>

    </div>
  );
};

export default KelolaKategori;
