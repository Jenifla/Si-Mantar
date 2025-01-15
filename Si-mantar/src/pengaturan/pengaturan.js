import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import avatar from "../assets/images.png";
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';
import "./pengaturan.css";
import axios from 'axios';

function Pengaturan() {
  const [akun, setAkun] = useState({
    id: '',
    username: "",
    nama_user: "",
    no_hp: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAkun({ ...akun, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (akun.newPassword !== akun.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok");
      return;
    }
    console.log("Data akun yang akan disimpan:", akun);
    setAkun({
      ...akun,
      newPassword: "",
      confirmPassword: "",
    });
    try {
      const response = axios.put(`http://127.0.0.1:8000/api/users/setting/${akun.id}`, akun);
      alert("Perubahan berhasil disimpan"); // Tampilkan pesan sukses dari backend
    } catch (error) {
      console.error("Error updating account settings:", error);
      alert("Terjadi kesalahan saat memperbarui pengaturan akun.");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post('http://127.0.0.1:8000/api/auth/me');
      setAkun(response.data);
      console.log("data akun:", response.data)
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response && error.response.status === 401) {
        // Handle Unauthorized error
        console.log("Unauthorized access detected. Logging out...");
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userid');
        localStorage.removeItem("isLoggedIn");
      }
    }
  }

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <Slidebar />
      <div className={`main ${isSidebarOpen ? 'shifted' : ''}`}>
      <Topbar toggleSidebar={toggleSidebar} />
        <div className="container">
          <h2>Pengaturan Akun</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={akun.username}
                onChange={handleChange}
                disabled
              />
            </div>
            <div>
              <label>Nama User</label>
              <input
                type="text"
                name="nama_user"
                value={akun.nama_user}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>No Hp</label>
              <input
                type="number"
                name="no_hp"
                value={akun.no_hp}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Password Baru</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Masukan password baru jika ingin mengganti password"
                value={akun.newPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Konfirmasi Password Baru</label>
              <input
                type="password"
                name="confirmPassword"
                value={akun.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button className="bpengaturan" type="submit">Simpan Perubahan</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Pengaturan;
