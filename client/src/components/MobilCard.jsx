import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function formatHarga(harga) {
  if (harga === undefined || harga === null || harga === "") return "-";
  // Kalau harga sudah berupa teks berformat (mis. "Rp 200.000.000"), pakai apa adanya
  if (typeof harga === "string" && harga.trim().toLowerCase().startsWith("rp")) {
    return harga;
  }
  const angka = Number(harga);
  if (Number.isNaN(angka)) return harga;
  return `Rp ${angka.toLocaleString("id-ID")}`;
}

function MobilCard({ image, nama, tahun, harga, id }) {
  return (
    <Link
      to={`/mobil/${id}`}
      className="
        group relative flex flex-col
        bg-white rounded-[18px] overflow-hidden
        border border-gray-100
        shadow-[0_6px_16px_-8px_rgba(0,0,0,0.08)]
        transition-all duration-300
        hover:-translate-y-1.5
        hover:border-[#D9A85C]/50
        hover:shadow-[0_20px_34px_-14px_rgba(190,18,60,0.3)]
      "
    >
      {/* Foto */}
      <div className="relative h-[130px] sm:h-[140px] md:h-[150px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-300">
        {image ? (
          <img
            src={image}
            alt={nama}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : null}

        {tahun ? (
          <span className="absolute top-2.5 right-2.5 bg-white/90 text-[10px] font-bold text-gray-700 px-2.5 py-1 rounded-full">
            {tahun}
          </span>
        ) : null}
      </div>

      {/* Detail */}
      <div className="flex flex-col flex-1 px-3.5 sm:px-4 pt-3 pb-4">
        <h3 className="text-[13px] sm:text-[13.5px] font-extrabold text-gray-900 leading-snug mb-2 min-h-[34px] line-clamp-2">
          {nama}
        </h3>

        <div className="mt-auto">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">
            Harga
          </p>
          <p
            className="text-[14px] sm:text-[15px] font-extrabold mb-3 bg-gradient-to-r from-[#B5321A] to-[#D9A85C] bg-clip-text text-transparent"
          >
            {formatHarga(harga)}
          </p>

          <span
            className="
              flex items-center justify-center gap-1.5 w-full py-2.5
              rounded-[10px]
              bg-gradient-to-b from-[#FBF3E9] to-[#F1E1C8]
              text-[#2A0508] text-[11px] sm:text-xs font-extrabold
              shadow-[0_6px_14px_-6px_rgba(0,0,0,0.25)]
            "
          >
            Lihat Detail
            <span className="w-4 h-4 rounded-full bg-[#2A0508] text-[#D9A85C] flex items-center justify-center">
              <FaArrowRight className="text-[8px]" />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default MobilCard;
