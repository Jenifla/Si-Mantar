import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEye, faEdit, faTrashAlt, faSearch, faPlus, faInfo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../assets/images.png";
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';
import { Link } from "react-router-dom";
import { Pagination } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import { toPng } from 'html-to-image';
import Laporan from '../laporan/laporan';
import "./Databarang.css"
const Databarang = () => {
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
    
    const [columnData, setColumnData] = useState([]);
    useEffect(() => {
        setColumnData([
            { header: 'Kode Barang', field: 'kode_barang' },
            { header: 'Nama Barang', field: 'nama_barang' },
            { header: 'Spesifikasi', field: 'spesifikasi' },
            { header: 'Pengadaan', field: 'pengadaan' },
            { header: 'Keadaan Barang', field: 'keadaan_barang' },
            { header: 'Letak Barang', field: 'letakbarang' },
            { header: 'Keterangan', field: 'keterangan_barang' },
        ]);
    }, []);

    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [filterBy, setFilterBy] = useState("");
    const [filterKeyword, setFilterKeyword] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Logika pengecekan role pengguna untuk menentukan akses
    const canModifyData = userRole === 'sarpras' || userRole === 'ketua_program';
    const [barang, setBarang] = useState([]);
    const [errorMessages, setErrorMessages] = useState({});
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
    const [showDelete, setShowDelete] = useState(false);
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
    
    const qrCodeRef = useRef(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState(null);
    const handleShowDetailModal = (barangId) => {
        const selectedBarang = barang.find(item => item.id === barangId);
        setSelectedBarang(selectedBarang);
        setShowDetailModal(true);
    };
    
    const downloadQRCode = () => {
        console.log('Download button clicked');
        setTimeout(() => {
          if (qrCodeRef.current) {
            console.log('QR code element found');
            toPng(qrCodeRef.current)
              .then((dataUrl) => {
                console.log('QR code converted to PNG', dataUrl);
                const link = document.createElement('a');
                link.download = `${selectedBarang.kode_barang}-qrcode.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setShowQRCode(true); // Memperlihatkan QR code setelah proses unduh selesai
              })
              .catch((error) => {
                console.error('Error generating QR code image:', error);
              });
          } else {
            console.error('QR code element not found');
          }
        }, 1000); // Menambahkan penundaan sedikit untuk memastikan QR code ter-render
      };

    useEffect(() => {
        if (selectedBarang) {
            setShowQRCode(true);
          }
        console.log('Current qrCodeRef value:', qrCodeRef.current);
    }, [ showQRCode, selectedBarang]);
    
    
    const [ruanganOptions, setRuanganOptions] = useState([]);
    const [jurusanOptions, setJurusanOpsi] = useState([]);
    console.log("data ruangan: ", ruanganOptions);
    console.log("data jurusan: ", jurusanOptions);
    console.log("data barang: ", barang)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeModal = () => {
        setErrorMessages({});
        // window.location.reload();
        setShow(false);
    };

    const getRuanganIdByName = (ruanganName) => {
        const ruangan = ruanganOptions.find(ruangan => ruangan.nama_ruangan === ruanganName);
        return ruangan ? ruangan.id : null;
    };

    const showModal = (databarang) => {
        // Mencocokkan ruangan_id dengan data ruangan
        const ruangan = ruanganOptions.find(ruangan => ruangan.id === parseInt(databarang.ruangan_id));
        
        // Jika data ruangan ditemukan, ambil nama ruangan, jika tidak, beri nilai default
        const letakbarang = ruangan ? ruangan.nama_ruangan : 'Tidak Diketahui';
    
        // Mengatur state data barang dengan letakbarang yang telah ditemukan
        setDatabarang({ ...databarang, letakbarang });
    
        // Menampilkan modal
        setShow(true);
    };

    useEffect(() => {
        const UserRole = localStorage.getItem('role');
        
        console.log("User role: ", UserRole)
        setUserRole(UserRole)
        fetchData();
    }, [userRole, userId]);

    const validateForm = () => {
        const errors = {};

        if (!databarang.nama_barang.trim()) {
            errors.nama_barang = "Nama Barang harus diisi!";
        }

        if (!databarang.jenis_barang.trim()) {
            errors.jenis_barang = "Jenis Barang harus dipilih!";
        }

        if (!databarang.kategori_barang.trim()) {
            errors.kategori_barang = "Kategori Barang harus dipilih!";
        }

        if (!databarang.keadaan_barang.trim()) {
            errors.keadaan_barang = "Keadaan Barang harus dipilih!";
        }

        // Validasi kuantitas
        if (databarang.kuantitas === null || databarang.kuantitas === undefined || databarang.kuantitas === "") {
            errors.kuantitas = "Kuantitas Barang harus diisi!";
        } else {
            // Pastikan kuantitas adalah angka
            const kuantitas = parseFloat(databarang.kuantitas);
            if (isNaN(kuantitas)) {
                errors.kuantitas = "Kuantitas Barang harus berupa angka!";
            } else if (kuantitas <= 0) {
                errors.kuantitas = "Kuantitas Barang harus lebih besar dari 0!";
            }
        }

        if (!databarang.pengadaan.trim()) {
            errors.pengadaan = "Tanggal Pengadaan Barang harus diisi!";
        }

        if (!databarang.letakbarang.trim() || databarang.letakbarang === "") {
            errors.letakbarang = "Letak Barang harus dipilih!";
        }

        setErrorMessages(errors); // Set state errorMessages sesuai dengan pesan kesalahan

        return Object.keys(errors).length === 0; // Mengembalikan true jika tidak ada kesalahan
    };

    const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
          const [userResponse, barangResponse, ruanganResponse, jurusanResponse] = await Promise.all([
            axios.post('http://127.0.0.1:8000/api/auth/me'),
            axios.get('http://127.0.0.1:8000/api/barangs'),
            axios.get('http://127.0.0.1:8000/api/ruangans'),
            axios.get('http://127.0.0.1:8000/api/jurusans')
          ]);
      
          const userRole = userResponse.data.role;
          const userId = userResponse.data.id;
          const barang = barangResponse.data;
          const ruanganOptions = ruanganResponse.data;
          const jurusanOptions = jurusanResponse.data;
      
          setUserRole(userRole);
          setUserId(userId);
          setBarang(barang);
          setRuanganOptions(ruanganOptions);
          setJurusanOpsi(jurusanOptions);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
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
      };
      
      
      

    const handleEditData = async () => {
        if (!validateForm()) {
            return; // Jika validasi gagal, hentikan proses pengiriman data
        }

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/barangs/update/${databarang.id}`, databarang);
            console.log('Data yang dikirim ke server:', databarang);
            console.log(response.data); // Output pesan sukses atau respon lain dari server
            fetchData();
            setErrorMessages({});
            setShow(false); // Tutup modal setelah berhasil memperbarui data
            alert("Data berhasil diperbarui");
            // window.location.reload();
        } catch (error) {
            console.error('Error updating data:', error);
            // Tampilkan pesan kesalahan atau lakukan penanganan kesalahan lainnya jika diperlukan
        }
    };

    // State untuk menyimpan data barang yang akan dihapus
const [deleteddatabarang, setDeleteddatabarang] = useState(null);

// State untuk menampilkan atau menyembunyikan modal konfirmasi
const [showConfirmationModal, setShowConfirmationModal] = useState(false);

// Fungsi untuk menampilkan modal konfirmasi
const showConfirmation = (databarang) => {
    setDeleteddatabarang(databarang);
    setShowConfirmationModal(true);
};

// Fungsi untuk menutup modal konfirmasi
const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
};

const handleDeleteData = async () => {
    try {
        // Kirim permintaan DELETE ke backend
        await axios.delete(`http://127.0.0.1:8000/api/barangs/${deleteddatabarang.id}`);
        
        // Perbarui state lokal untuk memperbarui tampilan
        const updatedBarangList = barang.filter(item => item.id !== deleteddatabarang.id);
        setBarang(updatedBarangList);
        
        // Tutup modal konfirmasi setelah penghapusan berhasil
        closeConfirmationModal();
        alert("Data berhasil dihapus");
    } catch (error) {
        console.error('Error deleting data:', error);
        // Tampilkan pesan kesalahan atau lakukan penanganan kesalahan lainnya jika diperlukan
    }
};

//perubahan search pertama
const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    
    // Filter data berdasarkan nilai pencarian
    const results = dataToRender.filter(item =>
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

    const applyFilters = () => {
        let filteredData = barang;
    
        // Terapkan filter berdasarkan kriteria yang dipilih
        if (filterBy === 'jenis_barang') {
            filteredData = barang.filter(item => item.jenis_barang === filterKeyword);
        } else if (filterBy === 'kategori_barang') {
            filteredData = barang.filter(item => item.kategori_barang === filterKeyword);
        } else if (filterBy === 'keadaan_barang') {
            filteredData = barang.filter(item => item.keadaan_barang === filterKeyword);
        } else if (filterBy === 'letakbarang') {
            // Ubah filterKeyword menjadi lowercase agar cocok dengan data dari tabel
            const filterKeywordLowerCase = filterKeyword.toLowerCase();
            filteredData = barang.filter(item => item.ruangan.nama_ruangan.toLowerCase().includes(filterKeywordLowerCase));
        } else if (filterBy === 'jurusan') {
            // Ubah filterKeyword menjadi lowercase agar cocok dengan data dari tabel
            const filterKeywordLowerCase = filterKeyword.toLowerCase();
            filteredData = barang.filter(item => item.jurusan.nama_jurusan.toLowerCase().includes(filterKeywordLowerCase));
        }
    
        console.log('Filtered Data:', filteredData); 
    
        // Perbarui state filteredData dengan hasil filter
        setFilteredData(filteredData);
        // Perbarui state searchResults untuk menampilkan data yang relevan saja
        setSearchResults(filteredData);
        setCurrentPage(1);
    };    

    const cancelFilter = () => {
        setFilterBy("");
        setFilterKeyword('');
        // Setel kembali filteredData dan searchResults ke null atau nilai default
        setFilteredData([]);
        setSearchResults([]);
    };



    return (
        <div>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Slidebar />
            </div>
            <div className={`main ${isSidebarOpen ? 'shifted' : ''}`}>
            <Topbar toggleSidebar={toggleSidebar} onSearch={handleSearch} />
                <div className='datapengguna' >
                    
                    <div className='body-flex'>
                        <div className='flex mx-6 d-flex justify-content-center'>
                            <div className='col-11 p-6'>
                                <h2 className='mb-3' style={{ backgroundColor: '#436850', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: 'white' }}>Data Barang</h2>
                                {canModifyData && (
                                <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    
                                        <Link to="/inputbarang" className='mt-3 mb-3 btn btn-success'>
                                            <FontAwesomeIcon icon={faPlus} /> Tambah Data
                                        </Link>
                                </div>
                                )}

                                {/* Modal form */}
                                <Modal show={show} onHide={closeModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Form Edit Data</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <Form.Group controlId="kodebarang">
                                                <Form.Label>Kode Barang</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={databarang.kode_barang}
                                                    readOnly
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="namabarang">
                                                <Form.Label>Nama Barang</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={databarang.nama_barang}
                                                    onChange={(e) => setDatabarang({ ...databarang, nama_barang: e.target.value })}
                                                />
                                                {errorMessages.nama_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.nama_barang}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="spesifikasi">
                                                <Form.Label>Spesifikasi</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={databarang.spesifikasi}
                                                    onChange={(e) => setDatabarang({ ...databarang, spesifikasi: e.target.value })}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="jenisbarang">
                                                <Form.Label>Jenis Barang</Form.Label>
                                                <Form.Select
                                                    value={databarang.jenis_barang}
                                                    onChange={(e) => setDatabarang({ ...databarang, jenis_barang: e.target.value })}
                                                >
                                                    <option value="">Pilih Jenis Barang</option>
                                                    <option value="barang sekolah">Barang Sekolah</option>
                                                    <option value="barang jurusan">Barang Jurusan</option>
                                                </Form.Select>
                                                {errorMessages.jenis_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.jenis_barang}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="kategoribarang">
                                                <Form.Label>Kategori Barang</Form.Label>
                                                <Form.Select
                                                    value={databarang.kategori_barang}
                                                    onChange={(e) => setDatabarang({ ...databarang, kategori_barang: e.target.value })}
                                                >
                                                    <option value="">Pilih Kategori Barang</option>
                                                    <option value="barang inventaris">Barang Inventaris</option>
                                                    <option value="barang habis pakai">Barang Habis Pakai</option>
                                                </Form.Select>
                                                {errorMessages.kategori_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.kategori_barang}</p>}
                                            </Form.Group>
                                            {/* Tanggal Pembelian */}
                                            <Form.Group controlId="pengadaan">
                                                <Form.Label>Pengadaan</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={databarang.pengadaan}
                                                    onChange={(e) => setDatabarang({ ...databarang, pengadaan: e.target.value })}
                                                />
                                                {errorMessages.pengadaan && <p style={{ color: 'red' }} className="error-message">{errorMessages.pengadaan}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="keadaanbarang">
                                                <Form.Label>Keadaan Barang</Form.Label>
                                                <Form.Select
                                                    value={databarang.keadaan_barang}
                                                    onChange={(e) => setDatabarang({ ...databarang, keadaan_barang: e.target.value })}
                                                >
                                                    <option value="">Pilih Keadaan Barang</option>
                                                    <option value="baik">Baik</option>
                                                    <option value="rusak ringan">Rusak Ringan</option>
                                                    <option value="rusak sedang">Rusak Sedang</option>
                                                    <option value="rusak berat">Rusak Berat</option>
                                                </Form.Select>
                                                {errorMessages.keadaan_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.keadaan_barang}</p>}
                                            </Form.Group>

                                            {/* Letak Barang */}
                                            <Form.Group controlId="letakbarang">
                                                <Form.Label>Letak Barang</Form.Label>
                                                <Form.Select
                                                    value={databarang.letakbarang}
                                                    onChange={(e) => {
                                                        // setDatabarang({ ...databarang, letakbarang: e.target.value })
                                                        // Dapatkan nilai letak barang yang dipilih
                                                    const selectedRuanganName = e.target.value;
                                                    console.log("Data letak barang :" , selectedRuanganName)
                                                    
                                                    // Cari objek ruangan yang sesuai berdasarkan nama ruangan
                                                    const selectedRuangan = ruanganOptions.find(ruangan => ruangan.nama_ruangan === selectedRuanganName);
                                                    
                                                    // Jika objek ruangan ditemukan, dapatkan ruangan ID dan jurusan ID
                                                    if (selectedRuangan) {
                                                        const ruanganId = selectedRuangan.id;
                                                        const jurusanId = selectedRuangan.jurusan_id;
                                                        
                                                        // Perbarui state databarang dengan ruangan ID dan jurusan ID yang baru
                                                        setDatabarang({ 
                                                            ...databarang, 
                                                            letakbarang: selectedRuanganName,
                                                            ruangan_id: ruanganId,
                                                            jurusan_id: jurusanId 
                                                        });
                                                        
                                                        console.log('Data barang setelah diperbarui:', {
                                                            ...databarang,
                                                            letakbarang: selectedRuanganName,
                                                            jurusan_id: jurusanId
                                                        });
                                                    } else {
                                                        // Jika objek ruangan tidak ditemukan, atur nilai letak barang menjadi kosong
                                                        setDatabarang({ 
                                                            ...databarang, 
                                                            letakbarang: selectedRuanganName,
                                                            ruangan_id: null,
                                                            jurusan_id: null 
                                                        });
                                                    }
                                                }}
                                                >
                                                    <option value="">Pilih Letak Barang</option>
                                                    {ruanganOptions.map((ruangan) => (
                                                            <option key={ruangan.id} value={ruangan.nama_ruangan}>{ruangan.nama_ruangan}</option>
                                                        ))}
                                                </Form.Select>
                                                {errorMessages.letakbarang && <p style={{ color: 'red' }} className="error-message">{errorMessages.letakbarang}</p>}
                                            </Form.Group>


                                            {/* Jumlah Barang */}
                                            <Form.Group controlId="kuantitas">
                                                <Form.Label>Kuantitas</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={databarang.kuantitas}
                                                    onChange={(e) => setDatabarang({ ...databarang, kuantitas: e.target.value })}
                                                />
                                                {errorMessages.kuantitas && <p style={{ color: 'red' }} className="error-message">{errorMessages.kuantitas}</p>}
                                            </Form.Group>

                                            {/* Deskripsi */}
                                            <Form.Group controlId="keterangan">
                                                <Form.Label>Keterangan Barang</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={databarang.keterangan_barang}
                                                    onChange={(e) => setDatabarang({ ...databarang, keterangan_barang: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={closeModal}>Batal</Button>
                                        <Button variant="primary" onClick={handleEditData}>Simpan</Button>
                                    </Modal.Footer>
                                </Modal>

                                <Modal show={showConfirmationModal} onHide={closeConfirmationModal} centered>
                                    
                                    <Modal.Body className="text-center" style={{ borderBottom: 'none' }}>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger mb-3" style={{ fontSize: '6em' }} />
                                        <h4>Apakah anda yakin?</h4>
                                        <p>Data yang sudah dihapus mungkin tidak bisa dikembalikan lagi!</p>
                                        <Button variant="primary" onClick={closeConfirmationModal}>Batal</Button>
                                        &nbsp;
                                        &nbsp;
                                        <Button variant="danger" onClick={handleDeleteData}>Hapus</Button>
                                    </Modal.Body>
                                </Modal>
                                <div className="row align-items-center">
                                    <div className="col-md-1" style={{ minWidth: '100px', marginBottom: '20px' }}>
                                        <Form.Label>Filter By:</Form.Label>
                                    </div>
                                    <div className="col-md-3" style={{ marginBottom: '20px' }}>
                                        <Form.Group controlId="filterBy">
                                            <Form.Control as="select" onChange={(e) => setFilterBy(e.target.value)}>
                                                <option value="">Select Filter</option>
                                                <option value="jenis_barang">Jenis Barang</option>
                                                <option value="kategori_barang">Kategori Barang</option>
                                                <option value="keadaan_barang">Keadaan Barang</option>
                                                <option value="jurusan">Jurusan</option>
                                                <option value="letakbarang">Letak Barang</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3"style={{ marginBottom: '20px' }}>
                                        <Form.Group controlId="filterKeyword">
                                            {filterBy === 'jenis_barang' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Jenis Barang</option>
                                                    <option value="barang sekolah">Barang Sekolah</option>
                                                    <option value="barang jurusan">Barang Jurusan</option>
                                                </Form.Control>
                                            )}
                                            {filterBy === 'kategori_barang' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Kategori Barang</option>
                                                    <option value="barang inventaris">Barang Inventaris</option>
                                                    <option value="barang habis pakai">Barang Habis Pakai</option>
                                                </Form.Control>
                                            )}
                                            {filterBy === 'keadaan_barang' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Keadaan Barang</option>
                                                    <option value="baik">Baik</option>
                                                    <option value="rusak ringan">Rusak Ringan</option>
                                                    <option value="rusak sedang">Rusak Sedang</option>
                                                    <option value="rusak berat">Rusak Berat</option>
                                                </Form.Control>
                                            )}
                                            {filterBy === 'jurusan' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Jurusan</option>
                                                    {jurusanOptions.map((jurusan) => (
                                                        <option key={jurusan.id} value={jurusan.nama_jurusan}>{jurusan.nama_jurusan}</option>
                                                    ))}
                                                </Form.Control>
                                            )}
                                            {filterBy === 'letakbarang' && (
                                                <Form.Control as="select" value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)}>
                                                    <option value="">Select Letak Barang</option>
                                                    {ruanganOptions.map((ruangan) => (
                                                        <option key={ruangan.id} value={ruangan.nama_ruangan}>{ruangan.nama_ruangan}</option>
                                                    ))}
                                                </Form.Control>
                                            )}
                                            {/* Tampilkan input teks jika tidak ada filter yang dipilih */}
                                            {filterBy !== 'jenis_barang' && filterBy !== 'kategori_barang' && filterBy !== 'keadaan_barang' && filterBy !== 'jurusan' && filterBy !== 'letakbarang' && (
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



                                <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size='lg'>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Detail Barang</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                    <div className="detail-container">
                                        <div className="gambar-container">
                                        {selectedBarang && (
                                            <div ref={qrCodeRef} >
                                            <QRCode value={selectedBarang.barcode} size={256} />
                                            <p style={{ textAlign: "center" }}>{selectedBarang.kode_barang} - {selectedBarang.nama_barang}</p>
                                        </div>
                                        )}
                                        {canModifyData && (
                                        <button className="barcode-button" onClick={downloadQRCode}>Download QR Code</button>
                                        )}
                                        </div>
                                        <div className="info-container">
                                            {selectedBarang && (
                                            <table className="detail-table">
                                                <tbody>
                                                    <tr>
                                                        <th>Kode Barang</th>
                                                        <td>{selectedBarang.kode_barang}</td>
                                                    </tr>
                                                    <tr>
                                                                <th>Nama Barang</th>
                                                                <td>{selectedBarang.nama_barang}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Spesifikasi</th>
                                                                <td>{selectedBarang.spesifikasi}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Pengadaan</th>
                                                                <td>{selectedBarang.pengadaan}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Jenis Barang</th>
                                                                <td>{selectedBarang.jenis_barang}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Kategori Barang</th>
                                                                <td>{selectedBarang.kategori_barang}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Keadaan Barang</th>
                                                                <td>{selectedBarang.keadaan_barang}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Kuantitas</th>
                                                                <td>{selectedBarang.kuantitas}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Letak Barang</th>
                                                                <td>{selectedBarang.ruangan.nama_ruangan}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Keterangan</th>
                                                                <td>{selectedBarang.keterangan_barang}</td>
                                                            </tr>
                                                </tbody>
                                            </table>
                                            )}
                                        </div>
                                    </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>


                                {loading ?(
                                    <div>Loading...</div>
                                ) : (
                                    <div>
                                
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
                                            <th>Action</th>
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
                                                <td>
                                                    {canModifyData && (
                                                        <Button variant="primary" onClick={() => showModal(barang)}>
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Button>
                                                    )}
                                                    &nbsp;
                                                    {canModifyData && (
                                                        <Button variant="danger" onClick={() => showConfirmation(barang)}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </Button>
                                                    )}
                                                    &nbsp;
                                                    <Button  className='btn btn-info'>
                                                            <FontAwesomeIcon icon={faEye} onClick={() => handleShowDetailModal(barang.id)}/>
                                                        </Button>
                                                    
                                                </td>
                                            </tr>
                                        ))}
                                        {showNoDataMessage && (
                                        <tr>
                                            <td colSpan="14" style={{ textAlign: 'center' }}>No data available</td>
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
                                    <Pagination.Prev onClick={() =>  handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() =>  handlePageChange(index + 1)}>
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() =>  handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                </Pagination>
                            </div>
                            </div>
                                )
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Databarang;
