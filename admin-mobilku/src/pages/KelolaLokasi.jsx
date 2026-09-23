import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

const KelolaLokasi = () => {
  const [alamat, setAlamat] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [jamOperasional, setJamOperasional] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/settings")
      .then((response) => {
        const settings = response.data.settings;
        if (settings) {
          setAlamat(settings.alamat || "");
          setMapEmbedUrl(settings.mapEmbedUrl || "");
          setJamOperasional(settings.jamOperasional || "");
          setWhatsapp(settings.whatsapp || "");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const handleSimpan = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    axios
      .put(
        "/api/settings",
        { alamat, mapEmbedUrl, jamOperasional, whatsapp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        alert(response.data.message);
        setIsSubmitting(false);
      })
      .catch((error) => {
        alert(error.response.data.message);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="w-full">
      {isSubmitting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">Pengaturan Lokasi</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Info ini akan tampil di section lokasi showroom pada halaman utama
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <form onSubmit={handleSimpan} className="max-w-xl bg-white rounded-2xl shadow-sm p-5">
          <label className="block mt-1">Nama Lokasi / Alamat</label>
          <input
            type="text"
            placeholder="Jl. Raya Contoh No. 88, Palembang"
            className="input input-bordered w-full mt-2 text-gray-700"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
          />

          <label className="block mt-4">Link Embed Google Maps</label>
          <input
            type="text"
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="input input-bordered w-full mt-2 text-gray-700"
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            Ambil dari Google Maps &gt; Share &gt; Embed a map
          </p>

          <label className="block mt-4">Jam Operasional</label>
          <input
            type="text"
            placeholder="Senin - Sabtu, 09.00 - 18.00 WIB"
            className="input input-bordered w-full mt-2 text-gray-700"
            value={jamOperasional}
            onChange={(e) => setJamOperasional(e.target.value)}
          />

          <label className="block mt-4">Nomor WhatsApp</label>
          <input
            type="text"
            placeholder="62812xxxxxxx"
            className="input input-bordered w-full mt-2 text-gray-700"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <button className="btn bg-red-700 text-white hover:bg-red-800 mt-5">
            Simpan Perubahan
          </button>
        </form>
      )}
    </div>
  );
};
export default KelolaLokasi;