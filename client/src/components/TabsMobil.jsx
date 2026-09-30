import { useState } from "react";

function TabsMobil({ mobil }) {
  const [activeTab, setActiveTab] = useState("info");

  const spesifikasiList = [
    { label: "Tahun", value: mobil.tahun },
    {
      label: "Kilometer",
      value: mobil.kilometer
        ? `${Number(mobil.kilometer).toLocaleString("id-ID")} KM`
        : "-",
    },
    { label: "Transmisi", value: mobil.transmisi || "-" },
    { label: "Bahan Bakar", value: mobil.bahanBakar || "-" },
    {
      label: "Kapasitas Mesin",
      value: mobil.kapasitasMesin ? `${mobil.kapasitasMesin} cc` : "-",
    },
    { label: "Warna", value: mobil.warna || "-" },
    { label: "Merek", value: mobil.merek },
    { label: "Kategori", value: mobil.category?.name },
    { label: "Stok", value: `${mobil.stok} unit tersedia` },
  ];

  const keunggulanList = [
    "Pajak aktif",
    "Dokumen lengkap",
    "Kondisi mesin baik",
    "Interior bersih",
    "Siap digunakan",
    "Surat-surat lengkap",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md mt-6 overflow-hidden">
      <div className="flex border-b border-gray-100 px-6 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("info")}
          className={`py-4 text-sm font-bold border-b-2 whitespace-nowrap ${
            activeTab === "info"
             ? "text-[#8f1117] border-[#8f1117]"
              : "text-gray-400 border-transparent"
          }`}
        >
          Informasi Utama
        </button>
        <button
          onClick={() => setActiveTab("spesifikasi")}
          className={`py-4 text-sm font-bold border-b-2 whitespace-nowrap ${
            activeTab === "spesifikasi"
             ? "text-[#8f1117] border-[#8f1117]"
              : "text-gray-400 border-transparent"
          }`}
        >
          Spesifikasi
        </button>
        <button
          onClick={() => setActiveTab("deskripsi")}
          className={`py-4 text-sm font-bold border-b-2 whitespace-nowrap ${
            activeTab === "deskripsi"
              ? "text-[#8f1117] border-[#8f1117]"
              : "text-gray-400 border-transparent"
          }`}
        >
          Deskripsi
        </button>
      </div>
      <div className="p-6">
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6">
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">
                Spesifikasi Mobil
              </p>
              <div className="grid grid-cols-2 gap-3">
                {spesifikasiList.map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3.5">
                    <div className="text-[10.5px] text-gray-400 font-semibold uppercase">
                      {item.label}
                    </div>
                    <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4.5">
              <p className="text-sm font-bold text-gray-700 mb-3">
                Keunggulan Mobil
              </p>
              <ul className="space-y-2 mb-3">
                {keunggulanList.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[13px] text-gray-700 font-semibold"
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
                            <div className="bg-[#8f1117]/8 border border-[#8f1117]/15 rounded-lg px-3 py-2.5 text-[11px] text-[#8f1117] font-semibold leading-relaxed">
                ⓘ Mobil ini telah melalui inspeksi dan pengecekan kondisi oleh
                tim kami.
              </div>
            </div>
          </div>
        )}
        {activeTab === "spesifikasi" && (
          <>
            <p className="text-sm font-bold text-gray-700 mb-3">
              Detail Spesifikasi
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {spesifikasiList.map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3.5">
                  <div className="text-[10.5px] text-gray-400 font-semibold uppercase">
                    {item.label}
                  </div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === "deskripsi" && (
          <>
            <p className="text-sm font-bold text-gray-700 mb-3">
              Deskripsi Mobil
            </p>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              {mobil.deskripsi}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default TabsMobil;
