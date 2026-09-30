import { useState, useEffect, useRef, useLayoutEffect } from "react";
import axios from "../api/axiosInstance";
import MobilCard from "../components/MobilCard.jsx";
import Navbar from "../components/Navbar.jsx";
import red from "../assets/red.avif";
import whitecars from "../assets/whitecars.avif";

import {
  FaSearch,
  FaTrash,
  FaSlidersH,
  FaChevronDown,
  FaCar,
  FaFileAlt,
  FaTags,
  FaBolt,
  FaUserTie,
  FaSortAmountDown,
  FaGift,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

import FeatureCard from "../components/FeatureCard.jsx";
import kualitasterbaik from "../assets/kualitasterbaik.png";
import dokumenterbaiik from "../assets/dokumenterbaiik.jpg";
import hargaterbaik from "../assets/hargaterbaik.png";
import customersenang from "../assets/customersenang.jpg";
import bantuantimahli from "../assets/bantuantimahli.png";

import Footer from "../components/Footer.jsx";
import FaqItem from "../components/FaqItem.jsx";
import { useSearchParams } from "react-router-dom";

import catalogHero from "../assets/catalogbanner.png";
import toyotaLogo from "../assets/toyota.png";
import hondaLogo from "../assets/Honda.png";
import mazdaLogo from "../assets/logomazda.png";
import mgLogo from "../assets/mg.png";
import lexusLogo from "../assets/lexus.png";
import bmwLogo from "../assets/bmw.png";
import byd from "../assets/byd.png";
import mercedesbenz from "../assets/mercedesbenz.png";
import hyundai from "../assets/hyundai.png";
import mitsubishi from "../assets/mitsubishi.png";
import chevrolet from "../assets/chevrolet.png";
import nissan from "../assets/nissan.png";
import suzuki from "../assets/suzuki.png";
import isuzu from "../assets/isuzu.png";
import volkswagen from "../assets/volkswagen.png";
import mini from "../assets/mini.png";
import kia from "../assets/kia.png";
import dfsk from "../assets/dfsk.png";
import ford from "../assets/ford.png";
import jeep from "../assets/jeep.png";
import wuling from "../assets/wuling.png";

const daftarMerek = [
  {
    nama: "Toyota",
    logo: toyotaLogo,
  },
  {
    nama: "Honda",
    logo: hondaLogo,
  },
  {
    nama: "Mazda",
    logo: mazdaLogo,
  },
  {
    nama: "MG",
    logo: mgLogo,
  },
  {
    nama: "Lexus",
    logo: lexusLogo,
  },
  {
    nama: "BMW",
    logo: bmwLogo,
  },

  // Merek lainnya
  {
    nama: "BYD",
    logo: byd,
  },
  {
    nama: "Mercedes Benz",
    logo: mercedesbenz,
  },
  {
    nama: "Hyundai",
    logo: hyundai,
  },
  {
    nama: "Mitsubishi",
    logo: mitsubishi,
  },
  {
    nama: "Chevrolet",
    logo: chevrolet,
  },
  {
    nama: "Suzuki",
    logo: suzuki,
  },
  {
    nama: "Nissan",
    logo: nissan,
  },
  {
    nama: "Isuzu",
    logo: isuzu,
  },
  {
    nama: "DFSK",
    logo: dfsk,
  },
  {
    nama: "Ford",
    logo: ford,
  },
  {
    nama: "Jeep",
    logo: jeep,
  },
  {
    nama: "Volkswagen",
    logo: volkswagen,
  },
  {
    nama: "Mini",
    logo: mini,
  },
  {
    nama: "Kia",
    logo: kia,
  },
  {
    nama: "Wuling",
    logo: wuling,
  },

];

function Katalog() {
  const [dataMobil, setDataMobil] = useState([]);
  const [dataKategoriList, setDataKategoriList] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const merek = searchParams.get("merek");
  const search = searchParams.get("search");
  const kategori = searchParams.get("kategori");
  const activeTab = searchParams.get("tab");

  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownTerbuka, setDropdownTerbuka] = useState(false);
  const [keyword, setKeyword] = useState(search || "");

  const itemsPerPage = 12;

  const [historiPencarian, setHistoriPencarian] = useState([]);
  const [pencarianFokus, setPencarianFokus] = useState(false);

  const boxRef = useRef(null);
  const scrollYRef = useRef(0);

  const [isFiltering, setIsFiltering] = useState(false);

  const pencarianTeratas = [
    "Honda brio",
    "Honda Jazz",
    "Toyota Avanza",
    "Toyota yaris",
    "Honda Mobilio",
    "Honda Civic",
    "Honda HR-V",
    "Toyota Agya",
    "Toyota Fortuner",
    "Toyota Kijang Innova",
  ];

  useEffect(() => {
    axios.get("/api/mobil").then((responses) => {
      setDataMobil(responses.data.mobil);
    });

    axios.get("/api/categories").then((responses) => {
      setDataKategoriList(responses.data.categories);
    });
  }, []);

  useEffect(() => {
    const dataTersimpan = localStorage.getItem("historiPencarian");

    if (dataTersimpan) {
      setHistoriPencarian(JSON.parse(dataTersimpan));
    }
  }, []);

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

  // Reset halaman ketika filter / tab berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [merek, search, kategori, activeTab]);

  // Sinkronkan keyword dengan URL
  useEffect(() => {
    setKeyword(search || "");
  }, [search]);

  function simpanPencarian(kataKunci) {
    if (!kataKunci?.trim()) return;

    const historiBaru = [
      kataKunci,
      ...historiPencarian.filter(
        (item) => item.toLowerCase() !== kataKunci.toLowerCase()
      ),
    ].slice(0, 10);

    setHistoriPencarian(historiBaru);

    localStorage.setItem(
      "historiPencarian",
      JSON.stringify(historiBaru)
    );
  }

  function hapusHistori() {
    setHistoriPencarian([]);
    localStorage.removeItem("historiPencarian");
  }

  const handleFilterClick = (params) => {
    setIsFiltering(true);

    setTimeout(() => {
      setSearchParams(params);
      setIsFiltering(false);
    }, 400);
  };

  const handleTabClick = (tab) => {
    scrollYRef.current = window.scrollY;

    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next, { preventScrollReset: true });
  };

  useLayoutEffect(() => {
    window.scrollTo(0, scrollYRef.current);
  }, [activeTab]);

  let mobilTerfilter = merek
    ? dataMobil.filter(
        (mobil) =>
          mobil.merek?.toLowerCase() === merek.toLowerCase()
      )
    : dataMobil;

  if (activeTab === "promo") {
    mobilTerfilter = mobilTerfilter.filter(
      (mobil) => mobil.isPromo === true
    );
  }

  if (activeTab === "harga") {
    mobilTerfilter = [...mobilTerfilter].sort((a, b) => {
      const hargaA =
        typeof a.harga === "number"
          ? a.harga
          : Number(String(a.harga || 0).replace(/\D/g, ""));

      const hargaB =
        typeof b.harga === "number"
          ? b.harga
          : Number(String(b.harga || 0).replace(/\D/g, ""));

      return hargaA - hargaB;
    });
  }

  if (kategori) {
  mobilTerfilter = mobilTerfilter.filter(
    (mobil) => String(mobil.categoryId) === String(kategori)
  );
}

  if (search) {
    mobilTerfilter = mobilTerfilter.filter((mobil) =>
      mobil.nama?.toLowerCase().includes(search.toLowerCase())
    );
  }

  const namaKategoriTerpilih = kategori
  ? dataKategoriList.find(
      (k) => String(k.id) === String(kategori)
    )?.name
  : null;

  const totalPages = Math.ceil(
    mobilTerfilter.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const mobilHalamanIni = mobilTerfilter.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nomorHalaman = Array.from(
    { length: totalPages },
    (nilai, index) => index + 1
  );

  const dataFeature = [
    {
      image: kualitasterbaik,
      Icon: FaSearch,
      judul: "Kualitas Terjamin",
      deskripsi:
        "Setiap mobil melalui pemeriksaan menyeluruh sebelum dijual",
    },
    {
      image: dokumenterbaiik,
      Icon: FaFileAlt,
      judul: "Dokumen Lengkap & Legal",
      deskripsi:
        "Surat-surat kendaraan asli, lengkap, dan aman",
    },
    {
      image: hargaterbaik,
      Icon: FaTags,
      judul: "Harga Transparan",
      deskripsi:
        "Harga jujur tanpa biaya tersembunyi",
    },
    {
      image: customersenang,
      Icon: FaBolt,
      judul: "Proses Mudah & Cepat",
      deskripsi:
        "Transaksi jual beli mobil bekas jadi lebih praktis",
    },
    {
      image: bantuantimahli,
      Icon: FaUserTie,
      judul: "Bantuan Tim Ahli",
      deskripsi:
        "Tim kami siap membantu memilih mobil sesuai kebutuhan Anda",
    },
  ];

  const dataFaq = [
    {
      pertanyaan:
        "Apakah biaya balik nama sudah termasuk saat saya membeli mobil di MobilKu?",
      jawaban:
        "Anda dapat melakukan balik nama pada mobil yang sudah dibeli, namun biaya balik nama tidak ditanggung oleh pihak MobilKu dan menjadi tanggung jawab pembeli.",
    },
    {
      pertanyaan:
        "Apakah MobilKu menanggung biaya pajak tahunan mobil yang saya beli?",
      jawaban:
        "Pajak kendaraan menjadi tanggung jawab pembeli setelah proses serah terima selesai. Pastikan untuk mengecek masa berlaku pajak sebelum melakukan pembelian.",
    },
    {
      pertanyaan:
        "Bagaimana saya tahu pembayaran saya aman dilakukan ke MobilKu?",
      jawaban:
        "Semua transaksi resmi MobilKu hanya dilakukan melalui rekening dan metode pembayaran yang tertera resmi di website kami. Jika menemukan nomor rekening yang berbeda dari yang tertera, segera hubungi Customer Service kami. Waspadalah terhadap skema penipuan dan jangan bagikan informasi sensitif Anda kepada siapa pun.",
    },
    {
      pertanyaan:
        "Mengapa harus membeli mobil di MobilKu?",
      jawaban:
        "Kami menawarkan mobil bekas pilihan yang telah melalui pemeriksaan kualitas dan kelengkapan dokumen, dengan harga transparan dan proses yang mudah, sehingga Anda bisa membeli dengan lebih tenang.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="bg-white rounded-lg">

        <div
          className="max-w-4xl mx-auto mt-6 mb-6 px-3 relative"
          ref={boxRef}
        >
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
            <div
              className="
                ml-2 sm:ml-3
                flex h-9 w-9 sm:h-10 sm:w-10
                shrink-0
                items-center justify-center
                rounded-xl
                bg-[#8f1117]
                text-white
                shadow-md
              "
            >
              <FaSearch className="text-xs sm:text-sm" />
            </div>

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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setPencarianFokus(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const params = new URLSearchParams();

                  if (merek) params.set("merek", merek);
                  if (keyword.trim()) {
                    params.set("search", keyword.trim());
                  }

                  setSearchParams(params);
                  simpanPencarian(keyword.trim());
                  setPencarianFokus(false);
                }
              }}
            />

            <button
              type="button"
              onClick={() =>
                setDropdownTerbuka(!dropdownTerbuka)
              }
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

          {pencarianFokus && (
            <div
              className="
                absolute
                left-3
                right-3
                bg-white
                border border-gray-200
                rounded-lg
                shadow-lg
                p-4
                mt-2
                z-20
              "
            >
              {historiPencarian.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-700 mb-2">
                      Histori Pencarian
                    </p>

                    <FaTrash
                      className="text-xs text-black cursor-pointer"
                      onClick={hapusHistori}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {historiPencarian.map((item, index) => (
                      <span
                        key={index}
                        className="
                          bg-red-50
                          text-red-700
                          text-xs
                          font-semibold
                          px-3
                          py-1.5
                          rounded-full
                          cursor-pointer
                        "
                        onClick={() => {
                          setKeyword(item);
                          simpanPencarian(item);

                          const params = new URLSearchParams();

                          if (merek) params.set("merek", merek);

                          params.set("search", item);

                          setSearchParams(params);
                          setPencarianFokus(false);
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs font-bold text-gray-700 mb-2">
                Pencarian Teratas 🔥
              </p>

              <div className="flex flex-wrap gap-2">
                {pencarianTeratas.map((item, index) => (
                  <span
                    key={index}
                    className="
                      bg-red-50
                      text-red-700
                      text-xs
                      font-semibold
                      px-3
                      py-1.5
                      rounded-full
                      cursor-pointer
                    "
                    onClick={() => {
                      setKeyword(item);
                      simpanPencarian(item);

                      const params = new URLSearchParams();

                      if (merek) params.set("merek", merek);

                      params.set("search", item);

                      setSearchParams(params);
                      setPencarianFokus(false);
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-3 relative mt-6">
          <div className="flex gap-2 overflow-x-auto justify-between pb-3 scrollbar-hide">

            <button
              className={`
                px-9 py-2 rounded-lg border text-sm font-semibold
                transition-colors duration-200
                ${
                  !merek
                    ? "bg-[#8f1117] border-[#8f1117] text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }
              `}
              onClick={() => handleFilterClick({})}
            >
              Semua
            </button>

            <button
              className={`
                flex items-center gap-2.5 px-5 py-2 rounded-lg border
                text-sm font-semibold whitespace-nowrap
                transition-colors duration-200
                ${
                  merek === "Toyota"
                    ? "bg-[#8f1117] border-[#8f1117] text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }
              `}
              onClick={() => handleFilterClick({ merek: "Toyota" })}
            >
              <span className="relative w-7 h-7 flex-shrink-0">
                <img
                  src={toyotaLogo}
                  alt="Toyota"
                  className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-10 h-10 object-contain
                  "
                />
              </span>
              Toyota
            </button>

            <button
              className={`
                flex items-center gap-2.5 px-5 py-2 rounded-lg border
                text-sm font-semibold whitespace-nowrap
                transition-colors duration-200
                ${
                  merek === "Honda"
                    ? "bg-[#8f1117] border-[#8f1117] text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }
              `}
              onClick={() => handleFilterClick({ merek: "Honda" })}
            >
              <span className="relative w-7 h-7 flex-shrink-0">
                <img
                  src={hondaLogo}
                  alt="Honda"
                  className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-10 h-10 object-contain
                  "
                />
              </span>
              Honda
            </button>

            <button
              className={`
                flex items-center gap-2.5 px-5 py-2 rounded-lg border
                text-sm font-semibold whitespace-nowrap
                transition-colors duration-200
                ${
                  merek === "Mazda"
                    ? "bg-[#8f1117] border-[#8f1117] text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }
              `}
              onClick={() => handleFilterClick({ merek: "Mazda" })}
            >
              <span className="relative w-7 h-7 flex-shrink-0">
                <img
                  src={mazdaLogo}
                  alt="Mazda"
                  className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-10 h-10 object-contain
                  "
                />
              </span>
              Mazda
            </button>

            <button
              className={`
                flex items-center gap-2.5 px-5 py-2 rounded-lg border
                text-sm font-semibold whitespace-nowrap
                transition-colors duration-200
                ${
                  merek === "MG"
                    ? "bg-[#8f1117] border-[#8f1117] text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }
              `}
              onClick={() => handleFilterClick({ merek: "MG" })}
            >
              <span className="relative w-7 h-7 flex-shrink-0">
                <img
                  src={mgLogo}
                  alt="MG"
                  className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-10 h-10 object-contain
                  "
                />
              </span>
              MG
            </button>

            <button
              className={`
                flex items-center gap-2.5 px-5 py-2 rounded-lg border
                text-sm font-semibold whitespace-nowrap
                transition-colors duration-200
                ${
                  merek === "Lexus"
                    ? "bg-[#8f1117] border-[#8f1117] text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }
              `}
              onClick={() => handleFilterClick({ merek: "Lexus" })}
            >
              <span className="relative w-7 h-7 flex-shrink-0">
                <img
                  src={lexusLogo}
                  alt="Lexus"
                  className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-10 h-10 object-contain
                  "
                />
              </span>
              Lexus
            </button>

            <button
              className={`
                flex items-center gap-2.5 px-5 py-2 rounded-lg border
                text-sm font-semibold whitespace-nowrap
                transition-colors duration-200
                ${
                  merek === "BMW"
                    ? "bg-[#8f1117] border-[#8f1117] text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }
              `}
              onClick={() => handleFilterClick({ merek: "BMW" })}
            >
              <span className="relative w-7 h-7 flex-shrink-0">
                <img
                  src={bmwLogo}
                  alt="BMW"
                  className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-10 h-10 object-contain
                  "
                />
              </span>
              BMW
            </button>

            <button
              className={`
                px-7 py-2 rounded-lg border text-sm font-semibold
                flex items-center gap-1 relative
                transition-colors duration-200
                ${
                  merek &&
                  !["Toyota", "Honda", "Mazda", "MG", "Lexus", "BMW"].includes(merek)
                    ? "bg-[#8f1117] border-[#8f1117] text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }
              `}
              onClick={() => setDropdownTerbuka(!dropdownTerbuka)}
            >
              Lainnya
              <FaChevronDown className="text-xs" />
            </button>
          </div>

          {dropdownTerbuka && (
            <div
              className="
                absolute
                top-12
                right-0
                w-[320px]
                max-w-[calc(100vw-24px)]
                bg-white
                border border-gray-200
                rounded-2xl
                shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                p-4
                z-50
                overflow-hidden
              "
            >
              <div className="mb-4 px-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-[2px] w-6 bg-[#b88a44] rounded-full"></span>

                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#b88a44] uppercase">
                    Pilih Merek Mobil
                  </span>
                </div>

                <h3
                  className="text-xl font-semibold text-[#5f0a0d]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Temukan mobil impian Anda
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Pilih merek favorit Anda dari daftar berikut
                </p>
              </div>

              <div className="max-h-[430px] overflow-y-auto pr-1 space-y-1.5">
                {daftarMerek
                  .filter(
                    (item) =>
                      ![
                        "Toyota",
                        "Honda",
                        "Mazda",
                        "MG",
                        "Lexus",
                        "BMW",
                      ].includes(item.nama)
                  )
                  .map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleFilterClick({ merek: item.nama });
                      setDropdownTerbuka(false);
                    }}
                    className={`
                      group
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-left
                      transition-all
                      duration-200
                      border
                      ${
                        merek === item.nama
                          ? `
                            bg-[#5f0a0d]
                            border-[#5f0a0d]
                            text-white
                            shadow-sm
                          `
                          : `
                            bg-white
                            border-gray-100
                            text-gray-700
                            hover:bg-[#fff7f5]
                            hover:border-[#a5161d]/20
                            hover:text-[#7d1015]
                          `
                      }
                    `}
                  >
                    <div
                      className={`
                        w-9
                        h-9
                        shrink-0
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        bg-white
                        border
                        overflow-hidden
                        ${
                          merek === item.nama
                            ? "border-white/30"
                            : "border-gray-100"
                        }
                      `}
                    >
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.nama}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span
                          className={`
                            text-[10px]
                            font-bold
                            ${
                              merek === item.nama
                                ? "text-[#5f0a0d]"
                                : "text-gray-400"
                            }
                          `}
                        >
                          {item.nama.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span
                      className={`
                        flex-1
                        text-sm
                        ${
                          merek === item.nama
                            ? "font-semibold"
                            : "font-medium"
                        }
                      `}
                    >
                      {item.nama}
                    </span>

                    {merek === item.nama && (
                      <span className="text-xs font-semibold text-[#f3d28a]">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}


        </div>
      </div>

      <section
        className="
          relative
          w-full
          overflow-hidden
          mt-3
          min-h-[230px]
          sm:min-h-[260px]
          md:min-h-[280px]
          lg:min-h-[320px]
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
            bg-no-repeat
            scale-125
          "
          style={{
            backgroundImage: `url(${catalogHero})`,
          }}
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/70
            via-black/35
            to-transparent
            pointer-events-none
          "
        />

        <div
          className="
            relative
            z-10
            flex
            items-center
            min-h-[230px]
            sm:min-h-[260px]
            md:min-h-[280px]
            lg:min-h-[320px]
            px-5
            sm:px-8
            md:px-12
          "
        >
          <div className="w-full max-w-2xl text-left">
            <p
              className="
                text-[#D9A85C]
                text-[8px]
                sm:text-[10px]
                uppercase
                tracking-[0.32em]
                sm:tracking-[0.4em]
                mb-2
                sm:mb-3
              "
            >
              MOBILKU PREMIUM AUTO
            </p>

            <h1
              className="
                text-white
                text-[22px]
                sm:text-[38px]
                md:text-5xl
                lg:text-6xl
                leading-[1.05]
                uppercase
              "
              style={{
                fontFamily: "'Playfair Display', serif",
                textShadow:
                  "0 4px 20px rgba(0,0,0,0.5)",
                letterSpacing: "0.02em",
              }}
            >
              CATALOG MOBIL
            </h1>

            <p
              className="
                text-[#f3d9b1]
                text-[11px]
                sm:text-sm
                md:text-base
                mt-3
                sm:mt-4
                max-w-md
                leading-relaxed
              "
            >
              Temukan mobil impian Anda dengan standar
              kualitas terbaik dari MobilKu.
            </p>
          </div>
        </div>
      </section>

      <div
        className="
          bg-white
          px-3
          pt-4
          pb-2
        "
      >
        <div className="max-w-4xl mx-auto flex justify-center">
          <div
            className="
              relative
              flex
              items-center
              bg-gray-100
              border
              border-gray-200
              rounded-full
              p-1
              shadow-sm
              max-w-md
              w-full
            "
          >
            <div
              className={`
                absolute
                top-1
                bottom-1
                w-[calc(50%-4px)]
                rounded-full
                bg-gradient-to-r
                from-[#7A000E]
                to-[#A80D22]
                transition-all
                duration-300
                ease-out
                shadow-md

                ${
                  activeTab === null
                    ? "opacity-0"
                    : activeTab === "harga"
                    ? "left-[calc(50%+2px)] opacity-100"
                    : "left-1 opacity-100"
                }
              `}
            />

            <button
              type="button"
              onClick={() =>
                handleTabClick("promo")
              }
              className={`
                relative
                z-10
                flex
                flex-1
                items-center
                justify-center
                gap-2
                py-2.5
                px-4
                min-h-[52px]
                rounded-full
                text-xs
                sm:text-sm
                font-semibold
                transition-all
                duration-200
                active:scale-95

                ${
                  activeTab === "promo"
                    ? "text-white"
                    : activeTab === null
                    ? "bg-white shadow-sm border border-gray-200 text-gray-700"
                    : "text-gray-500 hover:text-gray-800"
                }
              `}
            >
              <span>Promo Eksklusif</span>

              <span
                className={`
                  text-[9px]
                  font-extrabold
                  px-2
                  py-0.5
                  rounded-full
                  transition-all
                  duration-200

                  ${
                    activeTab === "promo"
                      ? "bg-white/20 text-white backdrop-blur-sm border border-white/20"
                      : "bg-red-100 text-[#8f1117]"
                  }
                `}
              >
                HOT
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleTabClick("harga")
              }
              className={`
                relative
                z-10
                flex
                flex-1
                items-center
                justify-center
                gap-2
                py-2.5
                px-4
                min-h-[52px]
                rounded-full
                text-xs
                sm:text-sm
                font-semibold
                transition-all
                duration-200
                active:scale-95

                ${
                  activeTab === "harga"
                    ? "text-white"
                    : activeTab === null
                    ? "bg-white shadow-sm border border-gray-200 text-gray-700"
                    : "text-gray-500 hover:text-gray-800"
                }
              `}
            >
              <FaSortAmountDown
                className={`
                  text-xs
                  transition-colors
                  duration-200

                  ${
                    activeTab === "harga"
                      ? "text-white"
                      : "text-gray-500"
                  }
                `}
              />

              <span>Harga Termurah</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "promo" && (
        <div className="max-w-4xl mx-auto px-3 sm:px-4 mt-4">
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              min-h-[120px]
              sm:min-h-[135px]
              md:min-h-[145px]
              bg-gradient-to-r
              from-[#5b050b]
              via-[#8f1117]
              to-[#65070d]
              border
              border-[#D9A85C]/30
              shadow-[0_10px_35px_-15px_rgba(95,0,8,0.65)]
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_78%_50%,rgba(217,168,92,0.18),transparent_38%)]
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                right-0
                top-0
                h-full
                w-[42%]
                bg-cover
                bg-center
                bg-no-repeat
              "
              style={{
                backgroundImage: `
                  linear-gradient(
                    to right,
                    #65070d 0%,
                    rgba(101,7,13,0.72) 18%,
                    rgba(101,7,13,0.25) 55%,
                    rgba(101,7,13,0.05) 100%
                  ),
                  url(${red})
                `,
              }}
            />

            <div
              className="
                absolute
                right-0
                top-0
                h-full
                w-[42%]
                bg-gradient-to-l
                from-black/10
                to-transparent
                pointer-events-none
              "
            />

            <div
              className="
                relative
                z-10
                flex
                min-h-[120px]
                sm:min-h-[135px]
                md:min-h-[145px]
                items-center
              "
            >
              <div
                className="
                  w-[72%]
                  sm:w-[68%]
                  px-4
                  py-4
                  sm:px-6
                  sm:py-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    sm:gap-2
                    mb-1.5
                  "
                >
                  <FaGift
                    className="
                      text-[#D9A85C]
                      text-[11px]
                      sm:text-sm
                    "
                  />

                  <span
                    className="
                      text-[#D9A85C]
                      text-[8px]
                      sm:text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.22em]
                      sm:tracking-[0.28em]
                    "
                  >
                    Promo Eksklusif
                  </span>
                </div>

                <h3
                  className="
                    text-white
                    text-[18px]
                    sm:text-[23px]
                    md:text-[25px]
                    font-semibold
                    leading-[1.05]
                    tracking-tight
                  "
                  style={{
                    fontFamily:
                      "'Playfair Display', serif",
                    textShadow:
                      "0 2px 10px rgba(0,0,0,0.25)",
                  }}
                >
                  Penawaran Spesial
                </h3>

                <p
                  className="
                    text-white/90
                    text-[9px]
                    sm:text-xs
                    md:text-sm
                    mt-1
                  "
                >
                  Untuk Mobil Pilihan MobilKu
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2.5
                    sm:gap-x-3
                    gap-y-1
                    mt-3
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <FaShieldAlt
                      className="
                        text-[#D9A85C]
                        text-[8px]
                        sm:text-[9px]
                      "
                    />

                    <span
                      className="
                        text-white/90
                        text-[7px]
                        sm:text-[9px]
                        whitespace-nowrap
                      "
                    >
                      Harga Terbaik
                    </span>
                  </div>

                  <span
                    className="
                      hidden
                      sm:block
                      text-[#D9A85C]/50
                      text-[10px]
                    "
                  >
                    |
                  </span>

                  <div className="flex items-center gap-1.5">
                    <FaStar
                      className="
                        text-[#D9A85C]
                        text-[8px]
                        sm:text-[9px]
                      "
                    />

                    <span
                      className="
                        text-white/90
                        text-[7px]
                        sm:text-[9px]
                        whitespace-nowrap
                      "
                    >
                      Stok Terbatas
                    </span>
                  </div>

                  <span
                    className="
                      hidden
                      sm:block
                      text-[#D9A85C]/50
                      text-[10px]
                    "
                  >
                    |
                  </span>

                  <div className="flex items-center gap-1.5">
                    <FaBolt
                      className="
                        text-[#D9A85C]
                        text-[8px]
                        sm:text-[9px]
                      "
                    />

                    <span
                      className="
                        text-white/90
                        text-[7px]
                        sm:text-[9px]
                        whitespace-nowrap
                      "
                    >
                      Proses Cepat
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="
                  absolute
                  right-3
                  top-3
                  sm:right-4
                  sm:top-4
                  z-20
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-[#D9A85C]
                  px-2.5
                  py-1
                  sm:px-3
                  sm:py-1.5
                  shadow-[0_4px_12px_rgba(0,0,0,0.25)]
                "
              >
                <FaBolt
                  className="
                    text-[#5f0008]
                    text-[7px]
                    sm:text-[8px]
                  "
                />

                <span
                  className="
                    text-[#5f0008]
                    text-[7px]
                    sm:text-[9px]
                    font-extrabold
                    tracking-wide
                  "
                >
                  TERBATAS
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "harga" && (
        <div className="max-w-4xl mx-auto px-3 sm:px-4 mt-4">
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              min-h-[120px]
              sm:min-h-[135px]
              md:min-h-[145px]
              bg-gradient-to-r
              from-[#4d050a]
              via-[#7e0c14]
              to-[#57070c]
              border
              border-[#D9A85C]/30
              shadow-[0_10px_35px_-15px_rgba(95,0,8,0.65)]
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_80%_50%,rgba(217,168,92,0.20),transparent_38%)]
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                right-0
                top-0
                h-full
                w-[42%]
                bg-cover
                bg-center
                bg-no-repeat
              "
              style={{
                backgroundImage: `
                  linear-gradient(
                    to right,
                    #57070c 0%,
                    rgba(87,7,12,0.74) 18%,
                    rgba(87,7,12,0.25) 55%,
                    rgba(87,7,12,0.05) 100%
                  ),
                  url(${whitecars})
                `,
              }}
            />

            <div
              className="
                absolute
                right-0
                top-0
                h-full
                w-[42%]
                bg-gradient-to-l
                from-black/10
                to-transparent
                pointer-events-none
              "
            />

            <div
              className="
                relative
                z-10
                flex
                min-h-[120px]
                sm:min-h-[135px]
                md:min-h-[145px]
                items-center
              "
            >
              <div
                className="
                  w-[72%]
                  sm:w-[68%]
                  px-4
                  py-4
                  sm:px-6
                  sm:py-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    sm:gap-2
                    mb-1.5
                  "
                >
                  <FaSortAmountDown
                    className="
                      text-[#D9A85C]
                      text-[11px]
                      sm:text-sm
                    "
                  />

                  <span
                    className="
                      text-[#D9A85C]
                      text-[8px]
                      sm:text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.22em]
                      sm:tracking-[0.28em]
                    "
                  >
                    Pilihan Harga
                  </span>
                </div>

                <h3
                  className="
                    text-white
                    text-[18px]
                    sm:text-[23px]
                    md:text-[25px]
                    font-semibold
                    leading-[1.05]
                    tracking-tight
                  "
                  style={{
                    fontFamily:
                      "'Playfair Display', serif",
                    textShadow:
                      "0 2px 10px rgba(0,0,0,0.25)",
                  }}
                >
                  Harga Terbaik Untuk Anda
                </h3>

                <p
                  className="
                    text-white/90
                    text-[9px]
                    sm:text-xs
                    md:text-sm
                    mt-1
                  "
                >
                  Temukan mobil mulai dari harga paling terjangkau
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2.5
                    sm:gap-x-3
                    gap-y-1
                    mt-3
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <FaTags
                      className="
                        text-[#D9A85C]
                        text-[8px]
                        sm:text-[9px]
                      "
                    />

                    <span
                      className="
                        text-white/90
                        text-[7px]
                        sm:text-[9px]
                        whitespace-nowrap
                      "
                    >
                      Harga Transparan
                    </span>
                  </div>

                  <span
                    className="
                      hidden
                      sm:block
                      text-[#D9A85C]/50
                      text-[10px]
                    "
                  >
                    |
                  </span>

                  <div className="flex items-center gap-1.5">
                    <FaCar
                      className="
                        text-[#D9A85C]
                        text-[8px]
                        sm:text-[9px]
                      "
                    />

                    <span
                      className="
                        text-white/90
                        text-[7px]
                        sm:text-[9px]
                        whitespace-nowrap
                      "
                    >
                      Banyak Pilihan
                    </span>
                  </div>

                  <span
                    className="
                      hidden
                      sm:block
                      text-[#D9A85C]/50
                      text-[10px]
                    "
                  >
                    |
                  </span>

                  <div className="flex items-center gap-1.5">
                    <FaShieldAlt
                      className="
                        text-[#D9A85C]
                        text-[8px]
                        sm:text-[9px]
                      "
                    />

                    <span
                      className="
                        text-white/90
                        text-[7px]
                        sm:text-[9px]
                        whitespace-nowrap
                      "
                    >
                      Kualitas Terjaga
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="
                  absolute
                  right-3
                  top-3
                  sm:right-4
                  sm:top-4
                  z-20
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-[#D9A85C]
                  px-2.5
                  py-1
                  sm:px-3
                  sm:py-1.5
                  shadow-[0_4px_12px_rgba(0,0,0,0.25)]
                "
              >
                <FaTags
                  className="
                    text-[#5f0008]
                    text-[7px]
                    sm:text-[8px]
                  "
                />

                <span
                  className="
                    text-[#5f0008]
                    text-[7px]
                    sm:text-[9px]
                    font-extrabold
                    tracking-wide
                  "
                >
                  TERMURAH
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="
          max-w-4xl
          mx-auto
          px-3
          sm:px-4
          mt-4
          overflow-visible
        "
      >
        {mobilTerfilter.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-16
              text-center
            "
          >
            <FaCar className="text-5xl text-gray-300 mb-4" />

            <p className="text-lg font-bold text-gray-700">
              {activeTab === "promo"
                ? "Belum ada mobil promo saat ini"
                : activeTab === "harga"
                ? "Belum ada mobil untuk ditampilkan"
                : kategori
                ? `Belum ada mobil kategori ${
                    namaKategoriTerpilih || "ini"
                  } saat ini`
                : merek
                ? `Belum ada mobil merek ${merek} saat ini`
                : search
                ? `Mobil "${search}" tidak ditemukan`
                : "Belum ada mobil yang tersedia"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Coba pilih kategori atau merek lain, atau cek
              kembali nanti ya.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              sm:gap-6
              px-3
              sm:px-4
              pt-1
              pb-3
              sm:pb-4
              overflow-visible
            "
          >
            {mobilHalamanIni.map((mobil, index) => (
              <MobilCard
                key={index}
                image={mobil.images?.[0]}
                nama={mobil.nama}
                merek={mobil.merek}
                tahun={mobil.tahun}
                harga={mobil.harga}
                transmisi={mobil.transmisi}
                bahanBakar={mobil.bahanBakar}
                id={mobil.id}
                isPromo={mobil.isPromo}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="w-full flex justify-center mt-10 mb-10 px-3">
          <div className="flex items-center justify-center gap-2 sm:gap-5">
            <button
              type="button"
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage === 1}
              className={`
                flex items-center justify-center
                gap-1 sm:gap-3
                w-9 sm:w-[220px] md:w-[250px]
                h-9 sm:h-16
                rounded-full
                border-2
                text-sm sm:text-base md:text-lg
                font-semibold
                transition-all duration-300
                ${
                  currentPage === 1
                    ? `
                      border-gray-200
                      text-gray-300
                      bg-white
                      cursor-not-allowed
                    `
                    : `
                      border-[#d8a84e]
                      bg-white
                      text-[#6b0f12]
                      hover:bg-[#6b0f12]
                      hover:text-white
                      hover:border-[#6b0f12]
                      shadow-[0_8px_20px_-12px_rgba(95,10,13,0.45)]
                    `
                }
              `}
            >
              <span className="text-2xl sm:text-4xl font-light leading-none">
                ‹
              </span>

              <span className="hidden sm:inline">
                Sebelumnya
              </span>
            </button>

            <div className="flex items-center gap-1 sm:gap-4">
              {nomorHalaman.map((nomor) => (
                <button
                  type="button"
                  key={nomor}
                  onClick={() => {
                    setCurrentPage(nomor);
                  }}
                  aria-label={`Halaman ${nomor}`}
                  aria-current={
                    currentPage === nomor ? "page" : undefined
                  }
                  className={`
                    relative
                    w-9 h-9
                    sm:w-16 sm:h-16
                    rounded-xl sm:rounded-2xl
                    flex items-center justify-center
                    text-sm sm:text-lg md:text-xl
                    font-bold
                    transition-all duration-300
                    ${
                      currentPage === nomor
                        ? `
                          bg-gradient-to-br
                          from-[#6b0f12]
                          via-[#8f1117]
                          to-[#b51c25]
                          text-white
                          border-2 border-[#d8a84e]
                          shadow-[0_10px_25px_-10px_rgba(95,10,13,0.75)]
                          scale-105
                        `
                        : `
                          bg-white
                          text-gray-600
                          border-2 border-gray-200
                          hover:border-[#d8a84e]
                          hover:text-[#6b0f12]
                          hover:bg-[#fffaf5]
                          shadow-sm
                        `
                    }
                  `}
                >
                  {nomor}

                  {currentPage === nomor && (
                    <span
                      className="
                        absolute
                        -bottom-[6px]
                        left-1/2
                        -translate-x-1/2
                        w-7 sm:w-10
                        h-[3px] sm:h-[4px]
                        rounded-full
                        bg-[#d8a84e]
                      "
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages}
              className={`
                flex items-center justify-center
                gap-1 sm:gap-3
                w-9 sm:w-[220px] md:w-[250px]
                h-9 sm:h-16
                rounded-full
                border-2
                text-sm sm:text-base md:text-lg
                font-semibold
                transition-all duration-300
                ${
                  currentPage === totalPages
                    ? `
                      border-gray-200
                      text-gray-300
                      bg-white
                      cursor-not-allowed
                    `
                    : `
                      border-[#d8a84e]
                      bg-white
                      text-[#6b0f12]
                      hover:bg-[#6b0f12]
                      hover:text-white
                      hover:border-[#6b0f12]
                      shadow-[0_8px_20px_-12px_rgba(95,10,13,0.45)]
                    `
                }
              `}
            >
              <span className="hidden sm:inline">
                Selanjutnya
              </span>

              <span className="text-2xl sm:text-4xl font-light leading-none">
                ›
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Judul Section - Kenapa Pilih MobilKu */}
      <div className="max-w-4xl mx-auto px-3 pt-4 text-center">
        <p className="text-[#8B1A1A] text-[13px] md:text-[16px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] mb-2 md:mb-3">
          — Keunggulan Kami —
        </p>

        <h2 className="text-xl md:text-3xl font-serif font-medium text-gray-900 leading-snug">
          Kenapa Pilih{" "}
          <span className="text-[#C9A227] font-medium">Mobilku?</span>
        </h2>
      </div>

      {/* Desktop View - desain disamakan dengan halaman Home */}
      <div className="hidden md:block max-w-4xl mx-auto pt-6 pb-6 px-3 space-y-7">
        {dataFeature.map((fitur, index) => (
          <div
            key={index}
            className="relative rounded-3xl overflow-hidden shadow-[0_20px_40px_-18px_rgba(24,3,5,.35)] h-[34rem]"
          >
            <img
              src={fitur.image}
              alt={fitur.judul}
              className="w-full h-full object-cover object-[50%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140405] from-0% via-[#140405]/30 via-30% to-transparent to-65%" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 flex items-end justify-between gap-8">
              <div>
                <h3 className="font-serif italic font-semibold text-3xl text-white mb-3">
                  {fitur.judul}
                </h3>
                <p className="text-white/70 text-base max-w-lg leading-relaxed">
                  {fitur.deskripsi}
                </p>
              </div>

              <button className="group hidden md:flex items-center gap-2 shrink-0 text-[#D9A85C] text-sm font-semibold uppercase tracking-wider border-b border-[#D9A85C]/40 pb-1 hover:border-[#D9A85C] transition-colors duration-300">
                Selengkapnya
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - tetap seperti sebelumnya */}
      <div
        className="
          grid
          grid-cols-1
          md:hidden
          gap-4
          max-w-4xl
          mx-auto
          py-6
          px-3
        "
      >
        {dataFeature.map((fitur, index) => (
          <FeatureCard
            key={index}
            image={fitur.image}
            Icon={fitur.Icon}
            judul={fitur.judul}
            deskripsi={fitur.deskripsi}
          />
        ))}
      </div>

      <div className="text-center py-6">
        <div className="w-10 h-1 bg-red-700 mx-auto mb-3" />
        <h2 className="text-2xl font-bold">FAQ</h2>
      </div>

      <div className="max-w-4xl mx-auto py-6 px-3">
        {dataFaq.map((faq, index) => (
          <FaqItem
            key={index}
            pertanyaan={faq.pertanyaan}
            jawaban={faq.jawaban}
          />
        ))}
      </div>

      <div className="text-center py-6">
        <div className="w-10 h-1 bg-red-700 mx-auto mb-3" />

        <h2 className="text-xl font-bold">
          FAQ lainnya
        </h2>
      </div>

      <Footer />

      {isFiltering && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-[9999]
          "
        >
          <span
            className="
              loading
              loading-spinner
              loading-lg
              text-white
            "
          ></span>
        </div>
      )}
    </>
  );
}

export default Katalog;
