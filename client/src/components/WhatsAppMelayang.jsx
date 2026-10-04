import { FaWhatsapp } from "react-icons/fa";
import useSettings from "../hooks/useSettings.js";

// Tombol WhatsApp melayang di pojok kanan bawah (tampil di semua halaman)
function WhatsAppMelayang() {
  const { linkWa } = useSettings();

  const pesan = encodeURIComponent("Halo MobilKu, saya mau tanya-tanya soal mobil.");

  return (
    <div className="fixed right-4 bottom-[86px] md:right-6 md:bottom-6 z-[45]">
      {/* Tombol bulat WhatsApp */}
      <a
        href={`${linkWa}?text=${pesan}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp MobilKu"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-6px_rgba(37,211,102,0.65)] transition hover:scale-110 md:h-16 md:w-16"
      >
        {/* Efek gelombang */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <FaWhatsapp className="relative text-[30px] md:text-[34px]" />
      </a>
    </div>
  );
}

export default WhatsAppMelayang;