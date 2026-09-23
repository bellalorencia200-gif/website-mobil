import { useState, useEffect, useRef } from "react";
import { FaCheck, FaStar, FaArrowRight, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";
import mobilkuBanner from "../assets/website-banner.png";

const keunggulan = [
  "Inspeksi 175 Titik",
  "Bergaransi Resmi",
  "Bebas Banjir & Tabrakan",
];

// Angka yang berjalan naik dari 0 ke nilai aslinya saat komponen tampil (mis. saat refresh halaman)
function CountUp({ target, duration = 10000, decimals = 0 }) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out biar terasa halus di akhir
      setValue(target * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return <>{decimals > 0 ? value.toFixed(decimals) : Math.round(value)}</>;
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0b0906]">
      {/* ===== Foto banner MobilKu ===== */}
      <img
        src={mobilkuBanner}
        alt="Showroom MobilKu"
        className="absolute inset-0 w-full h-full object-cover object-[80%_40%] md:object-[96%_46%] brightness-125 contrast-[1.05] saturate-[1.08]"
      />

      {/* Gradasi desktop (tidak berubah) */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/20 via-black/8 to-transparent md:from-black/22 md:via-black/6" />
      <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

      {/* Gradasi mobile: gelap dari bawah supaya teks yang ditumpuk di bawah tetap kebaca */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

      <div className="hidden lg:block absolute top-8 left-8 w-16 h-16 border-t border-l border-white/30 pointer-events-none" />
<div className="hidden md:block relative max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-28 md:pt-24 md:pb-32">
  <div className="max-w-xl">
      

          <h1
            className="text-[36px] md:text-5xl lg:text-[56px] font-extrabold leading-[1.15] tracking-tight mb-5 [text-shadow:0_2px_6px_rgba(0,0,0,.85),0_6px_28px_rgba(0,0,0,.6)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-white [text-shadow:0_2px_10px_rgba(0,0,0,.9)]">
              Mobil Second Berkualitas,
            </span>
            <br />
            <span className="italic text-red-700 [text-shadow:0_0_30px_rgb(247, 11, 11)]">
              Tanpa Rasa Ragu
            </span>
          </h1>
          <p className="text-gray-100 text-[15px] md:text-[15.5px] leading-relaxed mb-4 max-w-md [text-shadow:0_1px_4px_rgba(0,0,0,.85),0_4px_18px_rgba(0,0,0,.6)]">
            Setiap mobil melewati{" "}
            <span className="text-white font-semibold">175 titik inspeksi</span>
            , riwayat servis transparan, dan dijamin{" "}
            <span className="text-white font-semibold">
              bebas banjir maupun tabrakan
            </span>
            .
          </p>

          <div className="relative max-w-md mb-6 rounded-2xl border border-amber-200/30 bg-[#650d12] px-5 py-4 shadow-lg">
            <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-red-300 via-red-500 to-red-700" />
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-red-400 via-amber-300 to-red-700" />
            <div className="flex items-center gap-4">
              <span
                className="shrink-0 text-4xl leading-none text-amber-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                "
              </span>
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-amber-200/60 to-transparent" />
              <p
                className="text-sm md:text-[15px] font-medium italic leading-relaxed text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Karena mobil second terbaik bukan yang termurah — tapi yang
                paling jujur.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-7">
            {keunggulan.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 bg-black/45 backdrop-blur-md border border-red-400/30 rounded-full pl-2 pr-4 py-2 shadow-[0_8px_20px_-8px_rgba(0,0,0,.6)]"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-700 shadow-[0_0_10px_rgba(239,68,68,.5)] flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-white text-[9px]" />
                </span>
                <span className="text-white text-xs font-semibold tracking-wide">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3.5 mb-6">
            <Link
              to="/katalog"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white text-[12.5px] font-bold uppercase tracking-wide overflow-hidden bg-gradient-to-r from-red-600 to-red-800 ring-1 ring-inset ring-white/25 shadow-[0_16px_32px_-10px_rgba(190,18,60,.65)] hover:shadow-[0_18px_38px_-8px_rgba(190,18,60,.75)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shine_2.5s_ease-in-out_infinite]" />
              <span className="relative">Temukan Mobil Impian</span>
              <FaArrowRight className="relative text-xs group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/jual-mobil"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border-[1.5px] border-white/55 bg-white/10 backdrop-blur-md text-red-700 text-[12.5px] font-bold uppercase tracking-wide hover:bg-white/20 hover:border-white transition-all duration-300"
            >
              <FaTag className="text-xs" />
              Jual Mobil Anda
            </Link>
          </div>

          <div className="inline-flex items-center gap-2.5 bg-black/35 backdrop-blur-sm border border-white/15 rounded-full pl-3 pr-4 py-1.5 mb-5">
            <span className="flex gap-0.5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,.65)]">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-[11px]" />
              ))}
            </span>
            <span className="w-px h-3.5 bg-white/20" />
            <p className="text-gray-100 text-xs italic [text-shadow:0_1px_4px_rgba(0,0,0,.85),0_4px_16px_rgba(0,0,0,.6)]">
              Dipercaya{" "}
              <span className="text-white font-bold not-italic">15.000+</span>{" "}
              pembeli mobil second di seluruh Indonesia
            </p>
          </div>

         <div className="grid grid-cols-2 gap-2.5 pt-5 mt-1 border-t border-white/25 max-w-md">
            <div className="group relative text-center bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-red-400/30 rounded-2xl pt-4 pb-3 px-1 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gradient-to-r from-red-400 to-amber-300" />
              <p
                className="text-[28px] md:text-3xl font-extrabold text-white [text-shadow:0_2px_8px_rgba(0,0,0,.9),0_0_20px_rgba(239,68,68,.4)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <CountUp target={500} />
                <span className="text-red-300">+</span>
              </p>
              <p className="text-[10px] text-red-200 uppercase tracking-wider mt-1.5 font-semibold whitespace-nowrap">
                Mobil Terjual
              </p>
            </div>
            
            <div className="group relative text-center bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-red-400/30 rounded-2xl pt-4 pb-3 px-1 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gradient-to-r from-red-400 to-amber-300" />
              <p
                className="text-[28px] md:text-3xl font-extrabold text-white [text-shadow:0_2px_8px_rgba(0,0,0,.9),0_0_20px_rgba(239,68,68,.4)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <CountUp target={10} />
                <span className="text-red-300">+</span>
              </p>
              <p className="text-[10px] text-red-200 uppercase tracking-wider mt-1.5 font-semibold whitespace-nowrap">
                Tahun Pengalaman
              </p>
            </div>
          </div>
        </div>
      </div>
<div className="md:hidden relative px-4 pt-20 pb-8 min-h-[540px] flex flex-col justify-end">

        <h1
          className="text-[28px] font-extrabold leading-[1.2] tracking-tight mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-white [text-shadow:0_2px_10px_rgba(0,0,0,.9)]">
            Mobil Second Berkualitas,
          </span>
          <br />
          <span className="italic text-red-500 [text-shadow:0_0_20px_rgba(247,11,11,.5)]">
            Tanpa Rasa Ragu
          </span>
        </h1>

        <p className="hidden text-gray-100 text-[13px] leading-relaxed mb-4 [text-shadow:0_1px_4px_rgba(0,0,0,.85),0_4px_18px_rgba(0,0,0,.6)]">
          Setiap mobil melewati{" "}
          <span className="text-white font-semibold">175 titik inspeksi</span>,
          dijamin{" "}
          <span className="text-white font-semibold">
            bebas banjir & tabrakan
          </span>
          .
        </p>

       {/* Chip keunggulan - wrap kalau tidak muat sebaris */}
<div className="hidden">
  {keunggulan.map((item) => (
    <div
      key={item}
      className="flex items-center gap-2 bg-black/45 backdrop-blur-md border border-red-400/30 rounded-full pl-1.5 pr-3 py-1.5"
    >
      <span className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-700 flex items-center justify-center flex-shrink-0">
        <FaCheck className="text-white text-[7px]" />
      </span>
      <span className="text-white text-[10.5px] font-semibold whitespace-nowrap">
        {item}
      </span>
    </div>
  ))}
</div>

        {/* Tombol ditumpuk, lebar penuh */}
        <div className="flex flex-col gap-3 mb-5">
          <Link
            to="/katalog"
            className="relative flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-white text-[12px] font-bold uppercase tracking-wide overflow-hidden bg-gradient-to-r from-red-600 to-red-800 ring-1 ring-inset ring-white/25 shadow-[0_16px_32px_-10px_rgba(190,18,60,.65)]"
          >
            <span className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shine_2.5s_ease-in-out_infinite]" />
            <span className="relative">Temukan Mobil Impian</span>
            <FaArrowRight className="relative text-xs" />
          </Link>
          <Link
            to="/jual-mobil"
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border-[1.5px] border-white/55 bg-white/10 backdrop-blur-md text-white text-[12px] font-bold uppercase tracking-wide"
          >
            <FaTag className="text-xs" />
            Jual Mobil Anda
          </Link>
        </div>

        {/* Rating ringkas */}
        <div className="inline-flex items-center gap-2 self-start bg-black/35 backdrop-blur-sm border border-white/15 rounded-full pl-2.5 pr-3.5 py-1.5 mb-5">
          <span className="flex gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-[9px]" />
            ))}
          </span>
          <p className="text-gray-100 text-[10.5px] italic">
            Dipercaya{" "}
            <span className="text-white font-bold not-italic">15.000+</span>{" "}
            pembeli
          </p>
        </div>
        {/* Statistik ringkas */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/25">
          <div className="text-center bg-white/5 border border-white/10 rounded-xl pt-3 pb-2.5 px-1">
            <p
              className="text-[20px] font-extrabold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <CountUp target={500} />
              <span className="text-red-300">+</span>
            </p>
            <p className="text-[8.5px] text-red-200 uppercase tracking-wider mt-1 font-semibold whitespace-nowrap">
              Mobil Terjual
            </p>
          </div>
          <div className="text-center bg-white/5 border border-white/10 rounded-xl pt-3 pb-2.5 px-1">
            <p
              className="text-[20px] font-extrabold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <CountUp target={10} />
              <span className="text-red-300">+</span>
            </p>
            <p className="text-[8.5px] text-red-200 uppercase tracking-wider mt-1 font-semibold whitespace-nowrap">
              Th. Pengalaman
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
