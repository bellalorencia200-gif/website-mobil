import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import showroomBg from "../assets/gambarmobilmap.png";

const ShowroomMap = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get("/api/settings")
      .then((response) => {
        setSettings(response.data.settings);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const alamat = settings?.alamat || "Alamat belum diatur";
  const jamOperasional = settings?.jamOperasional;
  const whatsapp = settings?.whatsapp;
  const mapEmbedUrl = settings?.mapEmbedUrl;
  const isOsm = String(mapEmbedUrl || "").includes("openstreetmap.org");
  

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`
    : "#";

  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    alamat
  )}`;

  return (

    <section id="showroom" className="w-full max-w-7xl mx-auto mt-12 md:mt-20 mb-4 md:mb-10 px-0 sm:px-6 lg:px-8">
      {/* OUTER CONTAINER */}
      <div className="relative overflow-hidden rounded-none sm:rounded-[28px] md:rounded-[36px] bg-[#3A0D11] shadow-[0_25px_80px_rgba(45,0,5,0.25)]">

        {/* TOP ACCENT */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#D9A85C] to-transparent z-20" />

        <div className="grid lg:grid-cols-[46%_54%] items-stretch">

          {/* ================= LEFT CONTENT ================= */}
          <div
            className="relative isolate min-h-[530px] lg:min-h-[490px] flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-12 overflow-hidden"
          >

            {/* BACKGROUND FOTO MOBIL */}
            <div
              className="absolute inset-0 -z-20 bg-cover bg-center"
              style={{
                backgroundImage: `url(${showroomBg})`,
                backgroundPosition: "left center",
              }}
            />

            {/* OVERLAY GRADIENT */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#210407]/[0.85] via-[#35070B]/[0.75] to-[#35070B]/[0.45]" />

            {/* DARK BOTTOM SHADOW */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#210407]/70 via-transparent to-[#210407]/15" />

            {/* DECORATIVE GLOW */}
            <div className="absolute -top-28 -left-28 w-72 h-72 rounded-full bg-[#A5161D]/10 blur-[100px] pointer-events-none" />

            {/* DECORATIVE GOLD LINE */}
            <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-transparent via-[#D9A85C]/50 to-transparent" />

            {/* CONTENT */}
            <div className="relative z-10">

             {/* BADGE SHOWROOM PREMIUM */}
<div
  className="relative z-10 w-full max-w-[440px] px-0 py-2"
  style={{ fontFamily: "'Raleway', sans-serif" }}
>
  {/* HEADER CONTENT */}
  <div className="flex items-center justify-between gap-4">

    {/* LEFT: ICON + BRAND */}
    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

      {/* PREMIUM LOCATION ICON */}
      <div className="relative flex h-[66px] w-[66px] sm:h-[76px] sm:w-[76px] shrink-0 items-center justify-center">

        {/* SOFT GOLD GLOW */}
        <div className="absolute inset-2 rounded-full bg-[#D9A85C]/20 blur-xl" />

        <svg
          width="76"
          height="76"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <defs>
            <linearGradient
              id="premiumGoldHeader"
              x1="10"
              y1="10"
              x2="90"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFF0B0" />
              <stop offset="35%" stopColor="#D9A85C" />
              <stop offset="70%" stopColor="#B98232" />
              <stop offset="100%" stopColor="#F4D58D" />
            </linearGradient>
          </defs>

          {/* OUTER RING */}
          <circle
            cx="50"
            cy="50"
            r="43"
            stroke="url(#premiumGoldHeader)"
            strokeWidth="1.8"
          />

          {/* INNER RING */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#D9A85C"
            strokeOpacity="0.35"
            strokeWidth="0.8"
          />

          {/* LOCATION PIN */}
          <path
            d="M50 18C36.2 18 25 29.2 25 43C25 61 50 78 50 78S75 61 75 43C75 29.2 63.8 18 50 18Z"
            fill="url(#premiumGoldHeader)"
          />

          {/* PIN INNER */}
          <circle
            cx="50"
            cy="42"
            r="12"
            fill="#4B1015"
          />

          {/* PIN CENTER */}
          <circle
            cx="50"
            cy="42"
            r="4"
            fill="#F4D58D"
          />

          {/* DECORATIVE BASE */}
          <path
            d="M25 78C34 70 66 70 75 78"
            stroke="url(#premiumGoldHeader)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M18 83C29 94 71 94 82 83"
            stroke="url(#premiumGoldHeader)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M35 85C43 88 57 88 65 85"
            stroke="#F4D58D"
            strokeOpacity="0.7"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* BRAND + TITLE */}
      <div className="min-w-0 flex flex-col gap-1">

       <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[#D9A85C]">
  MOBILKU PREMIUM AUTO
</span>

        <span className="text-[13px] sm:text-[15px] font-bold uppercase tracking-[-0.02em] text-[#FFF3E0] leading-tight">
          SHOWROOM RESMI
        </span>

        <div className="mt-1 h-px w-12 bg-[#D9A85C]/60" />

      </div>
    </div>

    {/* VERIFIED SHOWROOM ICON */}
    <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center">

      {/* SOFT GLOW */}
      <div className="absolute inset-0 rounded-full bg-[#D9A85C]/10 blur-md" />

      <svg
        width="36"
        height="36"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* SHIELD */}
        <path
          d="M32 6L54 14V30C54 44 44 54 32 59C20 54 10 44 10 30V14L32 6Z"
          stroke="#D9A85C"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* INNER SHIELD */}
        <path
          d="M32 11L49 17V30C49 40.5 41.5 49 32 53.5C22.5 49 15 40.5 15 30V17L32 11Z"
          fill="#D9A85C"
          fillOpacity="0.10"
        />

        {/* CHECK MARK */}
        <path
          d="M21 32L28 39L43 24"
          stroke="#F4D58D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

  </div>

  {/* HORIZONTAL GOLD LINE */}
  <div className="mt-5 h-px w-full bg-gradient-to-r from-[#D9A85C]/70 via-[#D9A85C]/40 to-transparent" />

</div>



             {/* HEADING */}
<div className="mt-10 md:mt-12">

  <p className="mb-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D9A85C]">
    Temukan mobil pilihanmu
  </p>

  <h2
    className="text-[#FBF3E9] text-4xl sm:text-5xl lg:text-[44px] xl:text-[48px] font-semibold leading-[1.08] tracking-[-0.035em]"
    style={{
      fontFamily: "'Raleway', sans-serif",
    }}
  >
    Kunjungi

    <span className="block mt-1 italic font-medium text-[#F4D58D]">
      Showroom Kami
    </span>
  </h2>

  <p className="mt-6 max-w-[350px] text-sm leading-7 text-[#FBEFE7]/75">
    Lihat langsung koleksi mobil pilihan, rasakan kualitasnya,
    dan temukan kendaraan yang sesuai dengan kebutuhan Anda.
  </p>

</div>

              {/* INFORMATION */}
              <div className="mt-7 space-y-4 max-w-[390px]">

                {/* LOCATION */}
                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D9A85C]/30 bg-[#D9A85C]/10 text-[#F4D58D]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#D9A85C]">
                      Lokasi Showroom
                    </p>

                    <p className="mt-1 text-sm leading-5 text-[#FBF3E9] break-words">
                      {alamat}
                    </p>
                  </div>

                </div>

                {/* HOURS */}
                {jamOperasional && (
                  <div className="flex items-start gap-3">

                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D9A85C]/30 bg-[#D9A85C]/10 text-[#F4D58D]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#D9A85C]">
                        Jam Operasional
                      </p>

                      <p className="mt-1 text-sm leading-5 text-[#FBF3E9] break-words">
                        {jamOperasional}
                      </p>
                    </div>

                  </div>
                )}

              </div>

              {/* DIVIDER */}
              <div className="mt-7 mb-6 h-px w-full max-w-[390px] bg-gradient-to-r from-[#D9A85C]/40 to-transparent" />

              {/* BUTTONS */}
              <div className="flex flex-wrap items-center gap-3">

                {/* GOOGLE MAPS */}
                {settings?.alamat && (
                  
                    <a href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#FBF3E9] px-5 py-3 text-xs font-bold text-[#4B0A10] shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-[#F4D58D] hover:-translate-y-0.5"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>

                    <span>Buka di Peta</span>

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8F1117] text-[#FBF3E9] transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                )}

                {/* WHATSAPP */}
                {whatsapp && (
                  
                    <a href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#D9A85C]/60 bg-[#3B0A0F]/60 px-5 py-3 text-xs font-bold text-[#F4D58D] backdrop-blur-md transition-all duration-300 hover:bg-[#D9A85C]/10 hover:border-[#F4D58D] hover:-translate-y-0.5"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5.1A8.5 8.5 0 1 1 21 11.5Z" />
                      <path d="M8.5 8.5c.5-.5 1-.4 1.3.1l.8 1.4c.2.4.1.7-.2 1l-.5.5c.7 1.3 1.7 2.3 3 3l.5-.5c.3-.3.6-.4 1-.2l1.4.8c.5.3.6.8.1 1.3-.5.6-1.3.8-2.1.5-3.8-1.1-6.8-4.1-7.9-7.9-.3-.8-.1-1.6.5-2.1Z" />
                    </svg>

                    <span>WhatsApp</span>
                  </a>
                )}

              </div>

            </div>

          </div>

          
{/* ================= RIGHT MAP ================= */}
<div className="relative flex min-h-[390px] items-center justify-center overflow-hidden bg-[#28070B] p-4 sm:p-6">

  {/* BACKGROUND DECORATIVE GLOW */}
  <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#A5161D]/20 blur-[100px]" />

  <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#D9A85C]/10 blur-[120px]" />

  {/* SUBTLE BACKGROUND LIGHT */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(143,17,23,0.24),transparent_75%)]" />

  {/* INNER LOCATION CARD */}
<div className="relative z-10 w-full max-w-[620px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#3B0A0F] via-[#28070B] to-[#420B11] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-7 lg:p-8">

    {/* CARD TOP GOLD LINE */}
<div className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-[#F4D58D] to-transparent" />

    {/* HEADER */}
    <div className="flex items-center justify-between gap-3">

      {/* LEFT HEADER */}
      <div className="flex min-w-0 items-center gap-3">

        {/* LOCATION ICON */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D9A85C]/40 bg-[#D9A85C]/10 text-[#F4D58D]">

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>

        </div>

        {/* TITLE */}
        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D9A85C]">
  Find Us
</p>

          <h3 className="mt-1 text-base font-semibold tracking-tight text-[#FBF3E9] sm:text-lg">
            Lokasi Showroom
          </h3>

        </div>

      </div>

      {/* PREMIUM LOCATION BADGE */}
<div
  className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border border-[#D9A85C]/80 bg-gradient-to-r from-[#4B1015] via-[#65141B] to-[#3B0A0F] p-[1px] shadow-[0_5px_25px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-[#F4D58D] hover:shadow-[0_0_20px_rgba(217,168,92,0.18)]"
>
  {/* INNER BADGE */}
  <div className="flex items-center gap-2 rounded-full px-2.5 py-1.5 sm:gap-2.5 sm:px-3 sm:py-2">

    {/* LOCATION ICON */}
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D9A85C]/50 bg-[#D9A85C]/10 text-[#F4D58D]">

      {/* SOFT GLOW */}
      <span className="absolute inset-0 rounded-full bg-[#D9A85C]/20 blur-md" />

      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>

    </span>

    {/* LOCATION NAME */}
    <span className="whitespace-nowrap text-[10px] font-bold tracking-[0.01em] text-[#F4D58D] sm:text-[11px]">
      Palembang
    </span>

    {/* ARROW BUTTON */}
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D9A85C]/50 bg-[#D9A85C]/10 text-[12px] text-[#F4D58D] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#D9A85C]/20">
      →
    </span>

  </div>

  {/* HIGHLIGHT LINE */}
  <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF0B0]/80 to-transparent" />

</div>

    </div>

   
{/* SMALL GOLD ACCENT */}
    <div className="mt-4 h-[2px] w-10 rounded-full bg-[#D9A85C]" />

    {/* MAP FRAME */}
    <div className="relative mt-4 overflow-hidden rounded-[18px] border border-[#D9A85C]/70 bg-[#210407] p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.3)]">

      <div
        className={`relative overflow-hidden rounded-[13px] ${


          mapEmbedUrl ? "h-[290px] sm:h-[330px] lg:h-[355px]" : ""
        }`}
      >

        {mapEmbedUrl ? (

          <iframe
            src={mapEmbedUrl}
            title="Lokasi Showroom MobilKu"
            // OpenStreetMap: peta dibuat lebih tinggi dari kotaknya supaya
            // baris tulisan di paling bawah tersembunyi.
            // HP: tulisan jadi 2 baris → potong 48px. Desktop: 1 baris → 28px.
            className={`block w-full border-0 ${
              isOsm
                ? "h-[calc(100%+48px)] sm:h-[calc(100%+28px)]"
                : "h-full"
            }`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

        ) : (

          <div className="flex h-[265px] items-center justify-center bg-[#4B1015] px-6 text-center sm:h-[300px] lg:h-[315px]">

            <div>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D9A85C]/40 bg-[#D9A85C]/10 text-[#F4D58D]">

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>

              </div>

              <p className="mt-4 text-sm font-semibold text-[#FBF3E9]">
                Peta belum diatur
              </p>

              <p className="mt-1 text-xs text-[#FBF3E9]/50">
                Silakan atur lokasi showroom melalui pengaturan.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

    {/* MAP FOOTER */}
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#D9A85C]/25 pt-4">

      {/* LOCATION DESCRIPTION */}
      <div className="flex min-w-0 items-center gap-2.5">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9A85C]/35 bg-[#D9A85C]/10 text-[#F4D58D]">

          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>

        </div>

        <p className="text-[10px] leading-4 text-[#FBF3E9]/65 sm:text-[11px]">

          Temukan lokasi kami

          <span className="block text-[#F4D58D]">
            Mudah dijangkau
          </span>

        </p>

      </div>
{/* MAP LINK + KETERANGAN SUMBER PETA */}
      <div className="flex shrink-0 flex-col items-end gap-1">

        {settings?.alamat && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#F4D58D] transition-all duration-300 hover:text-white sm:text-[11px]"
          >
            <span>Lihat Peta</span>
            <span className="text-sm">↗</span>
          </a>
        )}

        {/* ← BARU: keterangan sumber (wajib untuk OpenStreetMap) */}
        {isOsm && (
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="text-[9px] text-[#FBF3E9]/45 transition-colors hover:text-[#F4D58D] sm:text-[10px]"
          >
            Peta © <span className="text-[#F4D58D]/75">OpenStreetMap</span>
          </a>
        )}

      </div>

    </div>

  </div>

</div>



        {/* BOTTOM ACCENT */}
        <div className="h-[4px] bg-gradient-to-r from-[#5F0A0D] via-[#D9A85C] to-[#5F0A0D]" />

      </div>
      </div>
    </section>
  );
};

export default ShowroomMap;