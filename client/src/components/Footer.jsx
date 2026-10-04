import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useSettings from "../hooks/useSettings.js";


function Footer() {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const { linkWa } = useSettings();
  const handleClick = (path) => (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 400);
  };
  return (
    <footer className="footer sm:footer-horizontal bg-gradient-to-br from-[#250104] via-[#50070d] to-[#280205] text-white p-10">
      <nav>
        <h6 className="footer-title text-red-200">Layanan</h6>
        <Link
          to="/katalog"
          onClick={handleClick("/katalog")}
          className="link link-hover hover:text-red-200 transition"
        >
          Beli Mobil
        </Link>
        <Link
          to="/jual-mobil"
          onClick={handleClick("/jual-mobil")}
          className="link link-hover hover:text-red-200 transition"
        >
          Jual Mobil
        </Link>

        <a
          href={linkWa}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover hover:text-red-200 transition"
        >
          Cek Harga
        </a>

        <a
          href={linkWa}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover hover:text-red-200 transition"
        >
          Simulasi Kredit
        </a>
      </nav>
      <nav>
        <h6 className="footer-title">Perusahaan</h6>
        <Link
          to="/tentang-kami"
          onClick={handleClick("/tentang-kami")}
          className="link link-hover hover:text-red-200 transition"
        >
          Tentang Kami
        </Link>

        <a
          href={linkWa}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover hover:text-red-200 transition"
        >
          Hubungi Kami
        </a>

        <a
          href={linkWa}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover hover:text-red-200 transition"
        >
          Karir
        </a>
      </nav>

      <nav>
        <h6 className="footer-title">Bantuan</h6>
        <a className="link link-hover hover:text-red-200 transition">FAQ</a>
        <a className="link link-hover hover:text-red-200 transition">S&K</a>
        <a className="link link-hover hover:text-red-200 transition">Privasi</a>
      </nav>

      <nav>
        <h6 className="footer-title text-red-200">Cari Berdasarkan Merek</h6>
        <Link
          to="/katalog?merek=Toyota"
          onClick={handleClick("/katalog?merek=Toyota")}
          className="link link-hover hover:text-red-200 transition"
        >
          Toyota
        </Link>
        <Link
          to="/katalog?merek=Mitsubishi"
          onClick={handleClick("/katalog?merek=Mitsubishi")}
          className="link link-hover hover:text-red-200 transition"
        >
          Mitsubishi
        </Link>
        <Link
          to="/katalog?merek=Suzuki"
          onClick={handleClick("/katalog?merek=Suzuki")}
          className="link link-hover hover:text-red-200 transition"
        >
          Suzuki
        </Link>
        <Link
          to="/katalog?merek=Hyundai"
          onClick={handleClick("/katalog?merek=Hyundai")}
          className="link link-hover hover:text-red-200 transition"
        >
          Hyundai
        </Link>
        <Link
          to="/katalog?merek=Chevrolet"
          onClick={handleClick("/katalog?merek=Chevrolet")}
          className="link link-hover hover:text-red-200 transition"
        >
          Chevrolet
        </Link>
      </nav>

      <form>
        <h6 className="footer-title">Newsletter</h6>
        <fieldset className="w-80">
          <label>Enter your email address</label>
          <div className="join">
            <input
              type="text"
              placeholder="username@site.com"
              className="input join-item"
            />
            <button className="btn btn-primary join-item">Subscribe</button>
          </div>
        </fieldset>
      </form>
      {isNavigating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
    </footer>
  );
}
export default Footer;
