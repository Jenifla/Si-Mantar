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
import QRCode from 'qrcode.react';
import Laporan from '../laporan/laporan';
import "../DataBarang/Databarang.css"
import { useNavigate } from 'react-router-dom';
const Laporanbarang = () => {
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
            { header: 'Kode Barang', field: 'kode_barang' },
            { header: 'Nama Barang', field: 'nama_barang' },
            { header: 'Spesifikasi', field: 'spesifikasi' },
            { header: 'Pengadaan', field: 'pengadaan' },
            { header: 'Keadaan Barang', field: 'keadaan_barang' },
            { header: 'Jumlah Barang', field: 'kuantitas' },
            { header: 'Keterangan', field: 'keterangan_barang' },
            { header: 'Status Ketersediaan', field: 'status_ketersediaan' },
        ]);
    }, []);

    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [filterBy, setFilterBy] = useState("");
    const [filterKeyword, setFilterKeyword] = useState('');
    const [filteredData, setFilteredData] = useState([]);


    // Logika pengecekan role pengguna untuk menentukan akses
    const canModifyData = userRole === 'sarpras' || userRole === 'ketua_program';

    const [barang, setBarang] = useState([]);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);


    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10); // Ubah sesuai kebutuhan Anda

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

    // Fungsi untuk mencari ID jurusan berdasarkan nama jurusan
    const findJurusanIdByName = (namaJurusan) => {
        const jurusan = jurusanOptions.find(jurusan => jurusan.nama_jurusan.toLowerCase() === namaJurusan.toLowerCase());
        return jurusan ? jurusan.id : null; // Kembalikan ID jurusan jika ditemukan, atau null jika tidak ditemukan
    };

    // Panggil fungsi findJurusanIdByName saat selectedJurusan berubah
    useEffect(() => {
        if (selectedJurusan) {
            const jurusanId = findJurusanIdByName(selectedJurusan);
            console.log("ID Jurusan:", jurusanId);
            setSelectedJurusanId(jurusanId); // Simpan ID jurusan dalam state
        }
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
                setSelectedJurusanId(selectedRoom.jurusan_id);
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


//perubahan search pertama
const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    
    // Filter data berdasarkan nilai pencarian
    const results = barang.filter(item =>
        item && (
            (item.kode_barang && item.kode_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.nama_barang && item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.spesifikasi && item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.jenis_barang && item.jenis_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.kategori_barang && item.kategori_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.pengadaan && item.pengadaan.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.keadaan_barang && item.keadaan_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.ruangan.nama_ruangan && item.ruangan.nama_ruangan.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.jurusan.nama_jurusan && item.jurusan.nama_jurusan.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.status_ketersediaan && item.status_ketersediaan.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.keterangan_barang && item.keterangan_barang.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    // Set state searchResults dengan hasil pencarian
    setSearchResults(results);
    setCurrentPage(1);
};


    useEffect(() => {
        if (filteredData.length > 0) {
            setDataToRender(filteredData);
            setShowNoDataMessage(false);
        } else if (searchTerm && searchResults.length > 0) {
            setDataToRender(searchResults);
            setShowNoDataMessage(false);
        } else if (filterBy || filterKeyword || searchTerm) {
            setDataToRender([]);
            setShowNoDataMessage(true);
        } else {
            setDataToRender(barang);
            setShowNoDataMessage(false);
        }
    }, [filteredData, searchTerm, searchResults, barang]);
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
        let filteredData = barang;
    
        // Terapkan filter berdasarkan kriteria yang dipilih
        if (filterBy === 'jenis_barang') {
            filteredData = barang.filter(item => item.jenis_barang === filterKeyword);
        } else if (filterBy === 'kategori_barang') {
            filteredData = barang.filter(item => item.kategori_barang === filterKeyword);
        } else if (filterBy === 'keadaan_barang') {
            filteredData = barang.filter(item => item.keadaan_barang === filterKeyword);
        } else if (filterBy === 'letak barang') {
            // Ubah filterKeyword menjadi lowercase agar cocok dengan data dari tabel
            const filterKeywordLowerCase = filterKeyword.toLowerCase();
            filteredData = barang.filter(item => item.ruangan.nama_ruangan.toLowerCase().includes(filterKeywordLowerCase));
        } else if (filterBy === 'jurusan') {
            // Ubah filterKeyword menjadi lowercase agar cocok dengan data dari tabel
            const filterKeywordLowerCase = filterKeyword.toLowerCase();
            filteredData = barang.filter(item => item.jurusan.nama_jurusan.toLowerCase().includes(filterKeywordLowerCase));
            setSelectedJurusan(filterKeyword);
            
            console.log("juruy:", filterKeyword);
        }
    
        console.log('Filtered Data:', filteredData); // Tambahkan ini untuk memeriksa data yang difilter
    
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
                                                <option value="jurusan">Laporan Barang per Jurusan</option>
                                                <option value="letak barang">Laporan Barang per Ruangan</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3"style={{ marginBottom: '20px' }}>
                                        <Form.Group controlId="filterKeyword">
                                            
                                            {filterBy === 'jurusan' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Jurusan</option>
                                                    {jurusanOptions.map((jurusan) => (
                                                        <option key={jurusan.id} value={jurusan.nama_jurusan}>{jurusan.nama_jurusan}</option>
                                                    ))}
                                                </Form.Control>
                                            )}
                                            {filterBy === 'letak barang' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Ruangan</option>
                                                    {ruanganOptions.map((ruangan) => (
                                                        <option key={ruangan.id} value={ruangan.nama_ruangan}>{ruangan.nama_ruangan}</option>
                                                    ))}
                                                </Form.Control>
                                            )}
                                            {/* Tampilkan input teks jika tidak ada filter yang dipilih */}
                                            {filterBy !== 'jurusan' && filterBy !== 'letak barang' && (
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
                                            <th>Kode Barang</th>
                                            <th>Nama Barang</th>
                                            <th>Spesifikasi</th>
                                            <th>Jenis Barang</th>
                                            <th>Kategori Barang</th>
                                            <th>Pengadaan</th>
                                            <th>Keadaan Barang</th>
                                            <th>Letak Barang</th>
                                            <th>Jurusan</th>
                                            <th>Jumlah Barang</th>
                                            <th>Keterangan</th>
                                            <th>Status Ketersedianan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {currentData.map((barang, index) => (
                                            <tr key={barang.id}>
                                                <td>{startIndex + index}</td>
                                                <td>{barang.kode_barang}</td>
                                                <td>{barang.nama_barang}</td>
                                                <td>{barang.spesifikasi}</td>
                                                <td>{barang.jenis_barang}</td>
                                                <td>{barang.kategori_barang}</td>
                                                <td>{barang.pengadaan}</td>
                                                <td>{barang.keadaan_barang}</td>
                                                <td>{barang.ruangan.nama_ruangan}</td>
                                                <td>{barang.jurusan.nama_jurusan}</td>
                                                <td>{barang.kuantitas}</td>
                                                <td>{barang.keterangan_barang}</td>
                                                <td>{barang.status_ketersediaan}</td>
                                            </tr>
                                        ))}
                                        {showNoDataMessage && (
                                        <tr>
                                            <td colSpan="13" style={{ textAlign: 'center' }}>No data available</td>
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
                        <Laporan ref={laporanRef} data={dataToRender} columnData={columnData} jurusanId={selectedJurusanId} jenislap={filterBy} detaillap={filterKeyword}/>
                        
                         <div className="floating-buttons">
                            
                            <button onClick={handleCloseLaporan} style={{ fontSize: '24px', lineHeight: '24px', padding: '10px 20px' }}>&times;</button>
                            {(userRole === 'sarpras' || userRole === 'ketua_program') &&(
                            <button onClick={handlePrint}><FontAwesomeIcon icon={faPrint} /></button>
                            )}
                        </div>
                        
                    </div>
                )}
            </div>
        </div>
    )
}

export default Laporanbarang;
