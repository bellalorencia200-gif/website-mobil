import { FaArrowRight } from "react-icons/fa";

function FeatureCard({ image, Icon, judul, deskripsi }) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[20px]
        bg-white
        border border-gray-100
        shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:shadow-[0_20px_40px_-15px_rgba(95,10,13,0.30)]
      "
    >
      {/* ================= FOTO ================= */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={judul}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

        {/* Overlay lembut */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
          "
        />

        {/* Badge MobilKu */}
        <div
          className="
            absolute
            top-3
            left-3
            rounded-full
            bg-white/95
            px-3
            py-1.5
            shadow-md
            backdrop-blur-sm
          "
        >
          <span
            className="
              text-[11px]
              font-bold
              text-[#7c0d13]
            "
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            MobilKu
          </span>
        </div>

        {/* ================= GARIS DIAGONAL ================= */}
        <div
          className="
            absolute
            -bottom-1
            left-0
            right-0
            h-10
            bg-white
          "
          style={{
            clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 100%)",
          }}
        />

        <div
          className="
            absolute
            -bottom-1
            left-0
            right-0
            h-7
            bg-[#8f1117]
          "
          style={{
            clipPath: "polygon(0 100%, 100% 20%, 100% 100%)",
          }}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative px-4 pb-4 pt-8">
        {/* ICON BULAT */}
        <div
          className="
            absolute
            -top-7
            left-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            border-[3px]
            border-white
            bg-[#8f1117]
            text-white
            shadow-[0_8px_20px_-6px_rgba(95,10,13,0.55)]
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:bg-[#6f090e]
          "
        >
          {Icon && <Icon className="text-lg" />}
        </div>

        {/* GARIS KECIL */}
        <div
          className="
            mb-3
            h-[3px]
            w-10
            rounded-full
            bg-[#8f1117]
            transition-all
            duration-300
            group-hover:w-14
          "
        />

        {/* JUDUL */}
        <h3
          className="
            text-base
            md:text-lg
            font-bold
            text-[#172033]
            mb-1
            transition-colors
            duration-300
            group-hover:text-[#8f1117]
          "
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {judul}
        </h3>

        {/* DESKRIPSI */}
        <p
          className="
            min-h-[34px]
            text-xs
            md:text-sm
            leading-relaxed
            text-gray-500
          "
        >
          {deskripsi}
        </p>

        {/* ================= FOOTER ================= */}
        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            border-t
            border-gray-100
            pt-3
          "
        >
          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.12em]
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
              items-center
              justify-center
              rounded-full
              bg-[#8f1117]
              text-white
              transition-all
              duration-300
              group-hover:bg-[#6f090e]
              group-hover:translate-x-1
            "
          >
            <FaArrowRight className="text-[9px]" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;
