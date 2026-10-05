import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

import {
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
  FaFacebookF,
} from "react-icons/fa";

import useSettings from "../hooks/useSettings.js";

import playstore from "../assets/playstore.webp";
import appstore from "../assets/appstore.webp";

function Footer() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [settings, setSettings] = useState({});

  const navigate = useNavigate();
  const { linkWa } = useSettings();

  // ======================================================
  // AMBIL SETTINGS DARI ADMIN PANEL
  // ======================================================
  useEffect(() => {
    axios
      .get("/api/settings")
      .then((response) => {
        setSettings(response.data.settings || {});
      })
      .catch((error) => {
        console.log("Gagal mengambil settings footer:", error);
        setSettings({});
      });
  }, []);

  // ======================================================
  // BUAT LINK DARI SETTINGS
  // ======================================================
  const buatLink = (kunci) => {
    const nilai = String(settings?.[kunci] || "").trim();

    if (!nilai) return "";

    // WhatsApp
    if (kunci === "whatsapp") {
      const nomor = nilai
        .replace(/\D/g, "")
        .replace(/^0/, "62");

      return nomor ? `https://wa.me/${nomor}` : "";
    }

    // URL biasa
    return /^https?:\/\//i.test(nilai)
      ? nilai
      : `https://${nilai}`;
  };

  // ======================================================
  // LINK MEDIA SOSIAL
  // ======================================================
  const facebookUrl = buatLink("facebookUrl");
  const instagramUrl = buatLink("instagramUrl");
  const telegramUrl = buatLink("telegramUrl");

  // Kalau WhatsApp dari settings tidak ada,
  // gunakan linkWa dari useSettings sebagai fallback
  const whatsappUrl = buatLink("whatsapp") || linkWa || "";

  // ======================================================
  // LINK APP STORE
  // ======================================================
  const appstoreUrl = buatLink("appStoreUrl");
  const playstoreUrl = buatLink("playStoreUrl");

  // ======================================================
  // HANDLE NAVIGASI
  // ======================================================
  const handleClick = (path) => (e) => {
    e.preventDefault();

    setIsNavigating(true);

    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 400);
  };

  // ======================================================
  // HANDLE APP STORE / PLAY STORE
  // Kalau URL belum ada, gambar tetap ditampilkan tetapi
  // tidak diarahkan ke halaman kosong.
  // ======================================================
  const handleExternalLink = (url) => (e) => {
    if (!url) {
      e.preventDefault();
    }
  };

  return (
    <footer
      className="
        bg-gradient-to-br
        from-[#250104]
        via-[#50070d]
        to-[#280205]
        text-white
      "
    >

      {/* =====================================================
          BAGIAN UTAMA FOOTER
      ===================================================== */}
      <div className="max-w-7xl mx-auto">

        <div
          className="
            footer
            sm:footer-horizontal
            p-6
            sm:p-8
            md:p-10
          "
        >

          {/* =================================================
              LAYANAN
          ================================================= */}
          <nav>
            <h6 className="footer-title text-red-200">
              Layanan
            </h6>

            <Link
              to="/katalog"
              onClick={handleClick("/katalog")}
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Beli Mobil
            </Link>

            <Link
              to="/jual-mobil"
              onClick={handleClick("/jual-mobil")}
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Jual Mobil
            </Link>

            <a
              href={linkWa}
              target="_blank"
              rel="noopener noreferrer"
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Cek Harga
            </a>

            <a
              href={linkWa}
              target="_blank"
              rel="noopener noreferrer"
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Simulasi Kredit
            </a>
          </nav>


          {/* =================================================
              PERUSAHAAN
          ================================================= */}
          <nav>
            <h6 className="footer-title">
              Perusahaan
            </h6>

            <Link
              to="/tentang-kami"
              onClick={handleClick("/tentang-kami")}
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Tentang Kami
            </Link>

            <a
              href={linkWa}
              target="_blank"
              rel="noopener noreferrer"
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Hubungi Kami
            </a>

            <a
              href={linkWa}
              target="_blank"
              rel="noopener noreferrer"
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Karir
            </a>
          </nav>


          {/* =================================================
              BANTUAN
          ================================================= */}
          <nav>
            <h6 className="footer-title">
              Bantuan
            </h6>

            <a
              href="#"
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              FAQ
            </a>

            <a
              href="#"
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              S&K
            </a>

            <a
              href="#"
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Privasi
            </a>
          </nav>


          {/* =================================================
              CARI BERDASARKAN MEREK
          ================================================= */}
          <nav>
            <h6 className="footer-title text-red-200">
              Cari Berdasarkan Merek
            </h6>

            <Link
              to="/katalog?merek=Toyota"
              onClick={handleClick("/katalog?merek=Toyota")}
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Toyota
            </Link>

            <Link
              to="/katalog?merek=Mitsubishi"
              onClick={handleClick("/katalog?merek=Mitsubishi")}
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Mitsubishi
            </Link>

            <Link
              to="/katalog?merek=Suzuki"
              onClick={handleClick("/katalog?merek=Suzuki")}
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Suzuki
            </Link>

            <Link
              to="/katalog?merek=Hyundai"
              onClick={handleClick("/katalog?merek=Hyundai")}
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Hyundai
            </Link>

            <Link
              to="/katalog?merek=Chevrolet"
              onClick={handleClick("/katalog?merek=Chevrolet")}
              className="
                link
                link-hover
                hover:text-red-200
                transition-colors
                duration-200
              "
            >
              Chevrolet
            </Link>
          </nav>


          {/* =================================================
              NEWSLETTER
          ================================================= */}
          <form
            className="w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <h6 className="footer-title">
              Newsletter
            </h6>

            <fieldset className="w-full max-w-sm">

              <label className="text-sm text-white/70">
                Dapatkan informasi terbaru MobilKu
              </label>

              <div className="join mt-3 w-full">

                <input
                  type="email"
                  placeholder="Email kamu"
                  className="
                    input
                    join-item
                    w-full
                    bg-white
                    text-gray-800
                    placeholder:text-gray-400
                    border-0
                    focus:outline-none
                    focus:ring-0
                  "
                />

                <button
                  type="submit"
                  className="
                    btn
                    join-item
                    bg-[#D9A85C]
                    border-[#D9A85C]
                    text-[#250104]
                    hover:bg-[#c8954c]
                    hover:border-[#c8954c]
                    font-semibold
                    transition-all
                    duration-200
                  "
                >
                  Subscribe
                </button>

              </div>
            </fieldset>
          </form>

        </div>
      </div>


      {/* =====================================================
          DOWNLOAD APLIKASI + SOCIAL MEDIA
      ===================================================== */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          sm:px-8
          md:px-10
          pb-8
        "
      >

        <div
          className="
            border-t
            border-white/10
            pt-7
            md:pt-8
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-8
              lg:gap-12
            "
          >

            {/* =================================================
                DOWNLOAD APLIKASI
            ================================================= */}
            <div className="w-full lg:max-w-xl">

              <h3
                className="
                  text-lg
                  md:text-xl
                  font-semibold
                  text-white
                "
              >
                Download Aplikasi MobilKu
              </h3>

              <p
                className="
                  text-sm
                  text-white/60
                  mt-1
                  mb-4
                  max-w-md
                  leading-relaxed
                "
              >
                Temukan mobil impianmu dengan lebih mudah
                melalui aplikasi MobilKu.
              </p>


              {/* =================================================
                  APP STORE + GOOGLE PLAY
              ================================================= */}
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  sm:gap-3
                  flex-wrap
                "
              >

                {/* =================================================
                    GOOGLE PLAY
                ================================================= */}
                <a
                  href={playstoreUrl || "#"}
                  target={playstoreUrl ? "_blank" : undefined}
                  rel={
                    playstoreUrl
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={handleExternalLink(playstoreUrl)}
                  aria-label="Download MobilKu di Google Play"
                  className="
                    inline-flex
                    rounded-lg
                    overflow-hidden
                    transition-all
                    duration-300
                    hover:scale-[1.03]
                    hover:-translate-y-0.5
                    active:scale-95
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#D9A85C]/60
                  "
                >
                  <img
                    src={playstore}
                    alt="Download di Google Play"
                    className="
                      h-9
                      xs:h-10
                      sm:h-11
                      md:h-12
                      w-auto
                      max-w-[145px]
                      sm:max-w-[165px]
                      object-contain
                      block
                    "
                  />
                </a>


                {/* =================================================
                    APP STORE
                ================================================= */}
                <a
                  href={appstoreUrl || "#"}
                  target={appstoreUrl ? "_blank" : undefined}
                  rel={
                    appstoreUrl
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={handleExternalLink(appstoreUrl)}
                  aria-label="Download MobilKu di App Store"
                  className="
                    inline-flex
                    rounded-lg
                    overflow-hidden
                    transition-all
                    duration-300
                    hover:scale-[1.03]
                    hover:-translate-y-0.5
                    active:scale-95
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#D9A85C]/60
                  "
                >
                  <img
                    src={appstore}
                    alt="Download di App Store"
                    className="
                      h-9
                      xs:h-10
                      sm:h-11
                      md:h-12
                      w-auto
                      max-w-[145px]
                      sm:max-w-[165px]
                      object-contain
                      block
                    "
                  />
                </a>

              </div>

            </div>


            {/* =================================================
                SOCIAL MEDIA
            ================================================= */}
            <div
              className="
                w-full
                lg:w-auto
                lg:text-right
              "
            >

              <h3
                className="
                  text-lg
                  md:text-xl
                  font-semibold
                  text-white
                "
              >
                Ikuti Kami
              </h3>

              <p
                className="
                  text-sm
                  text-white/60
                  mt-1
                  mb-4
                  max-w-sm
                  lg:ml-auto
                "
              >
                Temukan informasi terbaru dan promo menarik MobilKu
              </p>


              {/* =================================================
                  SOCIAL ICONS
              ================================================= */}
              <div
                className="
                  flex
                  flex-wrap
                  lg:justify-end
                  gap-2.5
                  sm:gap-3
                "
              >

                {/* =================================================
                    INSTAGRAM
                ================================================= */}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram MobilKu"
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      rounded-full
                      bg-white/10
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-white
                      hover:bg-[#E1306C]
                      hover:border-[#E1306C]
                      hover:scale-105
                      hover:-translate-y-0.5
                      transition-all
                      duration-300
                    "
                  >
                    <FaInstagram size={18} />
                  </a>
                )}


                {/* =================================================
                    TELEGRAM
                ================================================= */}
                {telegramUrl && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram MobilKu"
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      rounded-full
                      bg-white/10
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-white
                      hover:bg-[#229ED9]
                      hover:border-[#229ED9]
                      hover:scale-105
                      hover:-translate-y-0.5
                      transition-all
                      duration-300
                    "
                  >
                    <FaTelegramPlane size={17} />
                  </a>
                )}


                {/* =================================================
                    WHATSAPP
                ================================================= */}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp MobilKu"
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      rounded-full
                      bg-white/10
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-white
                      hover:bg-[#25D366]
                      hover:border-[#25D366]
                      hover:scale-105
                      hover:-translate-y-0.5
                      transition-all
                      duration-300
                    "
                  >
                    <FaWhatsapp size={18} />
                  </a>
                )}


                {/* =================================================
                    FACEBOOK
                ================================================= */}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook MobilKu"
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      rounded-full
                      bg-white/10
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-white
                      hover:bg-[#1877F2]
                      hover:border-[#1877F2]
                      hover:scale-105
                      hover:-translate-y-0.5
                      transition-all
                      duration-300
                    "
                  >
                    <FaFacebookF size={16} />
                  </a>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          COPYRIGHT
      ===================================================== */}
      <div className="border-t border-white/10">

        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            sm:px-8
            md:px-10
            py-5
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-2
            text-xs
            md:text-sm
            text-white/50
            text-center
            md:text-left
          "
        >

          <p>
            © 2026 MobilKu. Semua hak dilindungi.
          </p>

          <p>
            Solusi mobil bekas berkualitas dan terpercaya.
          </p>

        </div>

      </div>


      {/* =====================================================
          LOADING NAVIGASI
      ===================================================== */}
      {isNavigating && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            backdrop-blur-[2px]
            flex
            items-center
            justify-center
            z-[9999]
          "
        >
          <span
            className="
              loading
              loading-spinner
              loading-lg
              text-white
            "
          ></span>
        </div>
      )}

    </footer>
  );
}

export default Footer;