import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import CropModal from "./CropModal.jsx";

const bacaSebagaiDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const KelolaMobil = () => {
  const [dataMobil, setDataMobil] = useState([]);
  const [dataKategori, setDataKategori] = useState([]);
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tahun, setTahun] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [imagesAsli, setImagesAsli] = useState([]);
  const [fotoLama, setFotoLama] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hapusLoading, setHapusLoading] = useState(false);
  const [bukaTambahLoading, setBukaTambahLoading] = useState(false);
  const [merek, setMerek] = useState("");
  const [kilometer, setKilometer] = useState("");
  const [transmisi, setTransmisi] = useState("");
  const [bahanBakar, setBahanBakar] = useState("");
  const [kapasitasMesin, setKapasitasMesin] = useState("");
  const [warna, setWarna] = useState("");
  const [isPromo, setIsPromo] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropIndex, setCropIndex] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  useEffect(() => {
    axios.get("/api/mobil").then((response) => {
      setDataMobil(response.data.mobil);
      setIsLoading(false);
    });

    axios.get("/api/categories").then((response) => {
      setDataKategori(response.data.categories);
    });
  }, []);

  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (images.length === 0) {
      setPreviewUrls([]);
      return;
    }
    let dibatalkan = false;
    Promise.all(images.map(bacaSebagaiDataUrl)).then((hasil) => {
      if (!dibatalkan) setPreviewUrls(hasil);
    });
    return () => {
      dibatalkan = true;
    };
  }, [images]);

  const token = localStorage.getItem("token");

  const handlePilihFoto = async (e) => {
    const filesTerpilih = Array.from(e.target.files);
    if (filesTerpilih.length > 4) {
      alert("Maksimal 4 foto per mobil");
      e.target.value = "";
      setImages([]);
      setImagesAsli([]);
      return;
    }
    setImages(filesTerpilih);
    setImagesAsli(filesTerpilih);
    if (filesTerpilih.length > 0) {
      setCropIndex(0);
      const dataUrl = await bacaSebagaiDataUrl(filesTerpilih[0]);
      setCropImageSrc(dataUrl);
      setCropModalOpen(true);
    }
  };

  const handleJadikanUtama = (index) => {
    const fotoUtama = images[index];
    const sisanya = images.filter((_, i) => i !== index);
    setImages([fotoUtama, ...sisanya]);

    const asliUtama = imagesAsli[index];
    const asliSisanya = imagesAsli.filter((_, i) => i !== index);
    setImagesAsli([asliUtama, ...asliSisanya]);

    setCropIndex(0);
    setCropImageSrc(previewUrls[index]);
    setCropModalOpen(true);
  };

  const bukaCropUtama = () => {
    if (!previewUrls[0]) return;
    setCropIndex(0);
    setCropImageSrc(previewUrls[0]);
    setCropModalOpen(true);
  };

  const handleSimpanCrop = (fileHasilCrop) => {
    setImages((prev) =>
      prev.map((file, i) => (i === cropIndex ? fileHasilCrop : file)),
    );
    setCropModalOpen(false);
    setCropIndex(null);
  };

  const handleTambahMobil = (e) => {
    e.preventDefault();
    console.log(editId);
    if (images.length === 0 && !editId) {
      alert("Foto mobil wajib di isi (minimal 1, maksimal 4)");
      return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    formData.append("tahun", tahun);
    formData.append("harga", harga);
    formData.append("stok", stok);
    formData.append("categoryId", categoryId);
    images.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("merek", merek);
    formData.append("kilometer", kilometer);
    formData.append("transmisi", transmisi);
    formData.append("bahanBakar", bahanBakar);
    formData.append("kapasitasMesin", kapasitasMesin);
    formData.append("warna", warna);
    formData.append("isPromo", isPromo);

    setIsSubmitting(true);

    if (!editId) {
      axios
        .post("/api/mobil", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          (document.getElementById("modal_tambah_mobil").close(),
            axios.get("/api/mobil").then((response) => {
              setDataMobil(response.data.mobil);
            }));
          setNama("");
          setDeskripsi("");
          setTahun("");
          setHarga("");
          setStok("");
          setCategoryId("");
          setMerek("");
          setKilometer("");
          setTransmisi("");
          setBahanBakar("");
          setKapasitasMesin("");
          setWarna("");
          setIsPromo(false);
          setImages([]);
          setEditId(null);
          setIsSubmitting(false);
        })

        .catch((error) => {
          alert(error.response.data.message);
          setIsSubmitting(false);
        });
    } else {
      axios
        .put(`/api/mobil/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          document.getElementById("modal_tambah_mobil").close();
          axios.get("/api/mobil").then((response) => {
            setDataMobil(response.data.mobil);
          });
          setNama("");
          setDeskripsi("");
          setTahun("");
          setHarga("");
          setStok("");
          setCategoryId("");
          setMerek("");
          setKilometer("");
          setTransmisi("");
          setBahanBakar("");
          setKapasitasMesin("");
          setWarna("");
          setIsPromo(false);
          setImages([]);
          setEditId(null);
          setIsSubmitting(false);
        })
        .catch((error) => {
          alert(error.response.data.message);
          setIsSubmitting(false);
        });
    }
  };
  const handleHapusMobil = (id) => {
    if (window.confirm("Yakin mau hapus mobil ini?")) {
      setHapusLoading(true);
      axios
        .delete(`/api/mobil/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        .then((response) => {
          alert(response.data.message);
          axios.get("/api/mobil").then((response) => {
            setDataMobil(response.data.mobil);
            setHapusLoading(false);
          });
        })
        .catch((error) => {
          alert(error.response.data.message);
          setHapusLoading(false);
        });
    }
  };

  const handleEditClick = (mobil) => {
    setNama(mobil.nama);
    setDeskripsi(mobil.deskripsi);
    setTahun(mobil.tahun);
    setHarga(mobil.harga);
    setStok(mobil.stok);
    setCategoryId(mobil.categoryId);
    setMerek(mobil.merek);
    setKilometer(mobil.kilometer ?? "");
    setTransmisi(mobil.transmisi ?? "");
    setBahanBakar(mobil.bahanBakar ?? "");
    setKapasitasMesin(mobil.kapasitasMesin ?? "");
    setWarna(mobil.warna ?? "");
    setIsPromo(mobil.isPromo ?? false);
    setEditId(mobil.id);
    setImages([]);
    setImagesAsli([]);
    setFotoLama(mobil.images || []);
    document.getElementById("modal_tambah_mobil").showModal();
  };

  return (
    <div className="w-full">
      {hapusLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      {bukaTambahLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      <div className="mb-4 md:hidden">
        <h1 className="text-xl font-extrabold text-gray-900">Kelola Mobil</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {dataMobil.length} mobil terdaftar
        </p>
      </div>
      <button
        onClick={() => {
          setBukaTambahLoading(true);
          setTimeout(() => {
            setNama("");
            setDeskripsi("");
            setTahun("");
            setHarga("");
            setStok("");
            setCategoryId("");
            setMerek("");
            setKilometer("");
            setTransmisi("");
            setBahanBakar("");
            setKapasitasMesin("");
            setWarna("");
            setIsPromo(false);
            setImages([]);
            setImagesAsli([]);
            setFotoLama([]);
            setEditId(null);
            document.getElementById("modal_tambah_mobil").showModal();
            setBukaTambahLoading(false);
          }, 400);
        }}
        className="btn bg-red-700 text-white hover:bg-red-800 w-full md:w-auto"
        id="btn-tambah-mobil"
      >
        + Tambah Mobil Baru
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <table className="w-full border-b hidden md:table">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3">Foto</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Tahun</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Stok</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataMobil.map((mobil, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">
                    <div className="relative w-28 h-20">
                      <img
                        src={mobil.images?.[0]}
                        alt={mobil.nama}
                        className="w-28 h-20 object-cover rounded"
                      />
                      {mobil.images && mobil.images.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          +{mobil.images.length - 1}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">{mobil.nama}</td>
                  <td className="p-3">{mobil.tahun}</td>
                  <td className="p-3">
                    Rp {mobil.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">{mobil.stok}</td>
                  <td className="p-3">
                    <button
                      className="btn btn-sm bg-red-700 text-white hover:bg-red-800 mr-2"
                      onClick={() => handleEditClick(mobil)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm bg-white text-red-700 border border-red-700"
                      onClick={() => handleHapusMobil(mobil.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {dataMobil.map((mobil, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm p-3 flex items-center gap-3"
              >
                <div className="relative w-20 h-16 flex-shrink-0">
                  <img
                    src={mobil.images?.[0]}
                    alt={mobil.nama}
                    className="w-20 h-16 object-cover rounded-xl"
                  />
                  {mobil.images && mobil.images.length > 1 && (
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      +{mobil.images.length - 1}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {mobil.nama}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {mobil.tahun} &middot; Stok {mobil.stok}
                  </p>
                  <p className="text-base font-extrabold text-red-700 mt-1">
                    Rp {mobil.harga.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    className="btn btn-sm bg-red-700 text-white hover:bg-red-800 rounded-lg"
                    onClick={() => handleEditClick(mobil)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm bg-white text-red-700 border border-red-700 rounded-lg"
                    onClick={() => handleHapusMobil(mobil.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <dialog id="modal_tambah_mobil" className="modal">
        <div className="modal-box w-[92%] max-w-md max-h-[85vh] rounded-2xl p-0 flex flex-col md:w-11/12 md:max-w-lg md:max-h-[90vh] md:rounded-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <h3 className="font-bold text-lg text-red-700">
              {editId ? "Edit Mobil" : "Tambah Mobil Baru"}
            </h3>
            <button
              type="button"
              onClick={() =>
                document.getElementById("modal_tambah_mobil").close()
              }
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-lg md:hidden"
              aria-label="Tutup"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={handleTambahMobil}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <label>Nama Mobil</label>
              <input
                type="text"
                placeholder="Nama Mobil"
                className="input input-bordered w-full mt-2 text-gray-400"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />

              <label className="block mt-1">Deskripsi</label>
              <input
                type="text"
                placeholder="Deskripsi"
                className="input input-bordered w-full mt-2 text-gray-400"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />

              <label className="block mt-1">Tahun</label>
              <input
                type="number"
                placeholder="Tahun"
                className="input input-bordered w-full mt-2 text-gray-400"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              />

              <label className="block mt-1">Harga</label>
              <input
                type="number"
                placeholder="Harga"
                className="input input-bordered w-full mt-2 text-gray-400"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
              />

              <label className="block mt-1">Stok</label>
              <input
                type="number"
                placeholder="Stok"
                className="input input-bordered w-full mt-2 text-gray-400"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
              />

              <div className="flex items-center justify-between mt-3 py-3 px-3.5 rounded-xl border border-gray-200 bg-gray-50">
                <div className="pr-3">
                  <p className="text-sm font-bold text-gray-800">
                    Tandai sebagai Promo Eksklusif
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Mobil ini akan muncul di tab "Promo Eksklusif" pada
                    halaman Katalog
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPromo(!isPromo)}
                  className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-colors duration-200 ${
                    isPromo
                      ? "bg-gradient-to-b from-[#9d151b] to-[#70090F]"
                      : "bg-gray-300"
                  }`}
                  aria-pressed={isPromo}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                      isPromo ? "right-0.5" : "left-0.5"
                    }`}
                  ></span>
                </button>
              </div>

              <label className="block mt-3">Kilometer</label>
              <input
                type="number"
                placeholder="Kilometer (contoh: 35000)"
                className="input input-bordered w-full mt-2 text-gray-400"
                value={kilometer}
                onChange={(e) => setKilometer(e.target.value)}
              />

              <label className="block mt-1">Kapasitas Mesin (cc)</label>
              <input
                type="number"
                placeholder="Kapasitas Mesin (contoh: 1500)"
                className="input input-bordered w-full mt-2 text-gray-400"
                value={kapasitasMesin}
                onChange={(e) => setKapasitasMesin(e.target.value)}
              />

              <label className="block mt-1">Warna</label>
              <input
                type="text"
                placeholder="Warna (contoh: Putih)"
                className="input input-bordered w-full mt-2 text-gray-400"
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
              />

              <select
                className="select select-bordered w-full mt-3"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Pilih Kategori</option>
                {dataKategori.map((kategori, index) => (
                  <option key={index} value={kategori.id}>
                    {kategori.name}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered w-full mt-3"
                value={merek}
                onChange={(e) => setMerek(e.target.value)}
              >
                <option value="">Pilih Merek</option>
                <option value="Byd">Byd</option>
                <option value="Honda">Honda</option>
                <option value="Mercedes Benz">Mercedes Benz</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Toyota">Toyota</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Nissan">Nissan</option>
                <option value="Isuzu">Isuzu</option>
                <option value="Mazda">Mazda</option>
                <option value="Dfsk">Dfsk</option>
                <option value="Ford">Ford</option>
                <option value="MG">MG</option>
                <option value="Jeep">Jeep</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Bmw">Bmw</option>
                <option value="Mini">Mini</option>
                <option value="Kia">Kia</option>
                <option value="Lexus">Lexus</option>
                <option value="Wuling">Wuling</option>
                <option value="Cherry">Cherry</option>
                <option value="Gwm">Gwm</option>
                <option value="Baic">Baic</option>
              </select>

              <select
                className="select select-bordered w-full mt-3"
                value={transmisi}
                onChange={(e) => setTransmisi(e.target.value)}
              >
                <option value="">Pilih Transmisi</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>

              <select
                className="select select-bordered w-full mt-3"
                value={bahanBakar}
                onChange={(e) => setBahanBakar(e.target.value)}
              >
                <option value="">Pilih Bahan Bakar</option>
                <option value="Bensin">Bensin</option>
                <option value="Solar">Solar</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Listrik">Listrik</option>
              </select>

              <input
                type="file"
                multiple
                accept="image/*"
                className="file-input file-input-bordered w-full mt-3"
                onChange={handlePilihFoto}
              />

              {editId && fotoLama.length > 0 && images.length === 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">
                    Foto saat ini (akan tetap dipakai jika tidak pilih foto
                    baru):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {fotoLama.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`foto-lama-${index}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {images.map((file, index) => (
                    <div key={index} className="w-20">
                      <div className="relative">
                        <img
                          src={previewUrls[index]}
                          alt={`preview-${index}`}
                          className={`w-20 h-20 object-cover rounded border ${
                            index === 0 ? "ring-2 ring-red-700" : ""
                          }`}
                        />
                        {index === 0 && (
                          <span className="absolute -top-1 -left-1 bg-red-700 text-white text-[9px] font-bold px-1.5 rounded">
                            Utama
                          </span>
                        )}
                      </div>

                      {index === 0 ? (
                        <button
                          type="button"
                          onClick={bukaCropUtama}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            bukaCropUtama();
                          }}
                          className="mt-1 w-full bg-white border border-gray-300 text-[10px] font-bold py-1.5 rounded text-center"
                        >
                          Atur Frame
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJadikanUtama(index)}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            handleJadikanUtama(index);
                          }}
                          className="mt-1 w-full bg-white border border-gray-300 text-[10px] font-bold py-1.5 rounded text-center"
                        >
                          Jadikan Utama
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
              <button className="btn bg-red-700 text-white hover:bg-red-800 w-full md:w-auto">
                Submit
              </button>
            </div>
          </form>

          <div className="modal-action px-4 pb-4 flex-shrink-0">
            <form method="dialog">
              <button className="btn">Tutup</button>
            </form>
          </div>
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>
        )}

        {cropModalOpen && (
          <CropModal
            imageSrc={cropImageSrc}
            fileName={imagesAsli[cropIndex]?.name || "foto-utama.jpg"}
            onClose={() => setCropModalOpen(false)}
            onSimpan={handleSimpanCrop}
          />
        )}
      </dialog>
    </div>
  );
};

export default KelolaMobil;