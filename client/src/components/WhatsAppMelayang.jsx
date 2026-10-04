import { useState, useEffect } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import useSettings from "../hooks/useSettings.js";

// Tombol WhatsApp melayang di pojok kanan bawah (tampil di semua halaman)
function WhatsAppMelayang() {
  const { linkWa } = useSettings();
  const [tampilSapaan, setTampilSapaan] = useState(false);

  // Gelembung sapaan muncul 3 detik setelah halaman dibuka (sekali per kunjungan)
  useEffect(() => {
    let sudah = false;
    try {
      sudah = sessionStorage.getItem("sapaanWaDitutup") === "1";
    } catch {
      // abaikan
    }
    if (sudah) return;
    const t = setTimeout(() => setTampilSapaan(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const tutupSapaan = () => {
    setTampilSapaan(false);
    try {
      sessionStorage.setItem("sapaanWaDitutup", "1");
    } catch {
      // abaikan
    }
  };

  const pesan = encodeURIComponent("Halo MobilKu, saya mau tanya-tanya soal mobil.");

  return (
    <div className="fixed right-4 bottom-[86px] md:right-6 md:bottom-6 z-[45] flex flex-col items-end gap-3">
      {/* Gelembung sapaan */}
      {tampilSapaan && (
        <div className="relative max-w-[230px] rounded-2xl rounded-br-md bg-white px-4 py-3 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 animate-[muncul_.35s_ease-out]">
          <button
            type="button"
            onClick={tutupSapaan}
            aria-label="Tutup"
            className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white shadow"
          >
            <FaTimes className="text-[10px]" />
          </button>
          <p className="text-[13px] font-bold text-gray-900">Butuh bantuan? 👋</p>
          <p className="mt-0.5 text-[12px] leading-snug text-gray-500">
            Chat tim MobilKu, kami siap membantu.
          </p>
        </div>
      )}

      {/* Tombol bulat WhatsApp */}
      <a
        href={`${linkWa}?text=${pesan}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={tutupSapaan}
        aria-label="Chat WhatsApp MobilKu"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-6px_rgba(37,211,102,0.65)] transition hover:scale-110 md:h-16 md:w-16"
      >
        {/* Efek gelombang */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <FaWhatsapp className="relative text-[30px] md:text-[34px]" />
      </a>

      <style>{`
        @keyframes muncul {
          from { opacity: 0; transform: translateY(8px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default WhatsAppMelayang;