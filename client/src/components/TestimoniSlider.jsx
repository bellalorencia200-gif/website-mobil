import { useState, useEffect, useRef } from "react";
import axios from "../api/axiosInstance";

const getInisial = (nama) => {
  if (!nama) return "?";
  const kata = nama.trim().split(" ").filter(Boolean);
  if (kata.length === 1) return kata[0][0].toUpperCase();
  return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
};

const BintangRating = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={i <= rating ? "#D9A85C" : "none"}
        stroke="#D9A85C"
        strokeWidth="1.5"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const TestimoniSlider = () => {
  const [dataTestimoni, setDataTestimoni] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/testimoni")
      .then((response) => {
        setDataTestimoni(response.data.testimoni || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal memuat testimoni:", error);
        setLoading(false);
      });
  }, []);

  const handleScroll = (offset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (loading || dataTestimoni.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto mt-14 md:mt-20 px-4 md:px-6">
      <div className="text-center mb-8 md:mb-10">
        <p className="text-[#8B1A1A] text-[15px] md:text-[16px] font-bold uppercase tracking-[0.25em] mb-3">
          — Testimoni Pelanggan —
        </p>
        <h2 className="text-2xl md:text-4xl font-serif font-medium text-gray-900 leading-snug">
          Apa Kata Mereka Yang{" "}
          <span className="italic text-[#8B1E24]">Sudah Membeli</span>
        </h2>
        <p className="text-sm text-gray-500 mt-4 max-w-lg mx-auto">
          Pengalaman nyata dari pelanggan yang telah mempercayakan pembelian
          mobilnya bersama kami.
        </p>
      </div>

      <div className="relative">
        {dataTestimoni.length > 1 && (
          <>
            <button
              onClick={() =>
  handleScroll(window.innerWidth < 640 ? -window.innerWidth : -400)
}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-amber-300 shadow-md flex items-center justify-center text-xl hover:bg-amber-50 hover:border-amber-500 transition"
            >
              ‹
            </button>
            <button
              onClick={() =>
  handleScroll(window.innerWidth < 640 ? window.innerWidth : 400)
}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-amber-300 shadow-md flex items-center justify-center text-xl hover:bg-amber-50 hover:border-amber-500 transition"
            >
              ›
            </button>
          </>
        )}

        <div
          ref={sliderRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-2 px-1 scrollbar-hide snap-x snap-mandatory"
        >
          {dataTestimoni.map((testimoni) => (
            <div
              key={testimoni.id}
              className="w-[calc(100vw-32px)] sm:w-[360px] lg:w-[380px] h-[335px] flex-shrink-0 rounded-3xl bg-gradient-to-br from-[#210407] via-[#35070B] to-[#210407] border border-[#D9A85C]/25 shadow-xl p-6 sm:p-7 md:p-8 relative overflow-hidden snap-start"
            >
              {/* Garis aksen emas melengkung di pojok kanan bawah */}
              <svg
                className="absolute bottom-0 right-0 pointer-events-none"
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
              >
                <path
                  d="M90 90 C 90 40, 40 0, 0 0"
                  stroke="#D9A85C"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />
              </svg>

              <div className="flex items-start justify-between mb-4">



                <BintangRating rating={testimoni.rating} />
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="#D9A85C"
                  opacity="0.5"
                >
                  <path d="M7 7c-2.2 0-4 1.8-4 4v6h6v-6H6c0-1.1.9-2 2-2V7zm10 0c-2.2 0-4 1.8-4 4v6h6v-6h-3c0-1.1.9-2 2-2V7z" />
                </svg>
              </div>

              <p className="text-[#FBF3E9]/90 text-sm leading-relaxed mb-6 line-clamp-4">
                "{testimoni.komentar}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-[#D9A85C]/15">
                {testimoni.fotoUrl ? (
                  <img
                    src={testimoni.fotoUrl}
                    alt={testimoni.namaPelanggan}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#D9A85C]/50 flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#D9A85C]/15 border-2 border-[#D9A85C]/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D9A85C] font-bold text-sm">
                      {getInisial(testimoni.namaPelanggan)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {testimoni.namaPelanggan}
                  </p>
                  {testimoni.lokasi && (
                    <p className="text-[#D9A85C]/70 text-xs truncate">
                      {testimoni.lokasi}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniSlider;