import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom"; // ← BARU: tambah useNavigationType

function ScrollToTop() {
  const { pathname } = useLocation();
  const jenisNavigasi = useNavigationType(); // ← BARU: "POP" = tombol Kembali / Maju

  useEffect(() => {
    // ← BARU: kalau user menekan Kembali, jangan paksa ke atas
    // (posisi lama dikembalikan oleh MobilCard)
    if (jenisNavigasi === "POP") return;

    window.scrollTo(0, 0);
  }, [pathname, jenisNavigasi]);

  return null;
}
export default ScrollToTop;