import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import TabsMobil from "../components/TabsMobil.jsx";


import {
  PiCalendarBold,
  PiRoadHorizonBold,
  PiGearBold,
  PiGasPumpBold,
  PiEngineBold,
  PiPaletteBold,
} from "react-icons/pi";
import SearchBox from "../components/SearchBox.jsx";
import useSettings from "../hooks/useSettings.js";


function DetailMobil() {
  const { id } = useParams();
  const [mobil, setMobil] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setselectedImage] = useState(0);
  const [isFavorit, setIsFavorit] = useState(false);
  const [mobilLain, setMobilLain] = useState([]);
  const { nomorWa: Nomor_whatsap } = useSettings();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/api/mobil/${id}`)
      .then((response) => {
        setMobil(response.data.mobil);
        setselectedImage(0);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`/api/mobil`)
      .then((response) => {
        const semuaMobil = response.data.mobil || [];
        const rekomendasi = semuaMobil
          .filter((item) => String(item.id) !== id)
          .slice(0, 4);
        setMobilLain(rekomendasi);
      })
      .catch(() => {
        setMobilLain([]);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <span className="loading-spinner loading-lg text-red-700"></span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!mobil) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto px-3 py-20 text-center">
          <p className="text-lg font-semibold text-gray-700">
            Mobil yang kamu cari tidak ditemukan
          </p>
          <Link
            to="/katalog"
            className="btn bg-red-700 text-white hover:bg-red-800 mt-4 transition"
          >
            Kembali ke katalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  const images = mobil.images && mobil.images.length > 0 ? mobil.images : [];
  const gambarUtama = images[selectedImage] || null;

  const pesanBeli = encodeURIComponent(
    `Halo saya mau beli mobil ${mobil.nama} (${mobil.tahun}) seharga Rp ${Number(
      mobil.harga,
    ).toLocaleString("id-ID")} Boleh tanya-tanya dulu`,
  );
  const pesanTanya = encodeURIComponent(
    `Halo, saya tertarik dengan ${mobil.nama} (${mobil.tahun}) yang harganya Rp ${Number(
      mobil.harga,
    ).toLocaleString("id-ID")}, Boleh tanya-tanya dulu`,
  );
  const fotoSebelumnya = () => {
    setselectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const fotoBerikutnya = () => {
    setselectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const cekLoginSebelumAksi = (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault();
      if (
        window.confirm(
          "Silakan daftar atau login terlebih dahulu untuk melanjutkan.",
        )
      ) {
        document.getElementById("my_modal_2").showModal();
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-3 py-8">
        {/* Breadcumb */}
        <div className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-red-700 transition">
            Beranda
          </Link>
          <span>/</span>
          <Link to="/katalog" className="hover:text-red-700 transition">
            Katalog
          </Link>
          <span>/</span>
          <span>{mobil.merek}</span>
          <span>/</span>
          <span className="text-gray-700 font-semibold">{mobil.nama}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-6">
          {/* kiri: Galeri Foto */}
          <div className="relative self-start">
            <div className="absolute inset-[3%_-3%_-3%_3%] bg-gradient-to-br from-red-600 to-red-900 rounded-2xl hidden md:block"></div>
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative">
                <span className="absolute top-4 left-4 bg-white text-red-700 text-xs  font-extrabold px-3.5 py-1.5 rounded-full shadow z-10">
                  {mobil.merek?.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFavorit(!isFavorit)}
                  className="absolute top-4 right-4 bg-white/95 text-red-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow z-10 flex items-center gap-1.5"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={isFavorit ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.2 1.6 6.6 4.6 5c2.2-1.2 4.7-.5 6 1.2C11.9 4.5 14.4 3.8 16.6 5c3 1.6 3.6 5.2 1.9 7.9C18.7 16.65 12 21 12 21z" />
                  </svg>
                  Favorit
                </button>

                {gambarUtama ? (
                  <img
                    src={gambarUtama}
                    alt={mobil.nama}
                    className="w-full aspect-[4/3] object-cover block"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    Belum ada foto
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={fotoSebelumnya}
                      className="absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-700 text-lg"
                    >
                      &#8249;
                    </button>
                    <button
                      type="button"
                      onClick={fotoBerikutnya}
                      className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-700 text-lg"
                    >
                      &#8250;
                    </button>
                    <span className="absolute bottom-3 right-3 bg-gray-900/70 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-full">
                      {selectedImage + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2.5">
                  {images.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setselectedImage(index)}
                      className={`rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-red-700"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${mobil.nama} foto ${index + 1}`}
                        className="w-full h-[58px] object-cover block"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* kanan: info */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <p className="text-red-700 text-xs font-extrabold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-red-700 inline-block"></span>
              {mobil.category?.name}
            </p>
            <h1 className="text-xl font-extrabold text-gray-900 mb-3.5 leading-snug">
              {mobil.nama}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">

<span className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-red-700">
  ✓ Dokumen Lengkap
</span>
<span className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-red-700">
  ✓ Siap Pakai
</span>
<span className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-red-700">
  ✓ Bebas Banjir
</span>


            </div>
            <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl px-4 py-3.5 mb-4">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">
                Harga
              </p>
              <p className="text-2xl font-extrabold text-red-700">
                Rp {Number(mobil.harga).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-y-3.5 gap-x-2 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                  <PiCalendarBold size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">
                    Tahun
                  </p>
                  <p className="text-xs font-extrabold text-gray-900">
                    {mobil.tahun}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                  <PiRoadHorizonBold size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">
                    Kilometer
                  </p>
                  <p className="text-xs font-extrabold text-gray-900">
                    {mobil.kilometer
                      ? `${Number(mobil.kilometer).toLocaleString("id-ID")} KM`
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                  <PiGearBold size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">
                    {" "}
                    Transmisi
                  </p>
                  <p className="text-xs font-extrabold text-gray-900">
                    {mobil.transmisi || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                  <PiGasPumpBold size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">
                    Bahan Bakar
                  </p>
                  <p className="text-xs font-extrabold text-gray-900">
                    {mobil.bahanBakar || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                  <PiEngineBold size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">
                    Kapasitas Mesin
                  </p>
                  <p className="text-xs font-extrabold text-gray-900">
                    {mobil.kapasitasMesin ? `${mobil.kapasitasMesin} cc` : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                  <PiPaletteBold size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">
                    Warna
                  </p>
                  <p className="text-xs font-extrabold text-gray-900">
                    {mobil.warna || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-auto">
              <a
                href={`https://wa.me/${Nomor_whatsap}?text=${pesanTanya}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={cekLoginSebelumAksi}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 border border-green-600 text-green-700 font-bold text-sm rounded-xl py-2.5"
              >
                <span className="flex items-center gap-1.5">Chat WhatsApp</span>
                <span className="text-[10px] font-semibold opacity-75">
                  Tanya langsung ke penjual
                </span>
              </a>
              <a
                href={`https://wa.me/${Nomor_whatsap}?text=${pesanBeli}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={cekLoginSebelumAksi}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-[#8f1117] hover:bg-[#5f0a0d] text-white font-bold text-sm rounded-xl py-2.5 transition"
              >
                <span>Beli Sekarang</span>
                <span className="text-[10px] font-semibold opacity-80">
                  Proses cepat &amp; aman
                </span>
              </a>
            </div>
          </div>
        </div>
        <TabsMobil mobil={mobil} />
        {/* info, spesifikasi dan deskripsi */}
        {mobilLain.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-3 h-0.5 bg-red-700 inline-block"></span>
              <p className="text-red-700 text-xs font-extrabold uppercase tracking-wide">
                Etalase Mobil
              </p>
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">
              Rekomendasi Mobil Unggulan Terbaik
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mobilLain.map((item) => (
                <Link
                  key={item.id}
                  to={`/mobil/${item.id}`}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.nama}
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Belum ada foto
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-white text-red-700 text-[10px] font-extrabold px-2 py-1 rounded-full shadow">
                      {item.merek?.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {item.nama}
                    </p>
                    <p className="text-[10.5px] text-gray-400 font-semibold mt-0.5">
                      {item.tahun} &middot;{" "}
                      {item.kilometer
                        ? `${Number(item.kilometer).toLocaleString("id-ID")} KM`
                        : "-"}
                    </p>
                    <p className="text-sm font-extrabold text-red-700 mt-1.5">
                      Rp {Number(item.harga).toLocaleString("id-ID")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                to="/katalog"
                className="inline-flex items-center gap-1.5 text-red-700 text-sm font-extrabold hover:text-red-800 transition-colors duration-300"
              >
                Lihat Mobil Selengkapnya
                <span className="text-base">→</span>
              </Link>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default DetailMobil;
