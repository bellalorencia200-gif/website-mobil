import {
  FaCarSide,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";

const statistik = [
  {
    angka: "500+",
    judul: "MOBIL TERJUAL",
    deskripsi: "Pilihan terpercaya untuk perjalanan Anda",
    Icon: FaCarSide,
  },
  {
    angka: "5 Tahun",
    judul: "BEROPERASI",
    deskripsi: "Pengalaman dan komitmen berkelanjutan",
    Icon: FaCalendarAlt,
  },
  {
    angka: "1000+",
    judul: "PELANGGAN PUAS",
    deskripsi: "Membangun hubungan penuh kepercayaan",
    Icon: FaUsers,
  },
  {
    angka: "100%",
    judul: "MOBIL BERKUALITAS",
    deskripsi: "Pemeriksaan kendaraan secara menyeluruh",
    Icon: FaShieldAlt,
  },
];

function TrustStats() {
  return (
    <section className="w-full bg-[radial-gradient(circle_at_15%_20%,rgba(201,164,92,0.08),transparent_35%),#F7F3ED] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* STATISTICS CARD */}
        <div className="relative overflow-hidden rounded-[28px] border border-[#c9a45c]/80 bg-gradient-to-br from-[#250104] via-[#50070d] to-[#280205] shadow-[0_20px_60px_-25px_rgba(80,0,10,0.65)]">

          {/* DECORATIVE GLOW */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#d8a94b]/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#d8a94b]/10 blur-3xl" />

          {/* GOLD TOP ACCENT */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f5d58a] to-transparent" />

          {/* CORNER ACCENTS */}
          <div className="pointer-events-none absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-[#e5c77e] opacity-80" />

          <div className="pointer-events-none absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-[#e5c77e] opacity-80" />

          {/* HEADER */}
          <div className="relative px-5 pb-6 pt-8 text-center sm:px-8 sm:pt-9">

            <div className="flex items-center justify-center gap-3">

              <span className="h-px w-10 bg-[#c9a45c] sm:w-20" />

             <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-[#e5c77e] sm:text-xs">
  Kepercayaan MobilKu
</p>

              <span className="h-px w-10 bg-[#c9a45c] sm:w-20" />

            </div>

            <h2 className="mt-4 font-serif text-2xl font-semibold leading-[1.25] tracking-[-0.02em] text-[#f8e4b4] sm:text-3xl lg:text-[32px]">
  Angka yang Membuktikan,
  <br className="hidden sm:block" />
  <span className="text-[#f5d58a]">
    Bukan Sekadar Janji
  </span>
</h2>

          </div>

          {/* STATISTICS GRID */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

            {statistik.map((item, index) => {
              const Icon = item.Icon;

              return (
                <div
                  key={item.judul}
                  className={`group relative flex items-center gap-4 px-6 py-7 transition duration-300 hover:bg-white/[0.035] sm:px-7 lg:gap-4 lg:px-5 lg:py-8 ${
                    index < 3
                      ? "border-b border-[#c9a45c]/30 sm:border-b-0"
                      : ""
                  } ${
                    index % 2 === 0
                      ? "sm:border-r sm:border-[#c9a45c]/30 lg:border-r-0"
                      : ""
                  } ${
                    index < 3
                      ? "lg:border-r lg:border-[#c9a45c]/30"
                      : ""
                  }`}
                >

                  {/* ICON */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#e5c77e] bg-[#3d060a] text-[#f5d58a] shadow-[0_0_22px_rgba(229,199,126,0.14)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(229,199,126,0.25)]">

                    <Icon className="text-2xl" />

                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">

                   <h3 className="font-serif text-[32px] font-semibold leading-none tracking-[-0.035em] text-[#f5d58a] sm:text-[36px] lg:text-[38px]">

  {item.angka}

</h3>

                    {/* TITLE */}
                    <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-[0.13em] text-[#fff7e6] sm:text-[11px] sm:tracking-[0.15em]">

  {item.judul}

</p>

                    {/* GOLD LINE */}
                    <div className="my-3 h-px w-9 bg-gradient-to-r from-[#f5d58a] to-transparent" />

                    <p className="max-w-[190px] font-sans text-[12px] font-medium leading-[1.8] tracking-[-0.01em] text-[#e8cfc5] sm:text-[13px]">

  {item.deskripsi}

</p>

                  </div>

                </div>
              );
            })}

          </div>

          {/* BOTTOM ACCENT */}
          <div className="relative h-1 bg-gradient-to-r from-transparent via-[#d8b36a] to-transparent opacity-80" />

        </div>

      </div>
    </section>
  );
}

export default TrustStats;