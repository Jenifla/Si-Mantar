import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Table, Form, Nav} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEye, faEdit, faTrashAlt, faSearch, faPlus, faInfo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../assets/images.png";
import Slidebar from '../component/Slidebar';
import { Link } from "react-router-dom";
import { Pagination } from 'react-bootstrap';
import QrScanner from 'react-qr-scanner';

const Datapemakaian = () => {
    const [catatan, setCatatan] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const result = kembaliDatas.filter(peminjamanBarang =>
            (peminjamanBarang.peminjaman.nama_peminjam && peminjamanBarang.peminjaman.nama_peminjam.toLowerCase().includes(keyword)) ||
            (peminjamanBarang.barang.nama_barang && peminjamanBarang.barang.nama_barang.toLowerCase().includes(keyword)) ||
            (peminjamanBarang.jumlah_dipinjam && peminjamanBarang.jumlah_dipinjam.toString().includes(keyword)) ||
            (peminjamanBarang.peminjaman.tgl_peminjaman && peminjamanBarang.peminjaman.tgl_peminjaman.toLowerCase().includes(keyword)) ||
            (peminjamanBarang.peminjaman.tgl_pengembalian && peminjamanBarang.peminjaman.tgl_pengembalian.toLowerCase().includes(keyword)) ||
            (peminjamanBarang.peminjaman.keperluan && peminjamanBarang.peminjaman.keperluan.toLowerCase().includes(keyword)) ||
            (peminjamanBarang.status_peminjaman && peminjamanBarang.status_peminjaman.toLowerCase().includes(keyword)) ||
            (peminjamanBarang.catatan && peminjamanBarang.catatan.toLowerCase().includes(keyword))
        );
        setSearchResult(result);
    };
    
    

    const [rejectedPeminjamanId, setRejectedPeminjamanId] = useState('');



    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState(null);
    const [peminjamId, setPeminjamId] = useState([]);
    const [activeTab, setActiveTab] = useState('peminjamanSaya');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [kodeBarang, setKodeBarang] = useState("");
    const [barangId, setBarangId] = useState("");

    
    
    const handleError = (err) => {
    console.error(err);
    };

    const [peminjaman, setPeminjaman] = useState([]);
    const [peminjamanBarangs, setPeminjamanBarangs] = useState([]);
    const [userData, setUserData] = useState([]);
    const [peminjamanTunggu, setPeminjamanTunggu] = useState([]);
    const [peminjamanKembali, setPeminjamanKembali] = useState([]);
    const [showPinjamButton, setShowPinjamButton] = useState(false);
    const [showActionColumn, setShowActionColumn] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);

    // Hitung jumlah total data
    const totalData = peminjamanBarangs.length;

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndex = (currentPage - 1) * dataPerPage + 1;
    const endIndex = Math.min(startIndex + dataPerPage - 1, totalData);


    // Hitung indeks data awal dan akhir untuk halaman saat ini
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;

    // Potong data sesuai dengan indeks data awal dan akhir
    const currentData = peminjamanBarangs.slice(indexOfFirstData, indexOfLastData);

    // Hitung jumlah total halaman
    const totalPages = Math.ceil(peminjamanBarangs.length / dataPerPage);

    // Fungsi untuk mengubah halaman
    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    const [menungguPage, setMenungguPages] = useState(1);
    const [dataMPerPages] = useState(10); // Ubah sesuai kebutuhan Anda

    // Hitung jumlah total data
    const totalMDatas = peminjamanTunggu.length;

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndexs = (menungguPage - 1) * dataMPerPages + 1;
    const endIndexs = Math.min(startIndexs + dataMPerPages - 1, totalMDatas);


    // Hitung indeks data awal dan akhir untuk halaman saat ini
    const indexOfLastMDatas = menungguPage * dataMPerPages;
    const indexOfFirstMDatas = indexOfLastMDatas - dataMPerPages;

    // Potong data sesuai dengan indeks data awal dan akhir
    const menungguDatas = peminjamanTunggu.slice(indexOfFirstMDatas, indexOfLastMDatas);

    // Hitung jumlah total halaman
    const totalMPages = Math.ceil(peminjamanTunggu.length / dataMPerPages);

    // Fungsi untuk mengubah halaman
    const paginateM = (pageNumber) => setMenungguPages(pageNumber);
    

    const [kembaliPage, setKembaliPages] = useState(1);
    const [dataKPerPages] = useState(10); // Ubah sesuai kebutuhan Anda

    // Hitung jumlah total data
    const totalKDatas = peminjamanKembali.length;

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndexes = (kembaliPage - 1) * dataKPerPages + 1;
    const endIndexes = Math.min(startIndexes + dataKPerPages - 1, totalKDatas);


    // Hitung indeks data awal dan akhir untuk halaman saat ini
    const indexOfLastKDatas = kembaliPage * dataKPerPages;
    const indexOfFirstKDatas = indexOfLastKDatas - dataKPerPages;

    // Potong data sesuai dengan indeks data awal dan akhir
    const kembaliDatas = peminjamanKembali.slice(indexOfFirstKDatas, indexOfLastKDatas);

    // Hitung jumlah total halaman
    const totalKPages = Math.ceil(peminjamanKembali.length / dataKPerPages);

    // Fungsi untuk mengubah halaman
    const paginateK = (pageNumber) => setKembaliPages(pageNumber);
    
    const fetchDataAndUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
            // Mengambil data user
            const userResponse = await axios.post('http://127.0.0.1:8000/api/auth/me');
            const userData = userResponse.data;
            console.log('ID user yang sedang login:', userData.id);
            
            // Menyimpan data user ke state
            setUserRole(userData.role);
            setUserId(userData.id);
            
            // Menjalankan fungsi handleRole dengan role dari data user
            handleRole(userData.role);
    
            // Mengambil data peminjaman setelah mendapatkan userId
            const peminjamanResponse = await axios.get(`http://127.0.0.1:8000/api/peminjamans/get?userId=${userData.id}`);
            const dataPeminjam = peminjamanResponse.data;
    
            // Filter data peminjaman sesuai dengan role pengguna
            let filter;
            if (userData.role === 'siswa' || userData.role === 'sarpras' || userData.role === 'guru' || userData.role === 'ketua_program') {
                filter = dataPeminjam.filter(peminjamanBarangs => peminjamanBarangs.peminjaman.user_id === userData.id);
            } else {
                filter = dataPeminjam;
            }
    
            // Menyimpan data peminjaman ke state
            setPeminjamanBarangs(filter);
        } catch (error) {
            console.error('Error fetching data:', error);
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
    
    const fetchPeminjamanTunggu = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/get`);
            const filteredPeminjamanTunggu = response.data.filter(peminjamanBarangs => {
                return peminjamanBarangs.status_peminjaman === 'Diajukan' && peminjamanBarangs.barang.user_id === userId;
            });
            setPeminjamanTunggu(filteredPeminjamanTunggu);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fungsi untuk mendapatkan barangId berdasarkan kodeBarang
    const getBarangId = async (kodeBarang) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/barangs/kode?kode=${kodeBarang}`);
            if (response.data && response.data.barang_id) {
                console.log("Data id barang:", response.data);
                return response.data.barang_id;
            } else {
                console.error("Barang tidak ditemukan atau respons tidak valid");
                return null;
            }
        } catch (error) {
            console.error("Gagal mendapatkan barang_id:", error);
            return null;
        }
    };

    const fetchPeminjamanKembali = async (barangId) => {
        try {
            console.log('Nilai barangId sebelum pemanggilan fetchPeminjamanKembali:', barangId);
    
            // Mengambil data peminjaman kembali dari endpoint API
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/get`);
    
            // Menyaring data peminjaman kembali yang memenuhi kriteria dengan barangId yang sesuai
            const filteredPeminjamanKembali = response.data.filter(peminjamanBarangs => {
                return (peminjamanBarangs.status_peminjaman === 'Dipinjam' || peminjamanBarangs.status_peminjaman === 'Terlambat') && peminjamanBarangs.barang.user_id === userId;
            });
    
            console.log("pengembalian:", filteredPeminjamanKembali);
            setPeminjamanKembali(filteredPeminjamanKembali);
        } catch (error) {
            console.error('Error fetching data:', error);
            console.log('URL yang dikirimkan:', `http://127.0.0.1:8000/api/peminjamans?barangId=${barangId}`);
        }
    };
    
    const handleRole = (role) => {
        if (role === 'siswa' || role === 'guru') {
            setShowPinjamButton(true);
            setShowActionColumn(false);
        } else if (role === 'ketua_program_keahlian') {
            setShowPinjamButton(true);
            setShowActionColumn(true);
        } else {
            setShowPinjamButton(false);
            setShowActionColumn(false);
        }
    };

    useEffect(() => {
        fetchDataAndUserData();
        fetchPeminjamanTunggu(userId);
        console.log("Nilai barangId: ", barangId)
        // Panggil fetchPeminjamanKembali hanya jika barangId tidak kosong
        if (barangId !== null) {
            fetchPeminjamanKembali(barangId);
        }
    }, [userId, barangId]); 

    const fetchUserDataById = async (peminjamId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/users/${peminjamId}`);
            setUserData(response.data); // Simpan data pengguna ke state
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    useEffect(() => {
        // Panggil fetchUserDataById saat userId berubah
        if (peminjamId) {
            fetchUserDataById(peminjamId);
        }
    }, [peminjamId]);

    const renderBarang = (peminjaman) => {
        return peminjaman.peminjaman_barangs.map((barang, index) => (
            <div key={index}>
                <p>
                    <strong>Nama Barang:</strong> {barang.barang.nama_barang}
                </p>
                <p>
                    <strong>Jumlah Dipinjam:</strong> {barang.jumlah_dipinjam}
                </p>
                {index !== peminjaman.peminjaman_barangs.length - 1 && <hr />} {/* Tampilkan garis pemisah jika bukan barang terakhir */}
            </div>
        ));
    };

    

    const approvePeminjaman = async (peminjamanBarangId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/peminjamans/updatestatus/${peminjamanBarangId}`, { status_peminjaman: 'Disetujui' });
            fetchDataAndUserData();
            // window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const [showCatatanModal, setShowCatatanModal] = useState(false);
    const handleShowCatatanModal = () => {
        setShowCatatanModal(true);
    };
    
    const handleCloseCatatanModal = () => {
        setRejectedPeminjamanId('');
        setShowCatatanModal(false);
    };

    const rejectPeminjaman = async (rejectedPeminjamanId, catatan) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/peminjamans/updatestatus/${rejectedPeminjamanId}`, { status_peminjaman: 'Tidak Disetujui', catatan: catatan });
            fetchDataAndUserData();
            console.log('Status updated:', response.data);
            handleCloseCatatanModal();
            // window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const changeStatus = async (peminjamanId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/peminjamans/updatestatus/${peminjamanId}`, { status_peminjaman: 'Dikembalikan' });
            fetchDataAndUserData();
            // window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
  return (
    <div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Slidebar />
            </div>
            <div className={`main ${isSidebarOpen ? 'shifted' : ''}`}>
                <div class="topbar">
                    <div class="toggle" onClick={toggleSidebar} >
                        <FontAwesomeIcon icon={faBars} /> 
                    </div>
                    <div class="search">
                        <label>
                            <input type="text" placeholder="Search here"   />
                            <FontAwesomeIcon className="icon" icon={faSearch} /> 
                        </label>
                    </div>
                    <div class="user">
                        <img src={avatar} alt="" />
                    </div>
                </div>
                <div className='datapengguna' >
                    <div className='body-flex'>
                        <div className='flex mx-6 d-flex justify-content-center'>
                            <div className='col-11 p-6'>
                            <h2 className='mb-3' style={{ backgroundColor: '#436850', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: 'white' }}>Data Pemakaian</h2>
                            <Nav variant="tabs" defaultActiveKey="peminjamanSaya">
    {(userRole === 'ketua_program' || userRole === 'sarpras') && (
        <Nav.Item>
            <Nav.Link eventKey="peminjamanSaya" onClick={() => setActiveTab('peminjamanSaya')}>
                Pemakaian Saya
            </Nav.Link>
        </Nav.Item>
    )}
    {(userRole === 'ketua_program' || userRole === 'sarpras') && (
        <Nav.Item>
            <Nav.Link eventKey="peminjamanMenunggu" onClick={() => setActiveTab('peminjamanMenunggu')}>
                Menunggu Persetujuan
            </Nav.Link>
        </Nav.Item>
    )}
</Nav>


{activeTab === 'peminjamanSaya' && (userRole === 'ketua_program' || userRole === 'sarpras' || userRole === 'siswa' || userRole === 'guru') && (
   <div> <Button variant="success" as={Link} to="/Permintaan" className='mt-3 mb-3'>
   Pemakaian Baru
</Button>
    <Modal show={showModal} onHide={handleCloseModal} centered>
    <Modal.Header closeButton>
        <Modal.Title>Pilih Jenis Peminjaman</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ display: 'flex', justifyContent: 'space-between' , padding: '30px 70px'}}>
        <Button variant="success" as={Link} to="/Peminjaman"  style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="mr-2" onClick={handleCloseModal}>
            Peminjaman Barang Inventaris
        </Button>
        <Button variant="success" as={Link} to="/Permintaan" style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleCloseModal}>
            Pemakaian Barang Habis Pakai
        </Button>
    </Modal.Body>
</Modal>
</div>
)}


{activeTab === 'peminjamanSaya' && (
    <div>
        <Table striped bordered hover responsive className="font-ubuntu" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <thead style={{ backgroundColor: '#436850', color: 'white' }}>
                <tr>
                    <th>No</th>
                    <th>Nama Pengguna</th>
                    <th>Nama Barang</th>
                    <th>Jumlah</th>
                    <th>Tanggal Pemakaian</th>
                    <th>Keperluan</th>
                    <th>Status</th>
                    <th>Catatan</th>
                </tr>
            </thead>
            <tbody>
                {currentData.map((peminjamanBarang, index) => (
                    <tr key={peminjamanBarang.id}>
                        <td>{indexOfFirstData + index + 1}</td>
                        <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                        <td>{peminjamanBarang.barang.nama_barang}</td>
                        <td>{peminjamanBarang.jumlah_dipinjam}</td>
                        <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                        <td>{peminjamanBarang.peminjaman.keperluan}</td>
                        <td>{peminjamanBarang.status_peminjaman}</td>
                        <td>{peminjamanBarang.catatan}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        {/* Tampilkan informasi jumlah data yang ditampilkan */}
        <div className='d-flex justify-content-between align-items-center mt-2'>
            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndex} to {endIndex} of {totalData} results</p>
            {/* Pagination */}
            <Pagination>
                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    </div>
)}


                            {activeTab === 'peminjamanMenunggu' && (
                                <div>
                            <Table striped bordered hover responsive className="font-ubuntu" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                    <thead style={{ backgroundColor: '#436850', color: 'white' }}>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama Pengguna</th>
                                            <th>Nama Barang</th>
                                            <th>Jumlah</th>
                                            <th>Tanggal Pemakaian</th>
                                            <th>Keperluan</th>
                                            <th>Status</th>
                                            <th>Catatan</th>
                                             <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {menungguDatas.map((peminjamanBarang, index) => (
                                            <tr key={peminjamanBarang.id}>
                                                <td>{indexOfFirstData + index + 1}</td>
                                                <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                                                <td>{peminjamanBarang.barang.nama_barang}</td>
                                                <td>{peminjamanBarang.jumlah_dipinjam}</td>
                                                <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                                                <td>{peminjamanBarang.peminjaman.keperluan}</td>
                                                <td>{peminjamanBarang.status_peminjaman}</td>
                                                <td>{peminjamanBarang.catatan}</td>
                                                
                                                    <td>
                                                        <Button variant="success" onClick={() => approvePeminjaman(peminjamanBarang.id)}>Setujui</Button>
                                                        &nbsp;
                                                        <Button variant="danger" onClick={() => {setRejectedPeminjamanId(peminjamanBarang.id);handleShowCatatanModal()}}>Tolak</Button>
                                                    </td>
                                                

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {/* Tampilkan informasi jumlah data yang ditampilkan */}
                                <div className='d-flex justify-content-between align-items-center mt-2'>
                                    <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndexs} to {endIndexs} of {totalMDatas} results</p>
                                    {/* Pagination */}
                                    <Pagination>
                                        <Pagination.Prev onClick={() => setMenungguPages(menungguPage - 1)} disabled={menungguPage === 1} />
                                        {Array.from({ length: totalMPages }, (_, index) => (
                                            <Pagination.Item key={index + 1} active={index + 1 === menungguPage} onClick={() => paginateM(index + 1)}>
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => setMenungguPages(menungguPage + 1)} disabled={menungguPage === totalMPages} />
                                    </Pagination>
                                </div>
                                </div>
                            )}
                            <Modal show={showCatatanModal} onHide={handleCloseCatatanModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Catatan</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group controlId="formCatatan">
                                        <Form.Label>Catatan</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={catatan}
                                            onChange={(e) => setCatatan(e.target.value)}
                                        />
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseCatatanModal}>
                                        Batal
                                    </Button>
                                    <Button variant="primary" onClick={() => rejectPeminjaman(rejectedPeminjamanId, catatan)}>
                                        Kirim
                                    </Button>
                                </Modal.Footer>
                            </Modal>


                            {activeTab === 'peminjamanKembali' && (
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Cari..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                handleSearch(e);
                                            }}
                                            className="mb-3"
                                        />
                                        <Table striped bordered hover responsive className="font-ubuntu" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                            <thead style={{ backgroundColor: '#436850', color: 'white' }}>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Nama Peminjam</th>
                                                    <th>Nama Barang</th>
                                                    <th>Jumlah Dipinjam</th>
                                                    <th>Tanggal Peminjaman</th>
                                                    <th>Tanggal Pengembalian</th>
                                                    <th>Keperluan</th>
                                                    <th>Status Peminjaman</th>
                                                    <th>Catatan</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {kembaliDatas.length > 0 ? (
                                                kembaliDatas.map((peminjamanBarang, index) => (
                                                    <tr key={peminjamanBarang.id}>
                                                            <td>{indexOfFirstData + index + 1}</td>
                                                            <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                                                            <td>{peminjamanBarang.barang.nama_barang}</td>
                                                            <td>{peminjamanBarang.jumlah_dipinjam}</td>
                                                            <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                                                            <td>{peminjamanBarang.peminjaman.tgl_pengembalian}</td>
                                                            <td>{peminjamanBarang.peminjaman.keperluan}</td>
                                                            <td>{peminjamanBarang.status_peminjaman}</td>
                                                            <td>{peminjamanBarang.catatan}</td>
                                                            <td>
                                                                <Button variant="primary" onClick={() => changeStatus(peminjamanBarang.id, 'status_baru')}>Dikembalikan</Button>
                                                            </td>
                                                        </tr>
                                                ))
                                            ) : (
                                                searchResult.map((peminjamanBarang, index) => (
                                                    <tr key={peminjamanBarang.id}>
                                                            <td>{indexOfFirstData + index + 1}</td>
                                                            <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                                                            <td>{peminjamanBarang.barang.nama_barang}</td>
                                                            <td>{peminjamanBarang.jumlah_dipinjam}</td>
                                                            <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                                                            <td>{peminjamanBarang.peminjaman.tgl_pengembalian}</td>
                                                            <td>{peminjamanBarang.peminjaman.keperluan}</td>
                                                            <td>{peminjamanBarang.status_peminjaman}</td>
                                                            <td>{peminjamanBarang.catatan}</td>
                                                            <td>
                                                                <Button variant="primary" onClick={() => changeStatus(peminjamanBarang.id, 'status_baru')}>Dikembalikan</Button>
                                                            </td>
                                                        </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </Table>
                                        {/* Tampilkan informasi jumlah data yang ditampilkan */}
                                        <div className='d-flex justify-content-between align-items-center mt-2'>
                                            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndexes} to {endIndexes} of {totalKDatas} results</p>
                                            {/* Pagination */}
                                            <Pagination>
                                                <Pagination.Prev onClick={() => setKembaliPages(kembaliPage - 1)} disabled={kembaliPage === 1} />
                                                {Array.from({ length: totalKPages }, (_, index) => (
                                                    <Pagination.Item key={index + 1} active={index + 1 === kembaliPage} onClick={() => paginateK(index + 1)}>
                                                        {index + 1}
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Next onClick={() => setKembaliPages(kembaliPage + 1)} disabled={kembaliPage === totalKPages} />
                                            </Pagination>
                                        </div>
                                    </div>
                                )}

                                
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
  )
}

export default Datapemakaian
