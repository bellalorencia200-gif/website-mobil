import Katalog from "./pages/Katalog.jsx";
import TentangKami from "./pages/TentangKami.jsx";
import DetailMobil from "./pages/DetailMobil.jsx";
import BukaDiHp from "./pages/BukaDiHp.jsx";
import JualMobil from "./pages/JualMobil.jsx";
import Profile from "./pages/Profil.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import NotFound from "./pages/NotFound.jsx";
import BottomNavUser from "./components/BottomNavUser.jsx";
import WhatsAppMelayang from "./components/WhatsAppMelayang.jsx";

import Home from "./pages/Home.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
 return (
    <>
      <ScrollToTop />
      <div className="pb-16 md:pb-0">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/tentang-kami" element={<TentangKami />} />
        <Route path="/mobil/:id" element={<DetailMobil />} />
        <Route path="/buka-di-hp" element={<BukaDiHp />} />
        <Route
          path="/jual-mobil"
          element={
            <RequireAuth>
              <JualMobil />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
       <BottomNavUser />
       <WhatsAppMelayang />
    </>
  );
}
export default App;
