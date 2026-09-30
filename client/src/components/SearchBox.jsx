import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaSearch,
  FaSlidersH,
  FaArrowRight,
  FaHeart,
  FaUsers,
  FaWallet,
  FaTachometerAlt,
} from "react-icons/fa";

import asalam1 from "../assets/asalam1.jpg";
import asalam2 from "../assets/asalam2.png";
import asalam3 from "../assets/asalam3.png";
import asalam4 from "../assets/asalam4.png";

function SearchBox() {
  const [KataKunci, setKatakunci] = useState("");
  const [historiPencarian, sethistoriPencarian] = useState([]);
  const [pencarianFokus, setPencarianFokus] = useState(false);

  const navigate = useNavigate();
  const boxRef = useRef(null);
  const kategoriRef = useRef(null);

  const scrollKategori = (offset) => {
    if (kategoriRef.current) {
      kategoriRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const pencarianTeratas = [
    "Honda Brio",
    "Honda Jazz",
    "Toyota Avanza",
    "Toyota Yaris",
    "Honda Mobilio",
    "Honda Civic",
    "Honda HR-V",
    "Toyota Agya",
    "Toyota Fortuner",
    "Toyota Kijang Innova",
  ];

  const kategori = [
    {
      title: "Pilihan Favorit",
      image: asalam1,
      subtitle: "Mobil pilihan pelanggan",
      icon: FaHeart,
    },
    {
      title: "Mobil Keluarga",
      image: asalam2,
      subtitle: "Nyaman untuk keluarga",
      icon: FaUsers,
    },
    {
      title: "TDP Rendah",
      image: asalam3,
      subtitle: "Cicilan lebih ringan",
      icon: FaWallet,
    },
    {
      title: "Km Rendah",
      image: asalam4,
      subtitle: "Kondisi lebih terjaga",
      icon: FaTachometerAlt,
    },
  ];

  useEffect(() => {
    function tanganKlikDiluar(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setPencarianFokus(false);
      }
    }

    document.addEventListener("mousedown", tanganKlikDiluar);

    return () => {
      document.removeEventListener("mousedown", tanganKlikDiluar);
    };
  }, []);

  useEffect(() => {
    // try/catch: kalau data histori di browser rusak, halaman tidak ikut error
    try {
      const dataTersimpan = localStorage.getItem("historiPencarian");
      const data = dataTersimpan ? JSON.parse(dataTersimpan) : [];
      if (Array.isArray(data)) sethistoriPencarian(data);
    } catch {
      localStorage.removeItem("historiPencarian");
    }
  }, []);

  function simpanPencarian(kataKunci) {
    if (!kataKunci.trim()) return;

    const historiBaru = [
      kataKunci,
      ...historiPencarian.filter((item) => item !== kataKunci),
    ].slice(0, 8);

    sethistoriPencarian(historiBaru);

    localStorage.setItem("historiPencarian", JSON.stringify(historiBaru));
  }

  function hapusHistori() {
    sethistoriPencarian([]);
    localStorage.removeItem("historiPencarian");
  }

  // Tombol Filter: bawa kata yang sudah diketik ke Katalog, supaya tidak
  // hilang (sebelumnya selalu ke /katalog kosong, sama seperti "Lihat Semua")
  function bukaFilter() {
    const kata = KataKunci.trim();

    if (kata) simpanPencarian(kata);
    setPencarianFokus(false);

    navigate(kata ? `/katalog?search=${encodeURIComponent(kata)}` : "/katalog");
  }

  function lakukanPencarian(kataKunci = KataKunci) {
    if (!kataKunci.trim()) return;

    simpanPencarian(kataKunci);
    setPencarianFokus(false);

    navigate(`/katalog?search=${encodeURIComponent(kataKunci)}`);
  }

  return (
   <div
  ref={boxRef}
  className="
    relative
    w-full
    overflow-hidden
    rounded-[28px]
    border border-white/70
    bg-white/95
    shadow-none md:shadow-[0_25px_70px_-25px_rgba(80,0,10,0.35)]
    backdrop-blur-xl
    lg:-mt-0
  "
>


<div className="pt-0 pr-4 pl-4 pb-2 md:pt-4 md:pr-7 md:pb-7 md:pl-7 lg:pt-0 lg:pr-8 lg:pb-8 lg:pl-8">
          {/* HEADER */}
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="hidden md:block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#9d151b] mb-1">
              MobilKu Premium Auto
            </p>

            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Cari Mobil
            </h2>

            <p className="hidden md:block text-xs md:text-sm text-gray-500 mt-1">
              Sudah tahu mobil yang dicari? Ketik langsung di sini.
            </p>
          </div>

          <button
            onClick={() => navigate("/katalog")}
            className="
              hidden md:flex
              items-center gap-2
              text-xs font-semibold
              text-[#8f1117]
              hover:text-[#5f0a0d]
              transition
            "
          >
            Lihat Semua
            <FaArrowRight className="text-[10px]" />
          </button>
        </div>

        {/* SEARCH */}
       <div className="relative block">
          <div
            className="
              flex items-center
              rounded-2xl
              border border-gray-200
              bg-gray-50/80
              transition-all
              duration-300
              focus-within:border-[#9d151b]
              focus-within:bg-white
              focus-within:shadow-[0_8px_30px_-12px_rgba(157,21,27,0.4)]
            "
          >
            {/* Ikon kaca pembesar sekarang bisa diklik untuk mencari
                (sebelumnya cuma hiasan, diklik tidak terjadi apa-apa) */}
            <button
              type="button"
              onClick={() => lakukanPencarian()}
              aria-label="Cari"
              className="
                ml-2 sm:ml-3 md:ml-4
                flex h-9 w-9 sm:h-10 sm:w-10
                shrink-0
                items-center justify-center
                rounded-xl
                bg-[#8f1117]
                text-white
                shadow-md
                transition
                hover:bg-[#5f0a0d]
              "
            >
              <FaSearch className="text-xs sm:text-sm" />
            </button>

            <input
              type="text"
              placeholder="Cari merek, model, atau tipe mobil"
              className="
                w-full
                min-w-0
                bg-transparent
                px-3 sm:px-4
                py-3.5 sm:py-4
                text-xs sm:text-sm
                text-gray-800
                outline-none
                placeholder:text-gray-400
                placeholder:truncate
              "
              value={KataKunci}
              onChange={(e) => setKatakunci(e.target.value)}
              onFocus={() => setPencarianFokus(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  lakukanPencarian();
                }
              }}
            />

            <button
              type="button"
              onClick={bukaFilter}
              className="
                flex
                mr-2
                items-center gap-2
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-2.5
                text-xs font-semibold
                text-gray-700
                shadow-sm
                hover:border-[#9d151b]
                hover:text-[#9d151b]
                transition
              "
            >
              <FaSlidersH />
              Filter
            </button>
          </div>

          {/* SEARCH DROPDOWN */}
          {pencarianFokus && (
            <div
              className="
                absolute
                left-0 right-0
                top-[calc(100%+10px)]
                z-30
                rounded-2xl
                border border-gray-100
                bg-white
                p-5
                shadow-[0_25px_60px_-20px_rgba(0,0,0,0.3)]
              "
            >
              {historiPencarian.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-800">
                      Histori Pencarian
                    </p>

                    <button
                      onClick={hapusHistori}
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {historiPencarian.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => lakukanPencarian(item)}
                        className="
                          rounded-full
                          border border-red-100
                          bg-red-50
                          px-3 py-1.5
                          text-xs font-medium
                          text-[#8f1117]
                          hover:bg-[#8f1117]
                          hover:text-white
                          transition
                        "
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-gray-800 mb-3">
                  Pencarian Teratas 🔥
                </p>

                <div className="flex flex-wrap gap-2">
                  {pencarianTeratas.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => lakukanPencarian(item)}
                      className="
                        rounded-full
                        border border-gray-200
                        bg-gray-50
                        px-3 py-1.5
                        text-xs
                        text-gray-600
                        hover:border-[#9d151b]
                        hover:bg-red-50
                        hover:text-[#8f1117]
                        transition
                      "
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KATEGORI */}
        <div className="mt-2 md:mt-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-base md:text-lg font-bold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Pilihan Untuk Anda
              </h3>

              <p className="text-xs text-black mt-0.5">
                Temukan berdasarkan kebutuhan
              </p>
            </div>

            <button
              onClick={() => navigate("/katalog")}
              className="
                flex md:hidden
                items-center gap-1.5
                text-xs font-semibold
                text-[#8f1117]
              "
            >
              Semua
              <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          {/* KARTU — SLIDER (mobile/tablet) / GRID PENUH (desktop) */}
          <div className="relative">
            <button
              onClick={() => scrollKategori(-200)}
              className="
                absolute -left-2
                top-[calc(50%-14px)] -translate-y-1/2
                z-10
                flex md:hidden
                h-9 w-9
                items-center justify-center
                rounded-full
                bg-white
                border border-red-100
                shadow-md
                text-[#8f1117]
                text-lg
                hover:bg-[#8f1117] hover:text-white
                transition
              "
            >
              ‹
            </button>

            <button
              onClick={() => scrollKategori(200)}
              className="
                absolute -right-2
                top-[calc(50%-14px)] -translate-y-1/2
                z-10
                flex md:hidden
                h-9 w-9
                items-center justify-center
                rounded-full
                bg-white
                border border-red-100
                shadow-md
                text-[#8f1117]
                text-lg
                hover:bg-[#8f1117] hover:text-white
                transition
              "
            >
              ›
            </button>

            <div
              ref={kategoriRef}
              className="
                grid
                grid-flow-col md:grid-flow-row
                auto-cols-[calc(50%-6px)] sm:auto-cols-[200px] md:auto-cols-auto
                md:grid-cols-4
                gap-3 sm:gap-4 md:gap-5
                overflow-x-auto md:overflow-visible
                pb-2 md:pb-0
                scrollbar-hide
                snap-x snap-mandatory md:snap-none
              "
              style={{ scrollbarWidth: "none" }}
            >
              {kategori.map((item, index) => {
                const Icon = item.icon;

                return (
                  <button
                    key={index}
                    onClick={() => navigate("/katalog")}
                    className="
                      snap-start
                      group
                      relative
                      overflow-hidden
                      rounded-[20px]
                      bg-white
                      border border-gray-100
                      text-left
                      shadow-none md:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.22)]
                      transition-all
                      duration-300
                      hover:-translate-y-1.5
                      hover:shadow-[0_18px_35px_-12px_rgba(95,10,13,0.28)]
                    "
                  >
                    {/* FOTO */}
                    <div className="relative h-36 md:h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />

                      {/* BADGE MOBILKU */}
                      <div className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 shadow-md">
                        <span
                          className="text-[10px] font-bold text-[#7c0d13]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          MobilKu
                        </span>
                      </div>

                      {/* AKSEN MERAH DI BAWAH FOTO */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-8 bg-[#8f1117]"
                        style={{ clipPath: "polygon(0 100%, 100% 25%, 100% 100%)" }}
                      />
                    </div>

                    {/* ICON */}
                    <div
                      className="
                        absolute
                        top-[116px]
                        md:top-[126px]
                        left-4
                        z-10
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        border-[3px]
                        border-white
                        bg-[#8f1117]
                        text-white
                        shadow-lg
                        transition-all
                        duration-300
                        group-hover:scale-110
                      "
                    >
                      <Icon className="text-base" />
                    </div>

                    {/* BAGIAN PUTIH */}
                    <div className="px-3 sm:px-4 pb-4 pt-8">
                      {/* GARIS MAROON */}
                      <div
                        className="
                          mb-3
                          h-[3px]
                          w-9
                          rounded-full
                          bg-[#8f1117]
                          transition-all
                          duration-300
                          group-hover:w-12
                        "
                      />

                      {/* JUDUL */}
                      <h3
                        className="
                          text-sm
                          md:text-base
                          font-bold
                          text-[#172033]
                          mb-1
                          transition-colors
                          duration-300
                          group-hover:text-[#8f1117]
                        "
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.title}
                      </h3>

                      {/* DESKRIPSI */}
                      <p className="min-h-[32px] text-[11px] md:text-xs leading-relaxed text-gray-500">
                        {item.subtitle}
                      </p>

                      {/* LIHAT SEMUA */}
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                        <span
                          className="
                            whitespace-nowrap
                            text-[8px]
                            tracking-[0.06em]
                            sm:text-[9px]
                            sm:tracking-[0.12em]
                            md:text-[10px]
                            font-bold
                            uppercase
                            text-[#8f1117]
                          "
                        >
                          Lihat Semua
                        </span>

                        <span
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#8f1117]
                            text-white
                            transition-all
                            duration-300
                            group-hover:translate-x-1
                          "
                        >
                          <FaArrowRight className="text-[9px]" />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
