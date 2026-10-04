import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import {
  FaStore,
  FaMapMarkerAlt,
  FaMapMarkedAlt,
  FaClock,
  FaWhatsapp,
  FaInfoCircle,
  FaSave,
  FaLightbulb,
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaShareAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

const KelolaLokasi = () => {
  const [alamat, setAlamat] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [jamOperasional, setJamOperasional] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // ===== Media sosial =====
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");

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
          setFacebookUrl(settings.facebookUrl || "");
          setInstagramUrl(settings.instagramUrl || "");
          setTelegramUrl(settings.telegramUrl || "");
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

  // Simpan khusus link media sosial (data lokasi tidak ikut terkirim, jadi tidak berubah)
  const handleSimpanSosmed = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    axios
      .put(
        "/api/settings",
        { facebookUrl, instagramUrl, telegramUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        const s = response.data.settings;
        if (s) {
          // tampilkan link yang sudah dirapikan server (misal ditambah https://)
          setFacebookUrl(s.facebookUrl || "");
          setInstagramUrl(s.instagramUrl || "");
          setTelegramUrl(s.telegramUrl || "");
        }
        alert("link media sosial berhasil di update");
        setIsSubmitting(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || "gagal update link media sosial");
        setIsSubmitting(false);
      });
  };

  // Link WhatsApp otomatis dari nomor (08xx -> 628xx)
  const nomorWa = whatsapp.replace(/\D/g, "").replace(/^0/, "62");
  const linkWa = nomorWa ? `https://wa.me/${nomorWa}` : "";

  const daftarSosmed = [
    {
      nama: "Facebook",
      Icon: FaFacebookF,
      warna: "bg-[#1877F2]",
      nilai: facebookUrl,
      setNilai: setFacebookUrl,
      placeholder: "https://facebook.com/mobilku.id",
    },
    {
      nama: "Instagram",
      Icon: FaInstagram,
      warna: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
      nilai: instagramUrl,
      setNilai: setInstagramUrl,
      placeholder: "https://instagram.com/mobilku.id",
    },
    {
      nama: "Telegram",
      Icon: FaTelegramPlane,
      warna: "bg-[#229ED9]",
      nilai: telegramUrl,
      setNilai: setTelegramUrl,
      placeholder: "https://t.me/mobilku",
    },
  ];

  return (
    <div className="w-full">
      {isSubmitting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      {/* ==================================================
          HEADER HALAMAN
      ================================================== */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-stretch gap-3">
          <span className="w-1.5 rounded-full bg-gradient-to-b from-[#E0A82E] to-[#B5791A]" />
          <div>
            <h1 className="text-2xl md:text-[28px] font-black text-[#1c0a0b] tracking-tight leading-tight">
              Pengaturan Lokasi
            </h1>
            <p className="text-xs md:text-[13px] text-gray-500 mt-1">
              Info ini akan tampil di section lokasi showroom pada halaman utama.
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 -skew-x-[35deg] mr-2" aria-hidden="true">
          <span className="block w-4 h-12 bg-gradient-to-b from-[#F6D47A] to-[#C9973F] rounded-sm" />
          <span className="block w-3 h-12 bg-gradient-to-b from-[#a5161d] to-[#5f0a0d] rounded-sm" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg text-[#8f1117]"></span>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 items-stretch">
          {/* ==================================================
              FORM
          ================================================== */}
          <form
            onSubmit={handleSimpan}
            className="relative overflow-hidden h-full flex flex-col rounded-[24px] bg-white ring-1 ring-[#EADFD2] shadow-[0_18px_45px_-28px_rgba(80,30,20,0.45)]"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8f1117] via-[#E0A82E] to-[#5f0a0d]" />

            <div className="flex items-center gap-3 px-5 md:px-6 pt-6 pb-4 border-b border-[#F3ECE3]">
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-white flex items-center justify-center shadow-[0_10px_20px_-8px_rgba(143,17,23,0.6)]">
                <FaStore />
              </span>
              <div>
                <h2 className="font-black text-[#1c0a0b] leading-tight">Informasi Showroom</h2>
                <p className="text-[11px] text-gray-500">Lengkapi data agar pembeli mudah menemukan Anda</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-5 px-5 md:px-6 py-5">
              {/* Alamat */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                  <FaMapMarkerAlt className="text-[#8f1117]" /> Nama Lokasi / Alamat
                </label>
                <input
                  type="text"
                  placeholder="Jl. Raya Contoh No. 88, Palembang"
                  className="input w-full h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] text-[#1c0a0b] placeholder:text-gray-400 focus:outline-none focus:border-[#D9A85C]"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>

              {/* Link Maps */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                  <FaMapMarkedAlt className="text-[#8f1117]" /> Link Embed Google Maps
                </label>
                <input
                  type="text"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="input w-full h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] text-[#1c0a0b] placeholder:text-gray-400 focus:outline-none focus:border-[#D9A85C] font-mono text-xs"
                  value={mapEmbedUrl}
                  onChange={(e) => setMapEmbedUrl(e.target.value)}
                />
                <p className="flex items-start gap-1.5 text-[11px] text-gray-500 mt-2 leading-relaxed">
                  <FaInfoCircle className="text-[#C27C0E] mt-0.5 shrink-0" />
                  <span>
                    Ambil dari Google Maps &gt; <b>Share</b> &gt; <b>Embed a map</b>, lalu salin link di dalam <code className="text-[10px] bg-[#F5F0EA] px-1 rounded">src="..."</code>
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Jam */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                    <FaClock className="text-[#8f1117]" /> Jam Operasional
                  </label>
                  <input
                    type="text"
                    placeholder="Senin - Sabtu, 09.00 - 18.00 WIB"
                    className="input w-full h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] text-[#1c0a0b] placeholder:text-gray-400 focus:outline-none focus:border-[#D9A85C]"
                    value={jamOperasional}
                    onChange={(e) => setJamOperasional(e.target.value)}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                    <FaWhatsapp className="text-[#16A34A]" /> Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="62812xxxxxxx"
                    className="input w-full h-11 rounded-xl bg-[#FBF8F4] border-[#EADFD2] text-[#1c0a0b] placeholder:text-gray-400 focus:outline-none focus:border-[#D9A85C]"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tips singkat (mengisi ruang agar sejajar dengan pratinjau) */}
            <div className="mx-5 md:mx-6 mb-5 rounded-2xl bg-[#FBF1DF] ring-1 ring-[#E8C98A]/50 p-4">
              <p className="flex items-center gap-2 text-xs font-black text-[#6b4a12]">
                <FaLightbulb className="text-[#C27C0E]" /> Tips pengisian
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-[#7a5a22]">
                <li>• Tulis alamat lengkap (jalan, kecamatan, kota) agar mudah dicari pembeli.</li>
                <li>• Gunakan format <b>62</b> untuk WhatsApp, contoh <b>6282176957132</b>, agar tombol chat langsung terhubung.</li>
                <li>• Cek pratinjau di sebelah kanan sebelum menekan Simpan.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-[#F3ECE3] bg-[#FDFBF8]">
              <p className="hidden sm:block text-[11px] text-gray-500">
                Perubahan langsung tampil di halaman utama setelah disimpan.
              </p>
              <button className="btn bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d] rounded-xl px-6 w-full sm:w-auto shadow-[0_10px_22px_-10px_rgba(143,17,23,0.7)]">
                <FaSave className="text-xs text-[#F6D47A]" /> Simpan Perubahan
              </button>
            </div>
          </form>

          {/* ==================================================
              PRATINJAU LANGSUNG
          ================================================== */}
          <div className="rounded-[24px] bg-white ring-1 ring-[#EADFD2] shadow-[0_18px_45px_-28px_rgba(80,30,20,0.45)] overflow-hidden">
            <div className="flex items-center justify-between px-5 md:px-6 pt-5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-[3px] rounded-full bg-[#9b1b20]" />
                <h2 className="font-black text-[#1c0a0b]">Pratinjau</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#047857] bg-[#10B981]/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Tampilan di website
              </span>
            </div>

            {/* Peta */}
            <div className="relative mx-5 md:mx-6 h-56 md:h-64 rounded-2xl overflow-hidden ring-1 ring-[#EADFD2] bg-[#F5F0EA]">
              {mapEmbedUrl.trim().startsWith("http") ? (
                <iframe
                  src={mapEmbedUrl}
                  title="Peta lokasi showroom"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                  <FaMapMarkedAlt className="text-3xl text-[#C27C0E] mb-2" />
                  <p className="text-sm font-bold text-gray-600">Peta belum tersedia</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Isi link embed Google Maps untuk menampilkan peta</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5 md:p-6 space-y-3">
              {[
                { icon: FaMapMarkerAlt, label: "Alamat", nilai: alamat, warna: "#8f1117" },
                { icon: FaClock, label: "Jam Operasional", nilai: jamOperasional, warna: "#C27C0E" },
                { icon: FaWhatsapp, label: "WhatsApp", nilai: whatsapp, warna: "#16A34A" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FBF8F4] ring-1 ring-[#F1E8DE]">
                    <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.warna}14`, color: item.warna }}>
                      <Icon />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                      <p className={`text-sm font-bold truncate ${item.nilai ? "text-[#1c0a0b]" : "text-gray-300"}`}>
                        {item.nilai || "Belum diisi"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================================================
            MEDIA SOSIAL (BARU)
        ================================================== */}
        <form
          onSubmit={handleSimpanSosmed}
          className="relative mt-5 overflow-hidden rounded-[24px] bg-white ring-1 ring-[#EADFD2] shadow-[0_18px_45px_-28px_rgba(80,30,20,0.45)]"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8f1117] via-[#E0A82E] to-[#5f0a0d]" />

          <div className="flex items-center gap-3 px-5 md:px-6 pt-6 pb-4 border-b border-[#F3ECE3]">
            <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#b3141c] to-[#4a080b] text-white flex items-center justify-center shadow-[0_10px_20px_-8px_rgba(143,17,23,0.6)]">
              <FaShareAlt />
            </span>
            <div>
              <h2 className="font-black text-[#1c0a0b] leading-tight">Media Sosial</h2>
              <p className="text-[11px] text-gray-500">
                Link ini tampil di section "Media Sosial" halaman Dapatkan Aplikasi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 md:px-6 py-5">
            {daftarSosmed.map(({ nama, Icon, warna, nilai, setNilai, placeholder }) => (
              <div key={nama} className="rounded-2xl bg-[#FBF8F4] ring-1 ring-[#F1E8DE] p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-9 h-9 rounded-xl text-white flex items-center justify-center ${warna}`}>
                      <Icon className="text-sm" />
                    </span>
                    <p className="text-sm font-black text-[#1c0a0b]">{nama}</p>
                  </div>
                  {nilai.trim() ? (
                    <a
                      href={/^https?:\/\//i.test(nilai.trim()) ? nilai.trim() : `https://${nilai.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#047857] bg-[#10B981]/10 px-2.5 py-1 rounded-full hover:bg-[#10B981]/20"
                    >
                      Aktif <FaExternalLinkAlt className="text-[8px]" />
                    </a>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                      Disembunyikan
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder={placeholder}
                  className="input w-full h-11 rounded-xl bg-white border-[#EADFD2] text-[#1c0a0b] placeholder:text-gray-400 focus:outline-none focus:border-[#D9A85C] text-xs"
                  value={nilai}
                  onChange={(e) => setNilai(e.target.value)}
                />
              </div>
            ))}

            {/* WhatsApp otomatis dari nomor di atas */}
            <div className="rounded-2xl bg-[#F1FBF4] ring-1 ring-[#CFEFD9] p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl text-white flex items-center justify-center bg-[#25D366]">
                    <FaWhatsapp className="text-sm" />
                  </span>
                  <p className="text-sm font-black text-[#1c0a0b]">WhatsApp</p>
                </div>
                <span className="text-[10px] font-bold text-[#047857] bg-[#10B981]/10 px-2.5 py-1 rounded-full">
                  Otomatis
                </span>
              </div>
             {linkWa ? (
                <a
                  href={linkWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Klik untuk tes chat WhatsApp"
                  className="h-11 flex items-center justify-between gap-2 rounded-xl bg-white ring-1 ring-[#CFEFD9] px-4 text-xs font-semibold text-[#1c0a0b] hover:ring-[#25D366] transition"
                >
                  <span className="truncate">{linkWa}</span>
                  <FaExternalLinkAlt className="text-[10px] text-[#16A34A] shrink-0" />
                </a>
              ) : (
                <p className="h-11 flex items-center rounded-xl bg-white ring-1 ring-[#CFEFD9] px-4 text-xs font-semibold text-gray-400">
                  Isi Nomor WhatsApp di form atas
                </p>
              )}
              <p className="mt-2 text-[10.5px] text-gray-500">
                Ubah nomor di kolom <b>Nomor WhatsApp</b> (form atas). Nomor ini dipakai untuk semua tombol WhatsApp di website.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-[#F3ECE3] bg-[#FDFBF8]">
            <p className="flex items-start gap-1.5 text-[11px] text-gray-500">
              <FaInfoCircle className="text-[#C27C0E] mt-0.5 shrink-0" />
              Kosongkan link jika akun belum ada, kartunya otomatis disembunyikan di website.
            </p>
            <button className="btn bg-gradient-to-r from-[#a5161d] to-[#5f0a0d] text-white border-[#8f1117] hover:from-[#8f1117] hover:to-[#4d0a0d] rounded-xl px-6 w-full sm:w-auto shadow-[0_10px_22px_-10px_rgba(143,17,23,0.7)]">
              <FaSave className="text-xs text-[#F6D47A]" /> Simpan Media Sosial
            </button>
          </div>
        </form>
        </>
      )}
    </div>
  );
};
export default KelolaLokasi;
