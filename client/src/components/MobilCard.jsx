import { useState, useEffect } from "react"; // ← BARU (scroll): tambah useEffect
import { createPortal } from "react-dom"; // ← BARU
import { Link, useNavigate, useLocation, useNavigationType } from "react-router-dom"; // ← BARU (scroll): tambah useLocation, useNavigationType
import { FaArrowRight } from "react-icons/fa";

// ← BARU (scroll): kunci penyimpanan posisi scroll sebelum buka detail
const KUNCI_SCROLL = "posisiScrollSebelumDetail";

// ← BARU (scroll): penanda supaya hanya SATU kartu yang menjalankan
// proses pengembalian posisi (kartu di halaman ada banyak)
let sedangMengembalikan = false;

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
  // ← BARU: loading spinner saat kartu / "Lihat Detail" diklik
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ← BARU (scroll)
  const jenisNavigasi = useNavigationType(); // ← BARU (scroll): "POP" = tombol kembali

  // ← BARU (scroll): saat user KEMBALI dari halaman detail, cari lagi kartu
  // yang tadi diklik, lalu geser halaman sampai kartu itu ada di posisi
  // yang sama di layar seperti sebelum diklik
  useEffect(() => {
    let simpanan = null;
    try {
      simpanan = JSON.parse(sessionStorage.getItem(KUNCI_SCROLL) || "null");
    } catch {
      simpanan = null;
    }

    const halamanIni = location.pathname + location.search;
    if (!simpanan || simpanan.halaman !== halamanIni) return;

    // Bukan lewat tombol kembali → posisi lama tidak dipakai
    if (jenisNavigasi !== "POP") {
      sessionStorage.removeItem(KUNCI_SCROLL);
      return;
    }

    // Sudah ada kartu lain yang sedang mengembalikan posisi
    if (sedangMengembalikan) return;
    sedangMengembalikan = true;

    const geserKe = (top) =>
      window.scrollTo({ top, left: 0, behavior: "instant" });

    // Data mobil diambil dari server dulu, jadi kartu bisa baru muncul
    // beberapa detik kemudian. Tunggu kartunya muncul (maks 15 detik),
    // lalu geser sampai posisinya pas. Diulang beberapa kali karena gambar
    // dan bagian lain di atasnya juga muncul bertahap.
    let waktu = 0; // dalam milidetik
    let ketemuSejak = null;
    let stabil = 0;
    const timer = setInterval(() => {
      waktu += 100;

      const semuaKartu = document.querySelectorAll(
        `[data-mobil-id="${simpanan.id}"]`
      );
      const kartu = semuaKartu[simpanan.urutan] || semuaKartu[0];

      if (!kartu) {
        // Kartu belum muncul → tunggu. Kalau terlalu lama, pakai posisi lama.
        if (waktu >= 15000) {
          geserKe(simpanan.y);
          selesai();
        }
        return;
      }

      if (ketemuSejak === null) ketemuSejak = waktu;

      const selisih = kartu.getBoundingClientRect().top - simpanan.jarakAtas;
      if (Math.abs(selisih) > 3) {
        geserKe(window.scrollY + selisih);
        stabil = 0;
      } else {
        stabil++;
      }

      // Selesai kalau posisi sudah pas selama ±1 detik,
      // atau sudah 5 detik sejak kartu muncul
      if (stabil >= 10 || waktu - ketemuSejak >= 5000) selesai();
    }, 100);

    // Hentikan pengecekan (dipanggil juga saat komponen dilepas)
    function berhenti() {
      clearInterval(timer);
      window.removeEventListener("touchstart", selesai);
      window.removeEventListener("wheel", selesai);
      sedangMengembalikan = false;
    }

    // Benar-benar selesai → hapus posisi yang disimpan.
    // (Posisi TIDAK dihapus di awal, karena saat mode pengembangan React
    // menjalankan kode ini dua kali — itu penyebab posisi tadi hilang.)
    function selesai() {
      berhenti();
      sessionStorage.removeItem(KUNCI_SCROLL);
    }

    // Kalau user sudah menggeser layar sendiri, jangan dipaksa lagi
    window.addEventListener("touchstart", selesai, { passive: true });
    window.addEventListener("wheel", selesai, { passive: true });

    return berhenti;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keDetail = (e) => {
    // Ctrl/Cmd + klik (buka tab baru) tetap berjalan normal
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;

    e.preventDefault();

    // ← BARU (scroll): simpan kartu mana yang diklik & posisinya di layar
    const kartu = e.currentTarget;
    const semuaKartu = Array.from(
      document.querySelectorAll(`[data-mobil-id="${id}"]`)
    );
    sessionStorage.setItem(
      KUNCI_SCROLL,
      JSON.stringify({
        halaman: location.pathname + location.search,
        y: window.scrollY,
        id: String(id),
        urutan: Math.max(0, semuaKartu.indexOf(kartu)),
        jarakAtas: kartu.getBoundingClientRect().top,
      })
    );

    setIsNavigating(true);
    setTimeout(() => {
      navigate(`/mobil/${id}`);
      setIsNavigating(false);
    }, 400);
  };

  return (
    <>{/* ← BARU: pembungkus */}
    <Link
      to={`/mobil/${id}`}
      onClick={keDetail} // ← BARU
      data-mobil-id={id} // ← BARU (scroll): penanda kartu
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

      {/* ← BARU: LOADING SPINNER (ditaruh langsung di body supaya menutupi layar penuh) */}
      {isNavigating &&
        createPortal(
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>,
          document.body
        )}
    </>
  );
}

export default MobilCard;