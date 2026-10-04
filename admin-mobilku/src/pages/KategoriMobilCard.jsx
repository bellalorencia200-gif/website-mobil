import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

import {
  FaChartPie,
  FaCar,
  FaThLarge,
  FaStar,
  FaChevronDown,
  FaFire,
} from "react-icons/fa";

// ======================================================
// WARNA KATEGORI
// ======================================================

const WARNA_KATEGORI = [
  {
    pekat: "#BE123C",
    terang: "#F87171",
  },
  {
    pekat: "#C27C0E",
    terang: "#FBBF24",
  },
  {
    pekat: "#6D28D9",
    terang: "#A78BFA",
  },
  {
    pekat: "#0D9488",
    terang: "#2DD4BF",
  },
];

const WARNA_LAINNYA = {
  pekat: "#78716C",
  terang: "#D6D3D1",
};

const JUMLAH_TAMPIL = 4;

// ======================================================
// GRAFIK DONAT
// ======================================================

const GrafikDonat = ({
  data,
  total,
  jumlahKategori,
}) => {
  const [hover, setHover] = useState(null);
  const [lainnyaTerbuka, setLainnyaTerbuka] = useState(false);

  const ukuran = 290;
  const tengah = ukuran / 2;
  const tebal = 38;

  const r = (ukuran - tebal - 10) / 2;
  const keliling = 2 * Math.PI * r;

  const celah = data.length > 1 ? 4 : 0;

  let posisi = 0;

  // ====================================================
  // HITUNG POTONGAN DONAT
  // ====================================================

  const potongan = data.map((item) => {
    const panjang =
      total > 0
        ? (item.jumlah / total) * keliling
        : 0;

    const hasil = {
      ...item,
      dash: Math.max(panjang - celah, 0),
      offset: -posisi,
    };

    posisi += panjang;

    return hasil;
  });

  const aktif =
    hover !== null
      ? data[hover]
      : null;

  const terpopuler =
    data.find((item) => !item.lainnya) || null;

  const rataRata =
    jumlahKategori > 0
      ? (total / jumlahKategori).toLocaleString(
          "id-ID",
          {
            maximumFractionDigits: 1,
          }
        )
      : "0";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)] gap-6 lg:gap-7 items-stretch">

      {/* ==================================================
          PANEL GRAFIK
      ================================================== */}

      <div className="relative overflow-hidden rounded-[30px] min-h-[600px] lg:min-h-[650px] bg-gradient-to-br from-[#3b0306] via-[#72090f] to-[#240204] shadow-[0_25px_55px_-25px_rgba(70,0,5,0.75)] ring-1 ring-[#D9A85C]/50">

        {/* Dekorasi background */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#D9A85C]/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#F87171]/10 blur-3xl" />

          <div className="absolute top-[18%] -right-20 w-[280px] h-[80px] rotate-[-32deg] bg-white/[0.025]" />

          <div className="absolute top-[42%] -left-20 w-[260px] h-[70px] rotate-[-32deg] bg-black/10" />

          <div className="absolute bottom-[20%] -right-20 w-[280px] h-[70px] rotate-[-32deg] bg-white/[0.025]" />

          <div className="absolute inset-4 rounded-[25px] border border-[#D9A85C]/20" />

        </div>

        {/* Garis atas */}

        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#F6D47A] to-transparent" />

        <div className="relative z-10 flex flex-col h-full px-5 sm:px-6 py-5">

          {/* HEADER */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F6D47A] to-[#B98220] text-[#4a080b] flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] ring-1 ring-[#FCE3A6]">

              <FaChartPie className="text-lg" />

            </div>

            <div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Kategori Mobil
              </h2>

              <p className="text-[11px] sm:text-xs text-white/65 mt-0.5">
                Persentase berdasarkan kategori
              </p>
            </div>

          </div>

          {/* GARIS */}

          <div className="flex items-center gap-2 mt-4">

            <div className="w-10 h-[2px] bg-[#F6D47A] rounded-full" />

            <div className="w-5 h-[2px] bg-[#F6D47A]/50 rounded-full" />

            <div className="flex-1 h-px bg-gradient-to-r from-[#F6D47A]/30 to-transparent" />

          </div>

          {/* LABEL */}

          <div className="flex items-center justify-center gap-2 mt-5">

            <FaChartPie className="text-[#F6D47A] text-xs" />

            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FCE3A6]">
              Total Mobil
            </span>

          </div>

          {/* DONUT */}

          <div className="flex justify-center mt-3">

            <div
              className="relative"
              style={{
                width: ukuran,
                height: ukuran,
                maxWidth: "100%",
              }}
            >

              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${ukuran} ${ukuran}`}
                className="overflow-visible"
                role="img"
                aria-label="Grafik persentase mobil berdasarkan kategori"
              >

                {/* Ring dasar */}

                <circle
                  cx={tengah}
                  cy={tengah}
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth={tebal}
                />

                {/* Potongan donat */}

                {potongan.map((item, i) => (
                  <circle
                    key={`${item.nama}-${i}`}
                    cx={tengah}
                    cy={tengah}
                    r={r}
                    fill="none"
                    stroke={item.warnaTerang}
                    strokeWidth={
                      hover === i
                        ? tebal + 7
                        : tebal
                    }
                    strokeDasharray={`${item.dash} ${keliling}`}
                    strokeDashoffset={item.offset}
                    strokeLinecap="butt"
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      opacity:
                        hover === null || hover === i
                          ? 1
                          : 0.28,

                      filter:
                        hover === i
                          ? `drop-shadow(0 0 8px ${item.warnaTerang})`
                          : "none",
                    }}
                    onMouseEnter={() =>
                      setHover(i)
                    }
                    onMouseLeave={() =>
                      setHover(null)
                    }
                  >
                    <title>
                      {`${item.nama}: ${item.jumlah} mobil (${item.persen}%)`}
                    </title>
                  </circle>
                ))}

              </svg>

              {/* TENGAH DONAT */}

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">

                <span className="text-[9px] uppercase tracking-[0.32em] font-black text-[#FCE3A6]">
                  {aktif
                    ? aktif.nama
                    : "TOTAL"}
                </span>

                <span className="text-[56px] sm:text-[62px] leading-none font-black text-white tracking-tight mt-1 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
                  {aktif
                    ? aktif.jumlah
                    : total}
                </span>

                <span className="text-[11px] font-semibold text-white/70 mt-2">
                  {aktif
                    ? `${aktif.persen}% dari total`
                    : "mobil tersedia"}
                </span>

              </div>

            </div>

          </div>

          {/* FOOTER DONUT */}

          <div className="flex items-center justify-center gap-3 mt-[-5px]">

            <span className="w-10 h-px bg-[#F6D47A]/60" />

            <FaCar className="text-[#F6D47A] text-sm" />

            <span className="w-10 h-px bg-[#F6D47A]/60" />

          </div>

          <p className="text-center text-[9px] uppercase tracking-[0.28em] font-black text-white/75 mt-2">
            Ragam kategori mobil
          </p>

          {/* ==================================================
              PANEL TERPOPULER
          ================================================== */}

          {terpopuler && (
            <div className="mt-5 rounded-[20px] overflow-hidden border border-[#D9A85C]/40 bg-black/20 backdrop-blur-sm">

              {/* Header */}

              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#D9A85C]/20">

                <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#FCD34D] to-[#D99B21] text-[#4a080b] flex items-center justify-center shadow-lg">

                  <FaFire className="text-sm" />

                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#FCE3A6]">
                    Terpopuler
                  </p>

                  <p className="text-sm font-black text-white truncate">
                    {terpopuler.nama}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-sm font-black text-white tabular-nums">
                    {terpopuler.jumlah}
                  </p>

                  <p className="text-[8px] uppercase tracking-wider text-white/50">
                    unit
                  </p>

                </div>

              </div>

              {/* Statistik */}

              <div className="grid grid-cols-2 divide-x divide-[#D9A85C]/20">

                <div className="text-center py-3">

                  <p className="text-xl font-black text-white">
                    {jumlahKategori}
                  </p>

                  <p className="text-[8px] uppercase tracking-[0.18em] font-bold text-white/50">
                    Kategori
                  </p>

                </div>

                <div className="text-center py-3">

                  <p className="text-xl font-black text-white">
                    {rataRata}
                  </p>

                  <p className="text-[8px] uppercase tracking-[0.18em] font-bold text-white/50">
                    Unit / kategori
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ==================================================
          LIST KATEGORI
      ================================================== */}

      <div className="w-full flex flex-col">

        <div className="flex items-center justify-between mb-3">

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#9b1b20]">
              Distribusi
            </p>

            <h3 className="text-base sm:text-lg font-black text-[#1c0a0b]">
              Komposisi Kategori
            </h3>

          </div>

          <span className="text-[10px] font-bold text-gray-400">
            {data.length} kategori
          </span>

        </div>

        <div className="flex-1 flex flex-col gap-3">

          {data.map((item, i) => (
            <div
              key={`${item.nama}-${i}`}
              onMouseEnter={() =>
                setHover(i)
              }
              onMouseLeave={() =>
                setHover(null)
              }
              className={`
                group relative overflow-hidden
                flex-1 flex flex-col justify-center
                rounded-[21px]
                border
                transition-all duration-300
                ${
                  hover === i
                    ? "border-[#D9A85C]/60 bg-[#FFFDFC] shadow-[0_15px_35px_-18px_rgba(80,20,15,0.45)] -translate-y-0.5"
                    : "border-[#EADFD2] bg-white"
                }
              `}
            >

              {/* Glow kiri */}

              <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-opacity duration-300"
                style={{
                  backgroundColor: item.warna,
                  opacity:
                    hover === i ? 1 : 0,
                }}
              />

              <div
                className={`p-3.5 sm:p-4 ${
                  item.lainnya
                    ? "cursor-pointer select-none"
                    : ""
                }`}
                onClick={
                  item.lainnya
                    ? () =>
                        setLainnyaTerbuka(
                          (value) => !value
                        )
                    : undefined
                }
                role={
                  item.lainnya
                    ? "button"
                    : undefined
                }
                aria-expanded={
                  item.lainnya
                    ? lainnyaTerbuka
                    : undefined
                }
              >

                <div className="flex items-center gap-3 sm:gap-4">

                  {/* ICON */}

                  <div
                    className="w-[54px] h-[54px] sm:w-[60px] sm:h-[60px] shrink-0 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `${item.warna}12`,
                      border: `1px solid ${item.warna}35`,
                    }}
                  >

                    <FaCar
                      className="text-xl sm:text-2xl"
                      style={{
                        color: item.warna,
                      }}
                    />

                  </div>

                  {/* NAMA + BAR */}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            item.warna,
                          boxShadow: `0 0 0 3px ${item.warna}15`,
                        }}
                      />

                      <span className="text-sm sm:text-[15px] font-black text-[#1c0a0b]">
                        {item.nama}
                      </span>

                      {/* TERBANYAK */}

                      {i === 0 &&
                        !item.lainnya && (
                          <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-black uppercase tracking-wide text-[#4a080b] bg-gradient-to-r from-[#FCD34D] to-[#E0A82E] px-2.5 py-1 rounded-full shadow-sm">

                            <FaStar className="text-[7px]" />

                            Terbanyak

                          </span>
                        )}

                    </div>

                    {/* PROGRESS */}

                    <div className="mt-3 h-2 rounded-full bg-[#EFE7DE] overflow-hidden">

                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.min(
                            item.persen,
                            100
                          )}%`,

                          background: `linear-gradient(90deg, ${item.warna}, ${item.warnaTerang})`,

                          boxShadow: `0 0 10px ${item.warna}55`,
                        }}
                      />

                    </div>

                  </div>

                  {/* STATISTIK DESKTOP */}

                  <div className="hidden sm:flex items-center shrink-0">

                    <div className="text-right px-4 border-r border-[#EADFD2]">

                      <p className="text-base font-black text-[#1c0a0b] tabular-nums leading-none">
                        {item.jumlah}
                      </p>

                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                        unit
                      </p>

                    </div>

                    <div className="w-[70px] text-right pl-4">

                      <p
                        className="text-xl font-black tabular-nums"
                        style={{
                          color: item.warna,
                        }}
                      >
                        {item.persen}%
                      </p>

                    </div>

                  </div>

                  {/* STATISTIK MOBILE */}

                  <div className="sm:hidden text-right shrink-0">

                    <p
                      className="text-lg font-black tabular-nums"
                      style={{
                        color: item.warna,
                      }}
                    >
                      {item.persen}%
                    </p>

                    <p className="text-[9px] font-bold text-gray-400">
                      {item.jumlah} unit
                    </p>

                  </div>

                  {/* CHEVRON */}

                  {item.lainnya && (
                    <FaChevronDown
                      className={`
                        shrink-0 text-xs
                        transition-transform duration-300
                        ${
                          lainnyaTerbuka
                            ? "rotate-180 text-[#8f1117]"
                            : "text-gray-400"
                        }
                      `}
                    />
                  )}

                </div>

              </div>

              {/* ==================================================
                  DETAIL LAINNYA
              ================================================== */}

              {item.lainnya &&
                lainnyaTerbuka && (
                  <div className="px-3.5 sm:px-4 pb-4">

                    <div className="rounded-2xl bg-[#FBF8F4] ring-1 ring-[#EFE6DC] overflow-hidden">

                      <div className="max-h-[180px] overflow-y-auto divide-y divide-[#EFE6DC]">

                        {item.rincian.map(
                          (sub, index) => (
                            <div
                              key={`${sub.nama}-${index}`}
                              className="flex items-center gap-3 px-4 py-2.5"
                            >

                              <span className="w-2 h-2 rounded-full shrink-0 bg-[#A8A29E]" />

                              <span className="flex-1 min-w-0 text-sm font-bold text-[#1c0a0b] truncate">
                                {sub.nama}
                              </span>

                              <div className="hidden sm:block w-24 h-1.5 rounded-full bg-[#EFE7DE] overflow-hidden">

                                <div
                                  className="h-full rounded-full bg-[#78716C]"
                                  style={{
                                    width: `${Math.min(
                                      sub.persen,
                                      100
                                    )}%`,
                                  }}
                                />

                              </div>

                              <span className="w-14 text-right text-sm font-black text-[#1c0a0b] tabular-nums">

                                {sub.jumlah}

                                <span className="text-[9px] font-bold text-gray-400 ml-1">
                                  unit
                                </span>

                              </span>

                              <span className="w-10 text-right text-sm font-extrabold text-[#57534E] tabular-nums">
                                {sub.persen}%
                              </span>

                            </div>
                          )
                        )}

                      </div>

                      <p className="px-4 py-2 text-[10px] font-semibold text-gray-500 bg-white/70 border-t border-[#EFE6DC]">
                        {item.rincian.length} kategori digabung dalam
                        {" "}
                        "Lainnya"
                      </p>

                    </div>

                  </div>
                )}

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

// ======================================================
// KARTU KATEGORI MOBIL
// ======================================================

const KategoriMobilCard = () => {
  const [daftarMobil, setDaftarMobil] =
    useState([]);

  const [daftarKategori, setDaftarKategori] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  // ====================================================
  // FETCH DATA
  // ====================================================

  useEffect(() => {
    const ambilData = async () => {
      try {
        const [
          mobilResult,
          kategoriResult,
        ] = await Promise.allSettled([
          axios.get("/api/mobil"),
          axios.get("/api/categories"),
        ]);

        if (
          mobilResult.status ===
          "fulfilled"
        ) {
          setDaftarMobil(
            mobilResult.value.data?.mobil ||
              []
          );
        }

        if (
          kategoriResult.status ===
          "fulfilled"
        ) {
          setDaftarKategori(
            kategoriResult.value.data
              ?.categories || []
          );
        }
      } catch (error) {
        console.error(
          "Gagal mengambil data kategori:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    ambilData();
  }, []);

  // ====================================================
  // NAMA KATEGORI
  // ====================================================

  const namaKategori = {};

  daftarKategori.forEach((kategori) => {
    namaKategori[kategori.id] =
      kategori.name;
  });

  // ====================================================
  // HITUNG MOBIL
  // ====================================================

  const hitung = {};

  daftarMobil.forEach((mobil) => {
    const nama =
      namaKategori[mobil.categoryId] ||
      mobil.category?.name ||
      "Tanpa Kategori";

    hitung[nama] =
      (hitung[nama] || 0) + 1;
  });

  // ====================================================
  // URUTKAN
  // ====================================================

  const urut = Object.entries(hitung)
    .map(([nama, jumlah]) => ({
      nama,
      jumlah,
    }))
    .sort(
      (a, b) => b.jumlah - a.jumlah
    );

  // ====================================================
  // KATEGORI UTAMA
  // ====================================================

  const utama = urut.slice(
    0,
    JUMLAH_TAMPIL
  );

  const sisa = urut.slice(
    JUMLAH_TAMPIL
  );

  // ====================================================
  // LAINNYA
  // ====================================================

  if (sisa.length > 0) {
    utama.push({
      nama: "Lainnya",

      jumlah: sisa.reduce(
        (totalJumlah, kategori) =>
          totalJumlah +
          kategori.jumlah,
        0
      ),

      lainnya: true,

      rincian: sisa.map(
        (kategori) => ({
          ...kategori,

          persen:
            daftarMobil.length > 0
              ? Math.round(
                  (kategori.jumlah /
                    daftarMobil.length) *
                    100
                )
              : 0,
        })
      ),
    });
  }

  const total =
    daftarMobil.length;

  // ====================================================
  // DATA GRAFIK
  // ====================================================

  const dataGrafik = utama.map(
    (kategori, index) => {
      const pasangan =
        kategori.lainnya
          ? WARNA_LAINNYA
          : WARNA_KATEGORI[
              index
            ] ||
            WARNA_KATEGORI[
              WARNA_KATEGORI.length - 1
            ];

      return {
        ...kategori,

        warna: pasangan.pekat,

        warnaTerang:
          pasangan.terang,

        persen:
          total > 0
            ? Math.round(
                (kategori.jumlah /
                  total) *
                  100
              )
            : 0,
      };
    }
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="relative overflow-hidden bg-white rounded-[30px] ring-1 ring-[#EADFD2] shadow-[0_20px_50px_-25px_rgba(80,30,20,0.3)] p-4 sm:p-6 lg:p-7">

      {/* AKSEN ATAS */}

      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#5f0a0d] via-[#D9A85C] to-[#8f1117]" />

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B3141C] to-[#4A080B] text-white flex items-center justify-center shadow-[0_10px_22px_-6px_rgba(143,17,23,0.55)] ring-2 ring-[#F6D47A]/30 overflow-hidden">

            <FaChartPie className="text-lg relative z-10" />

            <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-full bg-[#F6D47A]/30 blur-md" />

          </div>

          <div>

            <h2 className="font-black text-[#1c0a0b] text-lg sm:text-xl tracking-tight">
              Kategori Mobil
            </h2>

            <p className="text-[12px] sm:text-[13px] font-medium text-gray-500 mt-0.5">
              Persentase berdasarkan kategori
            </p>

          </div>

        </div>

        {/* STATISTIK HEADER */}

        {!isLoading &&
          total > 0 && (
            <div className="flex items-center gap-2">

              <div className="flex items-center gap-2 text-xs font-extrabold text-[#1c0a0b] bg-[#FBF6EE] ring-1 ring-[#E0CBB0] px-3.5 py-2 rounded-full tabular-nums">

                <FaCar className="text-[#C27C0E]" />

                <span>
                  {total} mobil
                </span>

              </div>

              <div className="flex items-center gap-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#B3141C] to-[#4A080B] px-3.5 py-2 rounded-full shadow-[0_7px_15px_-7px_rgba(143,17,23,0.65)] tabular-nums">

                <FaThLarge className="text-[11px] text-[#FCD34D]" />

                <span>
                  {urut.length} kategori
                </span>

              </div>

            </div>
          )}

      </div>

      {/* GARIS HEADER */}

      <div className="flex items-center gap-2 mt-4">

        <div className="w-12 h-[3px] rounded-full bg-[#9B1B20]" />

        <div className="w-7 h-[3px] rounded-full bg-[#E0A82E]" />

        <div className="flex-1 h-px bg-gradient-to-r from-[#EADFD2] to-transparent" />

      </div>

      {/* CONTENT */}

      <div className="mt-6">

        {/* LOADING */}

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-6 animate-pulse">

            <div className="h-[600px] rounded-[30px] bg-[#F5EEE6]" />

            <div className="space-y-3">

              {[...Array(5)].map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-[96px] rounded-[21px] bg-[#F7F3ED]"
                  />
                )
              )}

            </div>

          </div>
        ) : dataGrafik.length ===
          0 ? (

          /* EMPTY */

          <div className="py-16 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FBF6EE] flex items-center justify-center mb-4">

              <FaCar className="text-2xl text-[#C27C0E]" />

            </div>

            <p className="text-sm font-bold text-gray-500">
              Belum ada data mobil
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Data kategori akan muncul
              setelah mobil ditambahkan.
            </p>

          </div>
        ) : (

          /* DATA */

          <GrafikDonat
            data={dataGrafik}
            total={total}
            jumlahKategori={
              urut.length
            }
          />

        )}

      </div>

    </div>
  );
};

export default KategoriMobilCard;
