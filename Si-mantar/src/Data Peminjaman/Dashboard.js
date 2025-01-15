import React, { useState, useEffect} from 'react';
// import "./Dashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faTools, faBox, faExclamationTriangle, faUsers, faChartBar, faThLarge, faReceipt, faClipboardCheck, faClipboardQuestion, faCheckCircle, faClipboardList, faSearch} from '@fortawesome/free-solid-svg-icons'; // Import ikon yang diperlukan
import avatar from "../assets/images.png";

import { Link } from 'react-router-dom';
import "./Dashboard.css";
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';
import axios from 'axios';

function Dasboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState("");
  const [totals, setTotals] = useState({
    users: 0,
    jurusans: 0,
    ruangans: 0,
    barangs: 0,
    barangbaik: 0,
    barangrusak: 0,
    peminjaman: 0,
    belumkembali: 0,
    dikembalikan: 0
  });


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Ambil token dari local storage
    const role = localStorage.getItem('role');
    console.log("rolest:", role)
    setUserRole(role);
    if(!token){
      window.location.href = "/";
    } else {
      fetchData(); // Panggil fetchData jika token tersedia
    }
  },[]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const [responseMe, responseUsers, responsePrograms, responseRooms, responseItems, responsePeminjaman, responsePeminjamans] = await Promise.all([
        axios.post('http://127.0.0.1:8000/api/auth/me'),
        axios.get('http://127.0.0.1:8000/api/users'),
        axios.get('http://127.0.0.1:8000/api/jurusans'),
        axios.get('http://127.0.0.1:8000/api/ruangans'),
        axios.get('http://127.0.0.1:8000/api/barangs'),
        axios.get('http://127.0.0.1:8000/api/peminjamans'),
        axios.get('http://127.0.0.1:8000/api/peminjamans/get')
      ]);

      setUser(responseMe.data);
      // setUserRole(responseMe.data.role);

      // Hitung total barang yang baik dan rusak
      let barangbaik = 0;
      let barangrusak = 0;
      responseItems.data.forEach(item => {
        if (item.keadaan_barang === 'baik') {
          barangbaik++;
        } else {
          barangrusak++;
        }
      });

      // Hitung total peminjaman yang belum dikembalikan
      let belumkembali = 0;
      let dikembalikan = 0;
      responsePeminjamans.data.forEach(peminjaman => {
        if (peminjaman.status_peminjaman === 'Dipinjam') {
          belumkembali++;
        } else if (peminjaman.status_peminjaman === 'Dikembalikan') {
          dikembalikan++;
        }
      });

      setTotals({
        users: responseUsers.data.length,
        jurusans: responsePrograms.data.length,
        ruangans: responseRooms.data.length,
        barangs: responseItems.data.length,
        barangbaik: barangbaik,
        barangrusak: barangrusak,
        peminjaman: responsePeminjaman.data.length,
        belumkembali: belumkembali,
        dikembalikan: dikembalikan
      });
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
  };
  const [count, setCount] = useState(3);

   
  return (
    <div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Slidebar />
      </div>
      <div className={`main ${isSidebarOpen ? 'shifted' : ''}`}>
      <Topbar toggleSidebar={toggleSidebar} />
          <div className="welcome">
          <h3>Hallo {userRole}</h3> {/* Menampilkan peran pengguna */}
          <p>Selamat Datang Kembali di SiMantar</p>
          </div>
          <div class="cardBox">
          {userRole === "admin" && (
            <>
          <Link to="/datapengguna" className="box" style={{ textDecoration: 'none' }}>
              <div>
                <div className="numbers">{totals.users}</div>
                <div className="cardName">Total Pengguna</div>
              </div>
              <div className="iconBx">
                <FontAwesomeIcon icon={faUsers} /> 
              </div>
            </Link>
            <Link to="/datajurusan" className="box" style={{ textDecoration: 'none' }}> {/* Tambahkan Link untuk mengarahkan ke halaman jurusan */}
            <div>
              <div className="numbers">{totals.jurusans}</div>
              <div className="cardName">Total Program Keahlian</div>
            </div>
            <div className="iconBx">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
          </Link> 
          <Link to="/dataruangan" className="box" style={{ textDecoration: 'none' }}>
              <div>
                <div className="numbers">{totals.ruangans}</div>
                <div className="cardName">Total Ruangan</div>
              </div>
              <div className="iconBx">
                <FontAwesomeIcon icon={faThLarge} /> 
              </div>
            </Link>
            </>
          )}
            <Link to="/databarang" className="box" style={{ textDecoration: 'none' }}>
              <div>
                <div className="numbers">{totals.barangs}</div>
                <div className="cardName">Total Barang</div>
              </div>
              <div className="iconBx">
                <FontAwesomeIcon icon={faBox} /> 
              </div>
            </Link>

            <Link to="/databarang" className="box" style={{ textDecoration: 'none' }}>
              <div>
                <div class="numbers">{totals.barangbaik}</div>
                <div class="cardName">Barang Kondisi baik</div>
              </div>

              <div class="iconBx">
              <FontAwesomeIcon icon={faCheckCircle} /> 
              </div>
            </Link>

            <Link to="/databarang" className="box" style={{ textDecoration: 'none' }}>
              <div>
                <div class="numbers">{totals.barangrusak}</div>
                <div class="cardName">Barang Kondisi Rusak</div>
              </div>

              <div class="iconBx">
              <FontAwesomeIcon icon={faExclamationTriangle} /> 
              </div>
            </Link>

            <Link to="/datapeminjaman" className="box" style={{ textDecoration: 'none' }}>
              <div>
                <div className="numbers">{totals.peminjaman}</div>
                <div className="cardName">Transaksi Peminjaman</div>
              </div>
              <div className="iconBx">
                <FontAwesomeIcon icon={faClipboardList} /> 
              </div>
            </Link>

            <Link to="/datapeminjaman" className="box" style={{ textDecoration: 'none' }}>
              <div>
                <div class="numbers">{totals.belumkembali}</div>
                <div class="cardName">Peminjaman Belum Dikembalikan</div>
              </div>

              <div class="iconBx">
              <FontAwesomeIcon icon={faClipboardQuestion} /> 
              </div>
            </Link>
            
            <Link to="/datapeminjaman" className="box" style={{ textDecoration: 'none' }}>
              <div>
                <div class="numbers">{totals.dikembalikan}</div>
                <div class="cardName">Peminjaman Dikembalikan</div>
              </div>

              <div class="iconBx">
              <FontAwesomeIcon icon={faClipboardCheck} /> 
              </div>
            </Link>
            
          </div>
        </div>
        
      
    </div>
  );
}
export default Dasboard;
