import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import {
  FaCar,
  FaClock,
  FaSearch,
  FaClipboardList,
  FaWhatsapp,
  FaChartBar,
  FaBars,
  FaQrcode,
  FaGlobe,
} from "react-icons/fa";

const fiturList = [
  {
    title: "Cari di Katalog",
    desc: "Telusuri semua mobil yang tersedia dalam satu halaman.",
    Icon: FaSearch,
  },
  {
    title: "Spesifikasi Lengkap",
    desc: "Tahun, kilometer, transmisi, hingga kondisi mesin.",
    Icon: FaClipboardList,
  },
  {
    title: "Chat Langsung",
    desc: "Tanya-tanya dan nego ke penjual via WhatsApp.",
    Icon: FaWhatsapp,
  },
  {
    title: "Rekomendasi Serupa",
    desc: "Temukan mobil unggulan lain yang mungkin kamu suka.",
    Icon: FaChartBar,
  },
];

function PromoBanner() {
  const [contohMobil, setContohMobil] = useState([]);

  useEffect(() => {
    axios
      .get("/api/mobil")
      .then((response) => {
        const semuaMobil = response.data.mobil || [];
        setContohMobil(semuaMobil.slice(0, 2));
      })
      .catch(() => {
        setContohMobil([]);
      });
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#8f1117]/8 to-white">
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[52%] bg-gradient-to-br from-[#250104] to-[#50070d] [clip-path:polygon(28%_0,100%_0,100%_100%,0%_100%)]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 py-12 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2.5 mb-6">
            <FaCar className="w-8 h-8 text-[#8f1117]" />
            <div>
             <p className="text-[#8f1117] font-extrabold text-lg leading-tight">
                MobilKu
              </p>
              <p className="text-gray-500 text-[11px] font-semibold">
                Jual Beli Mobil Bekas Terpercaya
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 bg-[#8f1117]/8 text-[#8f1117] text-xs font-extrabold px-3.5 py-1.5 rounded-full mb-5">
            <FaClock className="w-3 h-3" />
            Buka MobilKu Langsung dari HP
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 text-gray-900">
            Cari Mobil Impian
            <br />
           <span className="text-[#8f1117]">Lebih Mudah!</span>
          </h1>

          <p className="text-gray-500 text-[14.5px] leading-relaxed mb-7">
            Jelajahi katalog mobil bekas berkualitas, lihat spesifikasi lengkap,
            dan hubungi penjual langsung lewat WhatsApp — semua dari browser HP
            kamu, tanpa perlu install apapun.
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5 mb-8">
            {fiturList.map((fitur) => (
              <div key={fitur.title}>
                <div className="w-10 h-10 rounded-xl bg-[#8f1117] text-white flex items-center justify-center mb-2">
                  <fitur.Icon className="w-5 h-5" />
                </div>
                <p className="text-[13.5px] font-extrabold text-gray-900">
                  {fitur.title}
                </p>
                <p className="text-[11.5px] text-gray-500 leading-relaxed">
                  {fitur.desc}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/katalog"
            className="inline-block bg-[#8f1117] hover:bg-[#5f0a0d] text-white font-extrabold text-sm px-7 py-3 rounded-xl shadow-lg shadow-[#8f1117]/25 transition"
          >
            Buka Katalog Mobil
          </Link>
        </div>

        <div className="flex-shrink-0 mt-20 lg:mt-0 lg:ml-70">
          <div className="relative w-[200px] h-[420px] animate-bounce">
            <div className="absolute inset-0 bg-gray-900 rounded-[2.5rem] shadow-2xl"></div>
            <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10"></div>
            <div className="absolute inset-[6px] bg-white rounded-[2rem] overflow-hidden flex flex-col">
              <div className="bg-[#8f1117] text-white px-3.5 pt-6 pb-2 flex items-center justify-between">
                <span className="text-xs font-extrabold">MobilKu</span>
                <FaBars className="w-3.5 h-3.5" />
              </div>
              <div className="mx-3 mt-2.5 bg-gray-100 rounded-lg px-2.5 py-2 flex items-center gap-1.5 text-[10px] text-gray-400">
                <FaSearch className="w-3 h-3" />
                Cari mobil...
              </div>
              <div className="px-3 mt-2.5 flex flex-col gap-2.5">
                {contohMobil.map((mobil) => (
                  <div
                    key={mobil.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="h-16 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {mobil.images && mobil.images[0] ? (
                        <img
                          src={mobil.images[0]}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaCar className="w-7 h-7 text-gray-400 opacity-40" />
                      )}
                    </div>
                    <div className="px-2.5 py-2">
                      <p className="text-[11px] font-bold text-gray-900">
                        {mobil.nama}
                      </p>
                     <p className="text-[11.5px] font-extrabold text-[#8f1117] mt-0.5">
                        Rp {Number(mobil.harga).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto mx-3 mb-3.5 bg-green-600 text-white text-[11px] font-extrabold rounded-lg py-2.5 flex items-center justify-center gap-1.5">
                <FaWhatsapp className="w-3.5 h-3.5" />
                Chat via WhatsApp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromoBanner;
