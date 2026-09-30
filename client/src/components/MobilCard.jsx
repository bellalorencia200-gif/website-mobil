import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function formatHarga(harga) {
  if (harga === undefined || harga === null || harga === "") return "-";

  if (
    typeof harga === "string" &&
    harga.trim().toLowerCase().startsWith("rp")
  ) {
    return harga;
  }

  const angka = Number(harga);

  if (Number.isNaN(angka)) return harga;

  return `Rp ${angka.toLocaleString("id-ID")}`;
}

function formatHargaSingkat(harga) {
  if (harga === undefined || harga === null || harga === "") {
    return "-";
  }

  let angka;

  if (typeof harga === "string") {
    const digits = harga.replace(/[^0-9]/g, "");
    angka = Number(digits);
  } else {
    angka = Number(harga);
  }

  if (!angka || Number.isNaN(angka)) {
    return typeof harga === "string" ? harga : "-";
  }

  if (angka >= 1_000_000_000) {
    return `Rp ${(angka / 1_000_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} M`;
  }

  return `Rp ${(angka / 1_000_000).toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  })} jt`;
}

function MobilCard({ image, nama, tahun, harga, id, isPromo }) {
  return (
    <Link
      to={`/mobil/${id}`}
      className="
        group relative flex flex-col
        bg-white
        rounded-[14px] sm:rounded-[18px]
        border border-gray-100
        shadow-[0_6px_16px_-8px_rgba(0,0,0,0.08)]
        transition-all duration-300
        hover:-translate-y-1.5
        hover:border-[#D9A85C]/50
        hover:shadow-[0_20px_34px_-14px_rgba(190,18,60,0.3)]
        overflow-visible
      "
    >
      {/* =========================================================
          RIBBON PROMO 3D REALISTIS (MELENGKUNG & MEMBUNGKUS KARTU)
      ========================================================== */}
      {isPromo && (
        <div className="absolute -top-[6px] -left-[6px] z-30 pointer-events-none w-[100px] h-[100px] sm:w-[115px] sm:h-[115px] overflow-hidden rounded-tl-[14px] sm:rounded-tl-[18px]">
          {/* Lipatan Samping-Kiri (Efek Bayangan 3D ke Belakang Kartu) */}
          <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[8px] border-t-[#400000] border-l-[8px] border-l-transparent" />

          {/* Lipatan Atas-Kanan (Efek Bayangan 3D ke Belakang Kartu) */}
          <div className="absolute top-0 right-0 w-0 h-0 border-b-[8px] border-b-[#400000] border-r-[8px] border-r-transparent" />

          {/* Badan Pita Utama */}
          <div
            className="
              absolute
              top-[18px] sm:top-[22px]
              -left-[38px] sm:-left-[40px]
              w-[135px] sm:w-[150px]
              bg-gradient-to-r from-[#700000] via-[#A8131A] to-[#700000]
              text-white
              text-[9px] sm:text-[10px]
              font-extrabold
              tracking-widest
              text-center
              py-1
              shadow-[0_3px_8px_rgba(0,0,0,0.3)]
              -rotate-45
              border-y border-[#D9A85C]/50
              uppercase
            "
          >
            PROMO
          </div>
        </div>
      )}

      {/* =========================================================
          FOTO MOBIL
      ========================================================== */}
      <div
        className="
          relative
          h-[135px]
          sm:h-[140px]
          md:h-[150px]
          overflow-hidden
          rounded-t-[14px] sm:rounded-t-[18px]
          bg-gradient-to-br from-gray-100 to-gray-300
        "
      >
        {image ? (
          <img
            src={image}
            alt={nama}
            className="
              w-full h-full
              object-cover
              transition-transform duration-500
              group-hover:scale-110
            "
          />
        ) : null}

        {/* =====================================================
            TAHUN
        ====================================================== */}
        {tahun ? (
          <span
            className="
              absolute
              top-1.5
              right-1.5
              sm:top-2.5
              sm:right-2.5
              z-10
              bg-white/90
              backdrop-blur-sm
              text-[7px]
              sm:text-[10px]
              font-bold
              text-gray-700
              px-1.5
              sm:px-2.5
              py-0.5
              sm:py-1
              rounded-full
              shadow-sm
            "
          >
            {tahun}
          </span>
        ) : null}
      </div>

      {/* =========================================================
          DETAIL MOBIL
      ========================================================== */}
      <div
        className="
          flex flex-col
          flex-1
          px-2
          sm:px-4
          pt-1.5
          sm:pt-3
          pb-2
          sm:pb-4
        "
      >
        {/* Nama Mobil */}
        <h3
          className="
            text-[14px]
            sm:text-[13.5px]
            font-extrabold
            text-gray-900
            leading-snug
            mb-1
            sm:mb-2
            min-h-[34px]
            sm:min-h-[34px]
            line-clamp-2
          "
        >
          {nama}
        </h3>

        <div className="mt-auto">
          {/* Label Harga */}
          <p
            className="
              text-[7px]
              sm:text-[10px]
              text-gray-400
              font-semibold
              uppercase
              tracking-wide
              mb-0.5
            "
          >
            Harga
          </p>

          {/* HARGA MOBILE */}
          <p
            className="
              sm:hidden
              text-[12px]
              font-extrabold
              mb-1.5
              bg-gradient-to-r
              from-[#B5321A]
              to-[#D9A85C]
              bg-clip-text
              text-transparent
              whitespace-nowrap
            "
          >
            {formatHargaSingkat(harga)}
          </p>

          {/* HARGA TABLET / DESKTOP */}
          <p
            className="
              hidden
              sm:block
              text-[15px]
              font-extrabold
              mb-3
              bg-gradient-to-r
              from-[#B5321A]
              to-[#D9A85C]
              bg-clip-text
              text-transparent
            "
          >
            {formatHarga(harga)}
          </p>

          {/* BUTTON LIHAT DETAIL */}
          <span
            className="
              flex
              items-center
              justify-center
              gap-1.5
              sm:gap-2

              w-[calc(100%+1rem)]
              sm:w-[calc(100%+2rem)]

              -mx-2
              sm:-mx-4

              -mb-2
              sm:-mb-4

              py-2
              sm:py-3

              bg-gradient-to-b
              from-[#9d151b]
              to-[#70090F]

              text-white
              text-[10.5px]
              sm:text-sm
              font-extrabold
              rounded-b-[14px] sm:rounded-b-[18px]
            "
          >
            Lihat Detail

            <span
              className="
                w-4
                h-4
                sm:w-6
                sm:h-6
                rounded-full
                bg-white/20
                text-white
                flex
                items-center
                justify-center
              "
            >
              <FaArrowRight
                className="
                  text-[8.5px]
                  sm:text-[10px]
                "
              />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default MobilCard;