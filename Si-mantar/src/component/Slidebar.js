import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUsers, faChevronDown, faChevronUp, faChartBar, faThLarge, faBox, faClipboardList, faCogs, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/smk ijo.jpg";
import "./sidebar.css";

const Slidebar = () => {
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);

  const toggleReportMenu = () => {
    setIsReportMenuOpen(!isReportMenuOpen);
  };

  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.pathname);
  }, []);

  const role = localStorage.getItem('role');
  console.log(role);

  useEffect(() => {}, []);

  const logoutHandler = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post('http://127.0.0.1:8000/api/auth/logout');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token', response.data.access_token);
      localStorage.removeItem('role');
      localStorage.removeItem('userid');
      window.location.href = "/";
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

  return (
    <div>
      <div className="navigation">
        <ul>
          <li>
            <a href="#">
              <span className="">
                <div className="logo1">
                  {/* <img src={logo} alt="Logo" /> */}
                </div>
              </span>
              <span className="title">Si Mantar</span>
            </a>
          </li>

          <li className={(currentUrl === '/dashboard' || currentUrl === '/dashboarduser')? 'active' : ''}>
          <Link to={role === 'siswa' || role === 'guru' ? "/dashboarduser" : "/dashboard"}>
              <span className="icon">
                <FontAwesomeIcon icon={faHome} />
              </span>
              <span className="title">Dashboard</span>
            </Link>
          </li>

          {role === 'admin' && (
            <>
              <li className={currentUrl === '/datapengguna' ? 'active' : ''}>
                <Link to="/datapengguna">
                  <span className="icon">
                    <FontAwesomeIcon icon={faUsers} />
                  </span>
                  <span className="title">Data Pengguna</span>
                </Link>
              </li>
              <li className={currentUrl === '/datajurusan' ? 'active' : ''}>
                <Link to="/datajurusan">
                  <span className="icon">
                    <FontAwesomeIcon icon={faChartBar} />
                  </span>
                  <span className="title">Data Program Keahlian</span>
                </Link>
              </li>
              <li className={currentUrl === '/dataruangan' ? 'active' : ''}>
                <Link to="/dataruangan">
                  <span className="icon">
                    <FontAwesomeIcon icon={faThLarge} />
                  </span>
                  <span className="title">Data Ruangan</span>
                </Link>
              </li>
            </>
          )}

          <li className={currentUrl === '/databarang' ? 'active' : ''}>
          <Link to="/databarang">
              <span className="icon">
                <FontAwesomeIcon icon={faBox} />
              </span>
              <span className="title">Data Barang</span>
            </Link>
          </li>
          
          <li className={currentUrl === '/datapeminjaman' ? 'active' : ''}>
            <Link to="/datapeminjaman">
              <span className="icon">
                <FontAwesomeIcon icon={faClipboardList} />
              </span>
              <span className="title">Peminjaman</span>
            </Link>
          </li>

          {role !== 'siswa' && role !== 'guru' &&(
            <li className={currentUrl === '/laporanbarang' ? 'active' : ''}>
              <Link to="/laporanbarang" >
                <span className="icon">
                  <FontAwesomeIcon icon={faClipboardList} />
                </span>
                <span className="title">Laporan Barang</span>
                
              </Link>
              
            </li>
          )}


           {role !== 'siswa' && role !== 'guru' &&(
            <li className={currentUrl === '/laporanpeminjaman' ? 'active' : ''}>
              <Link to="/laporanpeminjaman" >
                <span className="icon">
                  <FontAwesomeIcon icon={faClipboardList} />
                </span>
                <span className="title">Laporan Peminjaman</span>
                
              </Link>
              
            </li>
          )}

          <li className={currentUrl === '/pengaturan' ? 'active' : ''}>
            <Link to="/pengaturan">
              <span className="icon">
                <FontAwesomeIcon icon={faCogs} />
              </span>
              <span className="title">Pengaturan</span>
            </Link>
          </li>
          
          <li >
            <Link to="/" onClick={logoutHandler}>
              <span className="icon">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </span>
              <span className="title">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Slidebar;
