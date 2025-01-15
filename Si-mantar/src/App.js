import React, { useState } from "react";
import "./App.css";


import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Dashboard from "./Data Peminjaman/Data Peminjaman";
import Dashboard from "./page/admin/dashboard";
import Login from "./login/login";
import InputBarang from "./Data Peminjaman/Tambahbarang";
import DataPengguna from "./page/admin/datapengguna";
import DataJurusan from "./page/admin/datajurusan";
import DataRuangan from "./page/admin/dataruangan";
import DataBarang from "./page/admin/databarang";
import Pengaturan from "./page/admin/pengaturan";
import Laporan from "./page/admin/laporan";
import FormPeminjaman from "./Peminjaman/peminjaman";
import FormPermintaan from "./Peminjaman/permintaan";
import Datapeminjaman from "./DataPeminjaman/Datapeminjaman";
import UserDashboard from "./page/admin/dashboard_user";
import Laporanbarang from "./LaporanBarang/Laporanbarang";
import Laporanpem from "./LaporanPem/Laporanpem";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("role") || "guest"
  );

  const login = (role) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole("guest");
  };

  return { isLoggedIn, login, logout, userRole };
};



const ProtectedRoute = ({ element: Component, role }) => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (role && !role.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return Component;
};

function App() {
  const { isLoggedIn, userRole } = useAuth();
  const renderDashboard = () => {
    if (isLoggedIn) {
      if (userRole === "siswa" || userRole === "guru") {
        return <UserDashboard />;
      } else {
        return <Dashboard />;
      }
    } else {
      return <Login />;
    }
  };
  return (
    <Router>
      <div>
      <div id="idElemenTarget"></div>
        <Routes>
          <Route path="/" element={renderDashboard()}/>
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login />} />
          <Route path="/datapengguna" element={<ProtectedRoute element={<DataPengguna />} role={["admin"]} />} />
          <Route path="/datajurusan" element={<ProtectedRoute element={<DataJurusan />} role={["admin"]} />} />
          <Route path="/dataruangan" element={<ProtectedRoute element={<DataRuangan />} role={["admin"]} />} />
          <Route path="/databarang" element={isLoggedIn ? <DataBarang /> : <Login />} />
          <Route path="/Inputbarang" element={<ProtectedRoute element={<InputBarang />} role={["sarpras", "ketua_program"]} />} />
          <Route path="/laporanbarang" element={<ProtectedRoute element={<Laporanbarang />} role={["sarpras", "ketua_program", "admin", "kepsek"]} />}/>
          <Route path="/laporanpeminjaman" element={<ProtectedRoute element={<Laporanpem />} role={["sarpras", "ketua_program", "admin", "kepsek"]} />} />
          <Route path="/pengaturan" element={isLoggedIn ? <Pengaturan /> : <Navigate to="/" />} />
          <Route path="/datapeminjaman" element={isLoggedIn ? <Datapeminjaman /> : <Login />} />
          <Route path="/peminjaman" element={<ProtectedRoute element={<FormPeminjaman />} role={["sarpras", "ketua_program", "siswa", "guru"]} />} />
          <Route path="/permintaan" element={<ProtectedRoute element={<FormPermintaan />} role={["sarpras", "ketua_program", "siswa", "guru"]} />} />
          <Route path="/dashboarduser" element={isLoggedIn ? <UserDashboard /> : <Login />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
