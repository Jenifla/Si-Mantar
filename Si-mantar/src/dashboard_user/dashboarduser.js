import React, { useState, useEffect } from 'react';
import avatar from "../assets/images.png";
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTools, faBox, faExclamationTriangle, faUsers, faChartBar, faThLarge, faReceipt, faClipboardCheck, faClipboardQuestion, faCheckCircle, faClipboardList, faSearch} from '@fortawesome/free-solid-svg-icons';
// import "../Data Peminjaman/Dashboard.css";
import { Pagination } from 'react-bootstrap';
import axios from 'axios';
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';

function UserDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState({});
    const [userRole, setUserRole] = useState("");
    const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([]);
    const [totals, setTotals] = useState({
      users: 0,
      jurusans: 0,
      ruangans: 0,
      barangs: 0,
      peminjaman: 0,
      belumkembali: 0,
      dikembalikan: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(true); 

    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10); 

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndex = (currentPage - 1) * dataPerPage + 1;
    const endIndex = Math.min(startIndex + dataPerPage - 1, (searchResult.length > 0 ? searchResult.length : riwayatPeminjaman.length));

    // Potong data sesuai dengan indeks data awal dan akhir
    const currentData = searchResult.length > 0 ? searchResult.slice(startIndex - 1, endIndex) : riwayatPeminjaman.slice(startIndex - 1, endIndex);

    // Hitung jumlah total halaman
    const totalPages = Math.ceil((searchTerm ? searchResult.length : riwayatPeminjaman.length) / dataPerPage);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
          window.location.href = "/";
        } else {
          fetchData();
        }
      },[]);

    const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.post('http://127.0.0.1:8000/api/auth/me');
          setUser(response.data);
          setUserRole(response.data.role);
          console.log("user pem:", response.data.id)
    
          const responseUsers = await axios.get('http://127.0.0.1:8000/api/users');
          const responsePrograms = await axios.get('http://127.0.0.1:8000/api/jurusans');
          const responseRooms = await axios.get('http://127.0.0.1:8000/api/ruangans');
          const responseItems = await axios.get('http://127.0.0.1:8000/api/barangs');
          const responsePeminjaman = await axios.get(`http://127.0.0.1:8000/api/peminjamans/get`);
          const filteredPeminjaman = responsePeminjaman.data.filter(item => item.peminjaman.user_id === response.data.id.toString());
          console.log("data asli:", responsePeminjaman.data)
          console.log("data pem:", filteredPeminjaman)
          setTotals({
            users: responseUsers.data.length,
            jurusans: responsePrograms.data.length,
            ruangans: responseRooms.data.length,
            barangs: responseItems.data.length,
            peminjaman: filteredPeminjaman.length,
            belumkembali: filteredPeminjaman.filter(item => item.status_peminjaman === 'Belum Dikembalikan').length,
            dikembalikan: filteredPeminjaman.filter(item => item.status_peminjaman === 'Dikembalikan').length,
          });

          setRiwayatPeminjaman(filteredPeminjaman);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
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

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        const result = riwayatPeminjaman.filter(
          (peminjamanBarang) =>
            (peminjamanBarang.barang.nama_barang && peminjamanBarang.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (peminjamanBarang.peminjaman.tgl_peminjaman && peminjamanBarang.peminjaman.tgl_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (peminjamanBarang.peminjaman.tgl_pengembalian && peminjamanBarang.peminjaman.tgl_pengembalian.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (peminjamanBarang.jumlah_dipinjam && peminjamanBarang.jumlah_dipinjam.toString().includes(searchTerm.toLowerCase())) ||
            (peminjamanBarang.peminjaman.keperluan && peminjamanBarang.peminjaman.keperluan.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (peminjamanBarang.status_peminjaman && peminjamanBarang.status_peminjaman.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setSearchResult(result);
        setCurrentPage(1);
    };

    return (
        <div>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Slidebar />
            </div>
            <div className={`main ${isSidebarOpen ? 'shifted' : ''}`}>
            <Topbar toggleSidebar={toggleSidebar} onSearch={handleSearch} />
                <div className="welcome">
                    <h3>Hallo  {userRole} </h3>
                    <p>Selamat Datang  di SiMantar</p>
                </div>

                {loading ? ( // Render loading text if loading is true
                    <div>Loading...</div>
                ) : (
                    <>
                <div className="cardBox">
                    <Link to="/databarang" className="box" style={{ textDecoration: 'none' }}>
                        <div>
                            <div className="numbers">{totals.barangs} </div>
                            <div className="cardName">Total Barang</div>
                        </div>
        
                        <div className="iconBx">
                        <FontAwesomeIcon icon={faBox} />
                        </div>
                    </Link>

                    <Link to="/datapeminjaman" className="box" style={{ textDecoration: 'none' }}>
                        <div>
                            <div className="numbers">{totals.peminjaman}</div>
                            <div className="cardName">Total Peminjaman</div>
                        </div>
        
                        <div className="iconBx">
                        <FontAwesomeIcon icon={faClipboardList} /> 
                        </div>
                    </Link>

                    <Link to="/datapeminjaman" className="box" style={{ textDecoration: 'none' }}>
                        <div>
                            <div className="numbers">{totals.belumkembali}</div>
                            <div className="cardName">Peminjaman Belum Dikembalikan</div>
                        </div>
        
                        <div className="iconBx">
                        <FontAwesomeIcon icon={faClipboardQuestion} /> 
                        </div>
                    </Link>

                    <Link to="/datapeminjaman" className="box" style={{ textDecoration: 'none' }}>
                        <div>
                            <div className="numbers">{totals.dikembalikan}</div>
                            <div className="cardName">Peminjaman Dikembalikan</div>
                        </div>
        
                        <div className="iconBx">
                        <FontAwesomeIcon icon={faClipboardCheck} />
                        </div>
                    </Link>
                </div>

                <div className="details">
                    <div className="recentOrders">
                        <div className="cardHeader">
                            <h2>Riwayat Peminjaman</h2>
                            <Link to="/datapeminjaman" className="btn">View All</Link>
                        </div>
        
                        <table className="tableuser">
                            <thead>
                                <tr>
                                    <td>Nama Barang</td>
                                    <td>Tanggal Peminjaman</td>
                                    <td>Tanggal Pengembalian</td>
                                    <td>Keperluan</td>
                                    <td>Jumlah</td>
                                    <td>Status</td>
                                </tr>
                            </thead>
        
                            <tbody>
                            {currentData.length > 0 ? (
                                    currentData.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.barang.nama_barang}</td>
                                            <td>{item.peminjaman.tgl_peminjaman}</td>
                                            <td>{item.peminjaman.tgl_pengembalian}</td>
                                            <td>{item.peminjaman.keperluan}</td>
                                            <td>{item.jumlah_dipinjam}</td>
                                            <td>{item.status_peminjaman}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Data tidak tersedia</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* Tampilkan informasi jumlah data yang ditampilkan */}
        <div className='d-flex justify-content-between align-items-center mt-2'>
            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndex} to {endIndex} of {(searchTerm ? searchResult.length : riwayatPeminjaman.length)} results</p>
        
                                {/* Pagination */}
            {/* Pagination */}
            <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
            </div>
                    </div>
                </div>

                </>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;