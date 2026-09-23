import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import KelolaMobil from "./pages/KelolaMobil.jsx";
import KelolaKategori from "./pages/KelolaKategori.jsx";
import KelolaUser from "./pages/KelolaUser.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn.jsx";
import KelolaLokasi from "./pages/KelolaLokasi.jsx";
import KelolaTestimoni from "./pages/KelolaTestimoni.jsx";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="mobil" element={<KelolaMobil />} />
        <Route path="kategori" element={<KelolaKategori />} />
        <Route path="user" element={<KelolaUser />} />
        <Route path="lokasi" element={<KelolaLokasi />} />
        <Route path="testimoni" element={<KelolaTestimoni />} />
      </Route>
    </Routes>
  );
}

export default App;
