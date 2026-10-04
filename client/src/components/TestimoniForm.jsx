import { useState } from "react";
import axios from "../api/axiosInstance";

const TestimoniForm = ({ compact = false }) => {
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [komentar, setKomentar] = useState("");
  const [rating, setRating] = useState(5);
  const [mobilDibeli, setMobilDibeli] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [berhasilKirim, setBerhasilKirim] = useState(false);

  // ← BARU: loading spinner saat tombol "Tulis Testimoni Anda" diklik
  const [isMembuka, setIsMembuka] = useState(false);

  const bukaModal = () => {
    setIsMembuka(true);
    setTimeout(() => {
      setModalTerbuka(true);
      setIsMembuka(false);
    }, 400);
  };

  const tutupModal = () => {
    setModalTerbuka(false);
    setBerhasilKirim(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!namaPelanggan || !komentar) {
      alert("Nama dan cerita pengalaman wajib di isi");
      return;
    }

    const formData = new FormData();
    formData.append("namaPelanggan", namaPelanggan);
    formData.append("komentar", komentar);
    formData.append("rating", rating);
    formData.append("mobilDibeli", mobilDibeli);
    formData.append("lokasi", lokasi);

    setIsSubmitting(true);

    axios
      .post("/api/testimoni", formData)
      .then(() => {
        setBerhasilKirim(true);
        setNamaPelanggan("");
        setKomentar("");
        setRating(5);
        setMobilDibeli("");
        setLokasi("");
        setIsSubmitting(false);
      })
      .catch((error) => {
        alert(
          error.response?.data?.message || "gagal mengirim testimoni, coba lagi",
        );
        setIsSubmitting(false);
      });
  };

  return (
    <>
      {/* Tombol kecil trigger form */}
      <div className={compact ? "flex justify-center" : "flex justify-center my-8"}>
        <button
          onClick={bukaModal} // ← BARU
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#D9A85C] text-[#8B1E24] font-bold text-sm px-6 py-2.5 hover:bg-[#D9A85C]/10 transition"
        >
          + Tulis Testimoni Anda
        </button>
      </div>

      {/* Modal Form */}
      {modalTerbuka && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={tutupModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[#D9A85C]/25 p-6 md:p-9">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#D9A85C] to-transparent" />

            <button
              onClick={tutupModal}
              aria-label="Tutup"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-lg hover:bg-gray-200 transition"
            >
              &times;
            </button>

            {berhasilKirim ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[#D9A85C]/15 flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B8823E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
                  Terima kasih!
                </h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Testimoni Anda sudah kami terima dan akan tampil di halaman
                  ini setelah disetujui oleh tim kami.
                </p>
                <button
                  onClick={tutupModal}
                  className="mt-5 text-sm font-semibold text-[#8B1E24] hover:underline"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-xl md:text-2xl font-medium text-gray-900 text-center mb-1 pr-6">
                  Bagikan Pengalaman Anda
                </h3>
                <p className="text-xs text-gray-500 text-center mb-6">
                  Testimoni akan ditinjau tim kami sebelum tampil publik.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[#2A0508] mb-1.5">
                      Nama Lengkap <span className="text-[#8B1E24]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kristian Saputra"
                      value={namaPelanggan}
                      onChange={(e) => setNamaPelanggan(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9A85C]/40 focus:border-[#D9A85C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[#2A0508] mb-1.5">
                      Beri Rating Anda <span className="text-[#8B1E24]">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((bintang) => (
                        <button
                          type="button"
                          key={bintang}
                          onClick={() => setRating(bintang)}
                          aria-label={`Beri rating ${bintang}`}
                        >
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill={bintang <= rating ? "#D9A85C" : "none"}
                            stroke="#D9A85C"
                            strokeWidth="1.5"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                      <span className="text-xs text-gray-400 ml-2">
                        ({rating}/5 dipilih)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-[#2A0508] mb-1.5">
                        Mobil yang Dibeli
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Avanza 2022"
                        value={mobilDibeli}
                        onChange={(e) => setMobilDibeli(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9A85C]/40 focus:border-[#D9A85C]"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        Opsional
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-[#2A0508] mb-1.5">
                        Lokasi Anda
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Depok, Jawa Barat"
                        value={lokasi}
                        onChange={(e) => setLokasi(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9A85C]/40 focus:border-[#D9A85C]"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        Opsional
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[#2A0508] mb-1.5">
                      Ceritakan Pengalaman Anda{" "}
                      <span className="text-[#8B1E24]">*</span>
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Bagaimana pengalaman Anda membeli mobil di showroom kami?"
                      value={komentar}
                      onChange={(e) => setKomentar(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9A85C]/40 focus:border-[#D9A85C] resize-none"
                    />
                  </div>


                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#8B1E24] to-[#5c1216] text-white font-bold text-sm py-3.5 tracking-wide shadow-lg hover:shadow-xl transition disabled:opacity-60"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Testimoni"}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center -mt-1">
                    Dengan mengirim, Anda menyetujui testimoni ini dapat
                    ditampilkan di website kami.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ← BARU: LOADING SPINNER SAAT KLIK "TULIS TESTIMONI ANDA" */}
      {isMembuka && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
    </>
  );
};

export default TestimoniForm;