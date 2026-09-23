import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

const KelolaTestimoni = () => {
  const [dataTestimoni, setDataTestimoni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");

  const ambilDataTestimoni = () => {
    axios
      .get("/api/testimoni/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDataTestimoni(response.data.testimoni);
        setIsLoading(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || "gagal mengambil data testimoni");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    ambilDataTestimoni();
  }, []);

  const handleToggleAktif = (testimoni) => {
    setActionLoading(true);

    const formData = new FormData();
    formData.append("aktif", !testimoni.aktif);

    axios
      .put(`/api/testimoni/${testimoni.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert(response.data.message);
        ambilDataTestimoni();
        setActionLoading(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || "gagal update testimoni");
        setActionLoading(false);
      });
  };

  const handleHapusTestimoni = (id) => {
    if (window.confirm("Yakin mau hapus testimoni ini?")) {
      setActionLoading(true);
      axios
        .delete(`/api/testimoni/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          ambilDataTestimoni();
          setActionLoading(false);
        })
        .catch((error) => {
          alert(error.response?.data?.message || "gagal hapus testimoni");
          setActionLoading(false);
        });
    }
  };

  return (
    <div className="w-full">
      {actionLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">
          Kelola Testimoni
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {dataTestimoni.length} testimoni masuk
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : dataTestimoni.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
          Belum ada testimoni masuk
        </div>
      ) : (
        <>
          <table className="w-full border-b hidden md:table">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3">Nama</th>
                <th className="p-3">Komentar</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Mobil Dibeli</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataTestimoni.map((testimoni) => (
                <tr key={testimoni.id} className="border-t">
                  <td className="p-3 font-semibold">
                    {testimoni.namaPelanggan}
                  </td>
                  <td className="p-3 max-w-xs">
                    <p className="line-clamp-2">{testimoni.komentar}</p>
                  </td>
                  <td className="p-3">{testimoni.rating} / 5</td>
                  <td className="p-3">{testimoni.mobilDibeli || "-"}</td>
                  <td className="p-3">
                    {testimoni.aktif ? (
                      <span className="badge bg-green-100 text-green-700 border-green-300">
                        Aktif
                      </span>
                    ) : (
                      <span className="badge bg-yellow-100 text-yellow-700 border-yellow-300">
                        Menunggu
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      className={`btn btn-sm mr-2 ${
                        testimoni.aktif
                          ? "bg-white text-gray-700 border border-gray-300"
                          : "bg-red-700 text-white hover:bg-red-800"
                      }`}
                      onClick={() => handleToggleAktif(testimoni)}
                    >
                      {testimoni.aktif ? "Nonaktifkan" : "Setujui"}
                    </button>
                    <button
                      className="btn btn-sm bg-white text-red-700 border border-red-700"
                      onClick={() => handleHapusTestimoni(testimoni.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {dataTestimoni.map((testimoni) => (
              <div
                key={testimoni.id}
                className="bg-white rounded-2xl shadow-sm p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">
                    {testimoni.namaPelanggan}
                  </p>
                  {testimoni.aktif ? (
                    <span className="badge bg-green-100 text-green-700 border-green-300">
                      Aktif
                    </span>
                  ) : (
                    <span className="badge bg-yellow-100 text-yellow-700 border-yellow-300">
                      Menunggu
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {testimoni.rating} / 5 &middot; {testimoni.mobilDibeli || "-"}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {testimoni.komentar}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    className={`btn btn-sm flex-1 rounded-lg ${
                      testimoni.aktif
                        ? "bg-white text-gray-700 border border-gray-300"
                        : "bg-red-700 text-white hover:bg-red-800"
                    }`}
                    onClick={() => handleToggleAktif(testimoni)}
                  >
                    {testimoni.aktif ? "Nonaktifkan" : "Setujui"}
                  </button>
                  <button
                    className="btn btn-sm flex-1 bg-white text-red-700 border border-red-700 rounded-lg"
                    onClick={() => handleHapusTestimoni(testimoni.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default KelolaTestimoni;