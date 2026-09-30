import { useState, useEffect } from "react";
import { FaArrowRight, FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox.jsx";

import banner4 from "../assets/banner4.png";
import banner3 from "../assets/banner3.png";

const slides = [
  {
    image: banner4,
    posisi: "object-[55%_100%]",
    posisiDesktop: "md:object-[60%_80%]",
    badge: "KUALITAS TERJAMIN",
    judulBaris1: "Mobil Second",
    judulBaris2: "Berkualitas",
    judul: (
      <>
        Mobil Second
        <br />
        Berkualitas
      </>
    ),
    deskripsi:
      "Temukan mobil berkualitas dengan harga terbaik sesuai kebutuhan Anda.",
  },
  {
  image: banner3,
  posisi: "object-[70%_100%]",
  skala: "scale-110",
  special: true,
  badge: "AMAN & TERPERCAYA",
  judulBaris1: "Mobil Impian",
  judulBaris2: "Jadi Nyata",
  warnaTombol: "bg-[#8F0712] text-white",
  warnaPanah: "bg-white text-[#8F0712] border border-white",
  judul: (
    <>
      Mobil Impian
      <br />
      Jadi Nyata
    </>
  ),
  deskripsi:
    "Pilihan terbaik dengan harga transparan & proses cepat tanpa ribet.",
}
];

const Hero = () => {
  const [slideAktif, setSlideAktif] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideAktif((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[slideAktif];

  return (
    <section className="w-full">
      {/* ================= HERO ================= */}
      <div className="relative w-full overflow-hidden">

        {/* SLIDER IMAGE */}
        <div className="relative w-full h-[460px] md:h-[500px] lg:h-[560px]">
          {slides.map((s, index) => (
            <img
              key={index}
              src={s.image}
              alt="Mobil Second Mobilku"
              className={`
                absolute inset-0
                w-full h-full
                object-cover
                ${s.skala || "scale-100"} md:scale-100
                ${s.posisi}
                ${s.posisiDesktop || "md:object-center"}
                transition-opacity duration-1000
                ${index === slideAktif ? "opacity-100" : "opacity-0"}
              `}
            />
          ))}
        </div>

<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/5 md:bg-gradient-to-r md:from-black/50 md:via-black/25 md:to-black/5"></div>
        {/* ================= CONTENT ================= */}
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="w-full max-w-7xl mx-auto px-5 md:px-8 lg:px-12 pb-16 md:pb-0">

            {/* TITLE - mobile */}
            <h1
              className="md:hidden text-white text-[26px] leading-[1.15] mb-2.5"
              style={{
                fontFamily: "'Playfair Display', serif",
                textShadow: "0 2px 14px rgba(0,0,0,.5)",
              }}
            >
              <span className="font-semibold">{slide.judulBaris1}</span>
              <br />

<span
  className="tracking-[1px]"
  style={{
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    background:
      "linear-gradient(90deg, #F5E6B3, #D4AF37, #A67C2E)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow:
      "0 2px 10px rgba(0,0,0,0.5), 0 0 18px rgba(212,175,55,0.25)",
  }}
>
  {slide.judulBaris2}
</span>

            </h1>

            {/* TITLE - desktop */}
<h1 className="hidden md:block text-white md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-2">
  <span>{slide.judulBaris1}</span>
  <br />
  <span
    style={{
      fontFamily: "'Cinzel', serif",
      fontWeight: 600,
      background:
        "linear-gradient(90deg, #F5E6B3, #D4AF37, #A67C2E)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow:
        "0 2px 10px rgba(0,0,0,0.5), 0 0 18px rgba(212,175,55,0.25)",
    }}
  >
    {slide.judulBaris2}
  </span>
</h1>

            {/* DESCRIPTION */}
            <p
              className="text-white/90 text-[12.5px] leading-relaxed max-w-[30ch] mb-4 md:text-white md:text-base md:max-w-sm md:opacity-90"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,.4)" }}
            >
              {slide.deskripsi}
            </p>

          {/* BUTTON - mobile */}
<div className="md:hidden flex items-center gap-2.5 mb-5">
  <Link
    to="/katalog"
    className={`inline-flex items-center gap-2.5 ${slide.warnaTombol || "bg-gradient-to-r from-white via-[#f8f1e7] to-[#f3e6d2] text-[#8F0712]"} rounded-full pl-2 pr-4 py-2 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] font-semibold text-[12.5px] backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-300`}
  >
    <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm">
      <FaCar size={13} />
    </span>
    <span>Lihat Koleksi</span>
  </Link>
  <Link
    to="/katalog"
    aria-label="Lihat koleksi mobil"
    className={`w-9 h-9 hover:scale-105 active:scale-95 transition-all rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg ${slide.warnaPanah || "bg-white/20 border border-[#D4AF37]/40 text-white"}`}
  >
    <FaArrowRight size={13} />
  </Link>
</div>

            {/* BUTTON - desktop (tampilan tidak diubah) */}
            <Link
              to="/katalog"
              className="hidden md:inline-flex items-center gap-2 bg-white text-[#8F0712] rounded-full px-3 py-1.5 shadow-lg font-semibold text-xs md:text-base hover:scale-105 hover:shadow-xl transition-all"
            >
              <span className="w-8 h-8 rounded-full border-2 border-[#8F0712] flex items-center justify-center text-sm">
                <FaCar size={13} />
              </span>

              <span>Lihat Koleksi</span>

              <span className="w-8 h-8 rounded-full bg-[#8F0712] text-white flex items-center justify-center">
                <FaArrowRight size={12} />
              </span>
            </Link>

            {/* DOTS */}
            <div className="mt-0 md:mt-4 flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSlideAktif(index)}
                  aria-label={`Slide ${index + 1}`}
                  className={`
                    rounded-full transition-all duration-300
                    h-1.5 md:h-2
                    ${
                      index === slideAktif
                        ? "w-6 bg-gradient-to-r from-[#F5E6B3] to-[#D4AF37] md:bg-white"
                        : "w-1.5 md:w-2 bg-white/40 md:bg-white/50 hover:scale-105 active:scale-95 transition-all duration-300"
                    }
                  `}
                />
              ))}
            </div>

          </div>
        </div>

        {/* CURVE BOTTOM */}
        <div className="absolute bottom-[-25px] left-[-5%] w-[110%] h-[60px] bg-white rounded-[50%]"></div>

      </div>

      {/* SEARCH BOX */}
      <SearchBox />
    </section>
  );
};

export default Hero;
