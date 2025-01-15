import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEye, faEdit, faTrashAlt, faSearch, faPlus, faInfo, faExclamationTriangle, faPrint } from '@fortawesome/free-solid-svg-icons';
import avatar from "../assets/images.png";
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';
import { Link } from "react-router-dom";
import { Pagination } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import LaporanPeminjaman from '../LaporanPeminjaman/LaporanPeminjaman';
import "../DataBarang/Databarang.css"
import { useNavigate } from 'react-router-dom';
const Laporanpem = () => {
    const navigate = useNavigate();
    const laporanRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => laporanRef.current,
  });


    const [showLaporan, setShowLaporan] = useState(false); 
    const [userData, setUserData] = useState([]);

useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users');
            const usersWithImageUrl = response.data.map(user => {
                return {
                    ...user,
                    ttd_url: `http://127.0.0.1:8000/api/users/ttd/${user.ttd}` // Sesuaikan dengan URL gambar TTD yang sesuai
                };
            });
            setUserData(usersWithImageUrl);
            console.log("data ttdurl: ", usersWithImageUrl[1].ttd_url);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchUserData();
}, []);
    const [dataToRender, setDataToRender] = useState([]);
    console.log("data render:", dataToRender)
    const handleCetakLaporan = async () => {
        // console.log("Data yang akan dikirim ke /laporan:", data);
        console.log("Data kolom:", columnData);
        setShowLaporan(true); // Setel state untuk menampilkan komponen laporan
    };

    const handleCloseLaporan = () => {
        setShowLaporan(false); // Setel state untuk menyembunyikan komponen laporan
    };

    
    const [columnData, setColumnData] = useState([]);
    useEffect(() => {
        setColumnData([
            { header: 'Nama Pengguna', field: 'peminjaman.nama_peminjam' },
            { header: 'Nama Barang', field: 'barang.nama_barang' },
            { header: 'Jumlah', field: 'jumlah_dipinjam' },
            { header: 'Tanggal Peminjaman', field: 'peminjaman.tgl_peminjaman' },
            { header: 'Tanggal Pengembalian', field: 'peminjaman.tgl_pengembalian' },
            { header: 'Keperluan', field: 'peminjaman.keperluan' },
            { header: 'Status', field: 'status_peminjaman' },
            { header: 'Catatan', field: 'catatan' },
        ]);
    }, []);

    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [filterBy, setFilterBy] = useState("");
    const [filterKeyword, setFilterKeyword] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const [barang, setBarang] = useState([]);
    const [peminjamanData, setPeminjamanData] = useState([]);


    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10); 

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndex = (currentPage - 1) * dataPerPage + 1;
    const endIndex = Math.min(startIndex + dataPerPage - 1, dataToRender.length);

    // Potong data sesuai dengan indeks data awal dan akhir
    const currentData = dataToRender.slice(startIndex - 1, endIndex);

    // Hitung jumlah total halaman
    const totalPages = Math.ceil(dataToRender.length / dataPerPage);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [jurusans, setJurusan] = useState([]);
    const [databarang, setDatabarang] = useState({
        id: '',
        user_id: '',
        jurusan_id: '',
        kode_barang: '',
        nama_barang: '',
        spesifikasi: '',
        jenis_barang: '',
        kategori_barang: '',
        pengadaan: '',
        letakbarang: '',
        kuantitas: '',
        keterangan_barang: '',
        keadaan_barang: ''
    });
    
    
    const [ruanganOptions, setRuanganOptions] = useState([]);
    const [jurusanOptions, setJurusanOpsi] = useState([]);
    const [selectedJurusan, setSelectedJurusan] = useState('');
    const [selectedJurusanId, setSelectedJurusanId] = useState(null);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);


    // Fungsi untuk mencari ID jurusan berdasarkan nama jurusan
    const findJurusanIdByName = (namaJurusan) => {
        const jurusan = jurusanOptions.find(jurusan => jurusan.nama_jurusan.toLowerCase() === namaJurusan.toLowerCase());
        return jurusan ? jurusan.id : null; // Kembalikan ID jurusan jika ditemukan, atau null jika tidak ditemukan
    };

    // Panggil fungsi findJurusanIdByName saat selectedJurusan berubah
    useEffect(() => {
        if (selectedJurusan) {
            const jurusanId = findJurusanIdByName(selectedJurusan);
            
            
        }
        console.log("ID Jurusan:", selectedJurusanId);
    }, [selectedJurusan]);
    console.log("data ruangan: ", ruanganOptions);
    console.log("data jurusan: ", jurusanOptions);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeModal = () => {
        // window.location.reload();
        setShow(false);
    };

    // Add an effect to monitor changes in filterKeyword and update the selectedJurusanId
    useEffect(() => {
        if (filterBy === 'letakbarang' && filterKeyword) {
            const selectedRoom = ruanganOptions.find(ruangan => ruangan.nama_ruangan === filterKeyword);
            if (selectedRoom) {
                // setSelectedJurusanId(selectedRoom.jurusan_id);
            }
        } else {
            setSelectedJurusanId(null);
        }
    }, [filterKeyword, filterBy, ruanganOptions]);


    useEffect(() => {
        const UserRole = localStorage.getItem('role');
        
        console.log("User role: ", UserRole)
        console.log("value key:", filterKeyword)
        setUserRole(UserRole)
        fetchDataBarang();
        fetchDataRuangan();
        fetchDataJurusan();
    }, [userRole, userId]);

    

    const fetchDataBarang = async () => {
        try {
            
    
            const barangResponse = await axios.get('http://127.0.0.1:8000/api/barangs/lap');
        const barang = barangResponse.data;
        console.log("data barang: ", barang);

        setBarang(barang);
            
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    const fetchDataRuangan = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/ruangans');
            setRuanganOptions(response.data);
            console.log("data ruangan:" ,response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fetchDataJurusan = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/jurusans');
            setJurusanOpsi(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        const fetchPeminjamanData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/get`);
            const filteredPeminjaman = response.data.filter(peminjamanBarang => {
                return (peminjamanBarang.status_peminjaman !== 'Diajukan' && peminjamanBarang.status_peminjaman !== 'Tidak Disetujui');
            });
            setPeminjamanData(filteredPeminjaman);
          } catch (error) {
            console.error('Error fetching peminjaman data:', error);
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
    
        fetchPeminjamanData();
      }, []);

//perubahan search pertama
const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    
    // Filter data berdasarkan nilai pencarian
    const results = peminjamanData.filter(item =>
        item && (
            (item.peminjaman.nama_peminjam && item.peminjaman.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.barang.nama_barang && item.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.jumlah_dipinjam && item.jumlah_dipinjam.toString().includes(searchTerm)) ||
            (item.peminjaman.tgl_peminjaman && item.peminjaman.tgl_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.peminjaman.tgl_pengembalian && item.peminjaman.tgl_pengembalian.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.peminjaman.keperluan && item.peminjaman.keperluan.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.status_peminjaman && item.status_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.catatan && item.catatan.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    // Set state searchResults dengan hasil pencarian
    setSearchResults(results);
    setCurrentPage(1);
};


    useEffect(() => {
        if (filteredData.length > 0 ) {
            setDataToRender(filteredData);
            setShowNoDataMessage(false);
        } else if (searchTerm && searchResults.length > 0) {
            setDataToRender(searchResults);
            setShowNoDataMessage(false);
        } else if (filterBy || filterKeyword || searchTerm) {
            setDataToRender([]);
            setShowNoDataMessage(true);
        } else {
            setDataToRender(peminjamanData);
            setShowNoDataMessage(false);
        }
    }, [filteredData, searchTerm, searchResults, peminjamanData]);
    // Fungsi untuk mengatur nilai filterBy
    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
        
    };

    // Fungsi untuk mengatur nilai filterKeyword
    const handleFilterKeywordChange = (event) => {
        const value = event.target.value;
        setFilterKeyword(value);
        
    
        // Temukan objek jurusan berdasarkan ID
        const selectedJurusanObject = jurusanOptions.find(jurusan => jurusan.id === value);
        
        // Setel ID jurusan yang dipilih ke state selectedJurusan
        setSelectedJurusan(selectedJurusanObject ? selectedJurusanObject.id : '');
    };

    const applyFilters = () => {
        let filteredData = [];
    
        // Terapkan filter berdasarkan kriteria yang dipilih
        if (filterBy === 'status peminjaman') {
            // Ubah filterKeyword menjadi lowercase agar cocok dengan data dari tabel
            const filterKeywordLowerCase = filterKeyword.toLowerCase();
            filteredData = peminjamanData.filter(item => item.status_peminjaman.toLowerCase().includes(filterKeywordLowerCase));
        } else if (filterBy === 'jurusan') {
            // Ubah filterKeyword menjadi lowercase agar cocok dengan data dari tabel
            filteredData = peminjamanData.filter(item => item.barang.jurusan_id.toString() === filterKeyword);
            setSelectedJurusan(filterKeyword);
            const filterKeywordId = parseInt(filterKeyword);
            setSelectedJurusanId(filterKeywordId);
            
            console.log("juruy:", filterKeywordId);
        }
    
        console.log('Filtered Data:', filteredData); // Tambahkan ini untuk memeriksa data yang difilter
        const lfilter =filteredData.length;
        if(lfilter === 0){
            setDataToRender([])
            setShowNoDataMessage(true);
        }
        
        // Perbarui state filteredData dengan hasil filter
        setFilteredData(filteredData);
        // Perbarui state searchResults untuk menampilkan data yang relevan saja
        setSearchResults(filteredData);
        setCurrentPage(1);
    };    

    const cancelFilter = () => {
        setFilterBy("");
        setFilterKeyword('');
        // Setel kembali filteredData dan searchResults ke null atau nilai default jika perlu
        setFilteredData([]);
        setSearchResults([]);
    };



    return (
        <div>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Slidebar />
            </div>
            <div className={`main ${isSidebarOpen ? 'shifted' : ''}`}>
            {!showLaporan && (
                <div className='top-bar'>
                    <Topbar toggleSidebar={toggleSidebar} onSearch={handleSearch}/>
                </div>
            )}
                {!showLaporan && (
                <div className='datapengguna' >
                    
                    <div className='body-flex'>
                        <div className='flex mx-6 d-flex justify-content-center'>
                            <div className='col-11 p-6'>
                                <h2 className='mb-3' style={{ backgroundColor: '#436850', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: 'white' }}>Laporan Barang</h2>
                                
                                <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <button className='mt-3 mb-3 btn btn-secondary' onClick={() => handleCetakLaporan(dataToRender, filterBy, filterKeyword, columnData)}>
        Lihat Laporan
    </button>
</div>

                                <div className="row align-items-center">
                                    <div className="col-md-1" style={{ minWidth: '100px', marginBottom: '20px' }}>
                                        <Form.Label>Filter By:</Form.Label>
                                    </div>
                                    <div className="col-md-3" style={{ marginBottom: '20px' }}>
                                        <Form.Group controlId="filterBy">
                                            <Form.Control as="select" onChange={(e) => setFilterBy(e.target.value)}>
                                                <option value="">Select Jenis Laporan</option>
                                                <option value="jurusan">Laporan Peminjaman per Jurusan</option>
                                                <option value="status peminjaman">Laporan Peminjaman per Status</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3"style={{ marginBottom: '20px' }}>
                                        <Form.Group controlId="filterKeyword">
                            
                                            {filterBy === 'jurusan' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Jurusan</option>
                                                    {jurusanOptions.map((jurusan) => (
                                                        <option key={jurusan.id} value={jurusan.id}>{jurusan.nama_jurusan}</option>
                                                    ))}
                                                </Form.Control>
                                            )}
                                            {filterBy === 'status peminjaman' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value="Disetujui">Disetujui</option>
                                                    <option value="Dipinjam">Dipinjam</option>
                                                    <option value="Terlambat">Terlambat</option>
                                                    <option value="Dikembalikan">Dikembalikan</option>
                                                </Form.Control>
                                            )}
                                            {/* Tampilkan input teks jika tidak ada filter yang dipilih */}
                                            { filterBy !== 'jurusan' && filterBy !== 'status peminjaman' && (
                                                <Form.Control
                                                    
                                                    value={filterKeyword}
                                                    disabled
                                                    onChange={(e) => setFilterKeyword(e.target.value)}
                                                />
                                            )}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-1" style={{ minWidth: '120px', marginBottom: '20px' }}>
                                        <Button variant="primary" onClick={applyFilters}>Tampilkan</Button>
                                    </div>
                                    <div className="col-md-1" style={{ marginBottom: '20px' }}>
                                        <Button variant="secondary" onClick={cancelFilter}>Batal</Button>
                                    </div>
                                </div>

                            
                                <Table striped bordered hover responsive className="font-ubuntu" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                    <thead style={{ backgroundColor: '#436850', color: 'white' }}>
                                        <tr>
                                        <th>No</th>
                                        <th>Nama Pengguna</th>
                                        <th>Nama Barang</th>
                                        <th>Jumlah</th>
                                        <th>Tanggal Peminjaman</th>
                                        <th>Tanggal Pengembalian</th>
                                        <th>Keperluan</th>
                                        <th>Status</th>
                                        <th>Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {currentData.map((peminjamanBarang, index) => (
                                        <tr key={peminjamanBarang.id}>
                                        <td>{index + 1}</td>
                                        <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                                        <td>{peminjamanBarang.barang.nama_barang}</td>
                                        <td>{peminjamanBarang.jumlah_dipinjam}</td>
                                        <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                                        <td>{peminjamanBarang.peminjaman.tgl_pengembalian}</td>
                                        <td>{peminjamanBarang.peminjaman.keperluan}</td>
                                        <td>{peminjamanBarang.status_peminjaman}</td>
                                        <td>{peminjamanBarang.catatan}</td>
                                        </tr>
                                    ))}
                                    {showNoDataMessage && (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center' }}>No data available</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                                {/* Tampilkan informasi jumlah data yang ditampilkan */}
        <div className='d-flex justify-content-between align-items-center mt-2'>
            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndex} to {endIndex} of {dataToRender.length} results</p>
        
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
                    </div>
                </div>
                )}
                {showLaporan && (
                    <div className='datapengguna'>
                        <LaporanPeminjaman ref={laporanRef} data={dataToRender} columnData={columnData} jurusanId={selectedJurusanId} jenislap={filterBy} detaillap={filterKeyword}/>
                         <div className="floating-buttons">
                            <button onClick={handleCloseLaporan} style={{ fontSize: '24px', lineHeight: '24px', padding: '10px 20px' }}>&times;</button>
                            {(userRole === 'sarpras' || userRole === 'ketua_program')&&(
                            <button onClick={handlePrint}><FontAwesomeIcon icon={faPrint} /></button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Laporanpem;
