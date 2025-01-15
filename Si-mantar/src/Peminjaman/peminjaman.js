import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Table, Pagination } from "react-bootstrap"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEye, faEdit, faTrashAlt, faSearch, faPlus, faInfo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "./peminjaman.css";
import QrScanner from 'react-qr-scanner';
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';
import avatar from "../assets/images.png";


const FormPeminjaman = () => {
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    const [scannedBarcode, setScannedBarcode] = useState("");
    const handleScan = (data) => {
        if (data) {
            console.log("Hasil pemindaian:", data);

            // Memisahkan string berdasarkan karakter baris baru (\n)
        const parts = data.text.split("\n");
        // Inisialisasi variabel untuk menyimpan nilai kode barang dan nama barang
        let kodeBarangValue = "";
        let namaBarangValue = "";
        let jenisBarang = "";

        // Iterasi melalui setiap bagian hasil pemindaian
        parts.forEach(part => {
            // Jika bagian mengandung kata kunci "Kode Barang"
            if (part.includes("Kode Barang")) {
                // Mendapatkan nilai Kode Barang dari bagian tersebut
                kodeBarangValue = part.split(":")[1].trim();
            }
            // Jika bagian mengandung kata kunci "Nama Barang"
            if (part.includes("Nama Barang")) {
                // Mendapatkan nilai Nama Barang dari bagian tersebut
                namaBarangValue = part.split(":")[1].trim();
            }

            // Jika bagian mengandung kata kunci "Jenis Barang"
            if (part.includes("Kategori Barang")) {
                // Mendapatkan nilai Jenis Barang dari bagian tersebut
                jenisBarang = part.split(":")[1].trim();
            }
        });

        // Jika bagian yang mengandung kata kunci "Kode Barang" ditemukan
        // Jika nilai kode barang dan nama barang berhasil didapatkan
        if (kodeBarangValue && namaBarangValue) {
            // Menggabungkan kode barang dan nama barang menjadi satu string dan menyimpannya ke dalam state
            console.log("Nama Barang pemindaian:", namaBarangValue);
            setKodeBarang(`${kodeBarangValue}-${namaBarangValue}`);
            console.log("Data pe Barang:", setKodeBarang);
            console.log("Kode Barang pemindaian:", kodeBarangValue);
            // Panggil handleKodeBarangChange untuk memproses perubahan kode barang
            handleKodeBarangChange({ target: { value: kodeBarangValue } });
            // Validasi jenis barang
            if (jenisBarang.toLowerCase() === "barang habis pakai") {
                // Jika jenis barang tidak diizinkan, munculkan pesan error
                console.error("Jenis barang yang discan tidak diizinkan");
                alert("Kategori barang yang discan tidak diizinkan");
                setKodeBarang("");
                setBarangId([]);
                setBarangUserId([]);
                setJumlah([]);
                return;
                // Tambahkan logika atau tindakan sesuai kebutuhan Anda di sini
            }
        } else {
            console.error("Kode Barang atau Nama Barang tidak ditemukan dalam hasil pemindaian");
        }
        
        //   setKodeBarang(data); // Mengisi inputan kode barang dengan nilai QR code yang dipindai
          setScannedBarcode(data); // Menyimpan nilai QR code yang dipindai ke state scannedBarcode
          handleCloseScanner();
        }
      };
    
    const handleError = (err) => {
    console.error(err);
    };
    
    

    // State untuk data umum
    const [namaPeminjam, setNamaPeminjam] = useState("");
    const [waktuPeminjaman, setWaktuPeminjaman] = useState("");
    const [waktuPengembalian, setWaktuPengembalian] = useState("");
    const [deskripsi, setDeskripsi] = useState("");

    // State untuk mengunci input data umum
    const [dataUmumTerkunci, setDataUmumTerkunci] = useState(false);

    // State untuk data spesifik barang
    const [kodeBarang, setKodeBarang] = useState("");
    const [barangId, setBarangId] = useState([]);
    const [barangUserId, setBarangUserId] = useState([]);
    const [jumlah, setJumlah] = useState([]);

    // State untuk daftar barang yang akan dipinjam dalam satu transaksi
    const [daftarBarang, setDaftarBarang] = useState([]);

    const [userId, setUserId] = useState(null);

    const [jurusans, setJurusan] = useState([]);

    // State untuk menampilkan modal
    const [showModal, setShowModal] = useState(false);
    const [barang, setBarang] = useState([]);
    const [ruanganOptions, setRuanganOptions] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10); // Ubah sesuai kebutuhan Anda

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndex = (currentPage - 1) * dataPerPage + 1;
    const endIndex = Math.min(startIndex + dataPerPage - 1, searchTerm ? searchResults.length : barang.length);

    // Potong data sesuai dengan indeks data awal dan akhir
    const currentData = searchTerm ? searchResults.slice(startIndex - 1, endIndex) : barang.slice(startIndex - 1, endIndex);

    // Hitung jumlah total halaman
    const totalPages = Math.ceil((searchTerm ? searchResults.length : barang.length) / dataPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Fungsi untuk membuka modal
    const openModal = () => {
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Fungsi untuk memilih barang dari modal
    const handleSelectBarang = (barang) => {
        setKodeBarang(barang.kode);
        setBarangId(barang.id);
        closeModal(); // Tutup modal setelah memilih barang
    };

    const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.post('http://127.0.0.1:8000/api/auth/me');
          setUserId(response.data.id);
          setNamaPeminjam(response.data.nama_user)
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

        const fetchDataBarang = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/barangs/iven');
                setBarang(response.data);    
                console.log("data barang: ", response.data)  
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        

    const fetchDataRuangan = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/ruangans');
            setRuanganOptions(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getRuanganNameById = (ruanganId) => {
        const ruangan = ruanganOptions.find(ruangan => ruangan.id === ruanganId);
        return ruangan ? ruangan.nama_ruangan : 'Tidak Diketahui';
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

    // Fungsi untuk mendapatkan barangId berdasarkan kodeBarang
    const getBarangUserId = async (kodeBarang) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/barangs/userid?kode=${kodeBarang}`);
            if (response.data && response.data.user_id) {
                console.log("Data user id barang:", response.data);
                return response.data.user_id;
            } else {
                console.error("Barang tidak ditemukan atau respons tidak valid");
                return null;
            }
        } catch (error) {
            console.error("Gagal mendapatkan barang_id:", error);
            return null;
        }
    };

    // Event handler untuk perubahan input kodeBarang
    const handleKodeBarangChange = async (e) => {
        const kodeBarang = e.target.value;
        console.log("Input kode barang:", kodeBarang);
        // setKodeBarang(kodeBarang);
        
        // Dapatkan barang_id berdasarkan kodeBarang
        const barang_id = await getBarangId(kodeBarang);
        const user_id = await getBarangUserId(kodeBarang);
        if (barang_id !== null) {
            console.log("ID Barang yang didapat:", barang_id); // Log ID barang yang didapat
            console.log("ID User Barang yang didapat:", user_id);
            // Tambahkan barang_id ke array barangId
            setBarangId((prevBarangId) => [...prevBarangId, barang_id]);
            setBarangUserId((prevBarangId) => [...prevBarangId, user_id]);
        } else {
            console.log("ID Barang tidak ditemukan atau respons tidak valid"); // Log jika ID barang tidak ditemukan
        }
    };

    // Fungsi untuk mengonversi tanggal dalam format YYYY-MM-DD menjadi timestamp
    const convertToTimestamp = (dateString) => {
        return new Date(dateString).getTime();
    };

    const formatDateToYMDHIS = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    
    // Fungsi untuk menambahkan barang ke daftarBarang
    const handleTambahBarang = () => {
        if (!jumlah) {
            alert("Jumlah harus diisi.");
            return;
        } else if (jumlah.length === 0) {
            alert("Jumlah harus diisi");
            return; // Berhenti jika input tidak valid
        } else if (jumlah[jumlah.length - 1] <= 0) {
            alert("Jumlah tidak boleh 0 atau kurang dari 0.");
            return; 
        }

        // Validasi waktu peminjaman dan pengembalian
    if (!waktuPeminjaman || !waktuPengembalian) {
        alert('Waktu Peminjaman dan Waktu Pengembalian harus diisi.');
        return;
    }
    if (new Date(waktuPengembalian) <= new Date(waktuPeminjaman)) {
        alert('Waktu Pengembalian harus setelah Waktu Peminjaman.');
        return;
    }

    // Validasi keperluan
    if (!deskripsi) {
        alert('Keperluan harus diisi.');
        return;
    }

    // Validasi kode barang
    if (!kodeBarang) {
        alert('Barang harus diisi.');
        return;
    }

    // Validasi id barang
    if (!barangId) {
        alert('Barang harus diisi.');
        return;
    }

    const selectedBarangId = barangId[barangId.length - 1];
    console.log("selec barang id:", selectedBarangId);
    const selectedBarang = barang.find(barang => barang.id === selectedBarangId);
    console.log("selec barang:", selectedBarang);
    if (selectedBarang && selectedBarang.status_ketersediaan === 'terpakai') {
        alert('Barang sudah terpakai. Silakan pilih barang lain.');
        return;
    }
    

    console.log("jumlah:", jumlah);
    

        const formattedWaktuPeminjaman = formatDate(waktuPeminjaman);
        const formattedWaktuPengembalian = formatDate(waktuPengembalian);
        const fixWaktuPeminjaman = formatDateToYMDHIS(formattedWaktuPeminjaman);
        const fixWaktuPengembalian = formatDateToYMDHIS(formattedWaktuPengembalian);

        console.log("waktu peminjaman:", fixWaktuPeminjaman);
        console.log("waktu pengembalian:", fixWaktuPengembalian);

        if (!kodeBarang || !barangId || !jumlah) {
            alert("Mohon lengkapi semua field untuk barang.");
            return;
        }
        setWaktuPeminjaman(fixWaktuPeminjaman);
        setWaktuPengembalian(fixWaktuPengembalian);

        if (new Date(fixWaktuPengembalian) <= new Date(fixWaktuPeminjaman)) {
            alert('Waktu Pengembalian harus setelah Waktu Peminjaman.');
            return;
        }

        // Membuat objek barang baru dengan data umum yang sama dan data barang
        const barangBaru = {
            namaPeminjam,
            waktuPeminjaman: fixWaktuPeminjaman,
            waktuPengembalian: fixWaktuPengembalian,
            deskripsi,
            kodeBarang,
            barangId: barangId[barangId.length - 1],
            barangUserId: barangUserId[barangUserId.length - 1],
            jumlah: jumlah[jumlah.length - 1],
        };

        console.log("Menambahkan barang baru ke daftarBarang:", barangBaru);
        // Tambahkan barang baru ke daftarBarang
        setDaftarBarang([...daftarBarang, barangBaru]);

        console.log("Nilai daftarBarang setelah menambahkan barang baru:", daftarBarang);

        // Mengunci input data umum setelah barang pertama ditambahkan
        if (daftarBarang.length === 0) {
            setDataUmumTerkunci(true);
        }

        // Reset nilai input barang
        setKodeBarang("");
        // setJumlah([]);
    };

    const handleHapusBarang = (index) => {
        const newDaftarBarang = [...daftarBarang];
        newDaftarBarang.splice(index, 1);
        setDaftarBarang(newDaftarBarang);

        // Pengecekan apakah daftar barang kosong
    if (newDaftarBarang.length === 0) {
        // Reset semua state saat daftar barang kosong
        setDataUmumTerkunci(false);
        setNamaPeminjam("");
        setWaktuPeminjaman("");
        setWaktuPengembalian("");
        setDeskripsi("");
        setBarangId([]);
        setBarangUserId([]);
        setJumlah([]);
    }
    };

    const handleBatalPeminjaman = () => {
        setDataUmumTerkunci(false)
        setNamaPeminjam("");
        setWaktuPeminjaman("");
        setWaktuPengembalian("");
        setDeskripsi("");
        setDaftarBarang([]);
        setBarangId([]);
        setBarangUserId([]);
        setJumlah([]);
    };
    
    

    // Fungsi untuk mengajukan semua peminjaman
    const handleAjukanSemuaPeminjaman = async () => {
        if (!namaPeminjam || !waktuPeminjaman || !waktuPengembalian || !deskripsi) {
            alert("Mohon lengkapi data umum peminjaman.");
            return;
        }
    
        // Mengonversi nilai jumlah_dipinjam dari string ke integer
        const daftarBarangDikonversi = daftarBarang.map(barang => ({
            id: barang.barangId,
            user_id: barang.barangUserId,
            jumlah_dipinjam: parseInt(barang.jumlah)
        }));
    
        const peminjamanData = {
            user_id: userId, // Sesuaikan dengan user_id yang sesuai dengan aplikasi Anda
            nama_peminjam: namaPeminjam,
            tgl_peminjaman: waktuPeminjaman,
            tgl_pengembalian: waktuPengembalian,
            keperluan: deskripsi,
            barangs: daftarBarangDikonversi,
        };
    
        console.log("Data peminjaman yang akan dikirim:", peminjamanData);
    
        try {
            // Mengirim permintaan POST ke backend untuk menyimpan data peminjaman
            const response = await axios.post("http://127.0.0.1:8000/api/peminjamans", peminjamanData);
            console.log("Semua peminjaman berhasil diajukan:", response.data);
    
            // Reset semua state setelah berhasil diajukan
            setNamaPeminjam("");
            setWaktuPeminjaman("");
            setWaktuPengembalian("");
            setDeskripsi("");
            setDaftarBarang([]);
            setBarangId([]);
            setBarangUserId([]);
            alert("Peminjaman berhasil diajukan!");
            window.location.href = "/datapeminjaman";
        } catch (error) {
            console.error("Gagal mengajukan semua peminjaman:", error);
            let errorMessage = "Gagal mengajukan semua peminjaman. Silakan coba lagi.";
            if (error.response) {
                // Respons dari server
                console.error("Detail kesalahan:", error.response.data);
                errorMessage = error.response.data.message || errorMessage;
            }
            alert(errorMessage);
        }
    };
    

    useEffect(() => {
        if (barangId !== null) {
            console.log("barangId telah disimpan:", barangId);
            // Lakukan tindakan lain yang diperlukan ketika barangId berubah
        }
        console.log("daftarBarang telah diperbarui:", daftarBarang);
        fetchDataBarang();
        fetchDataRuangan();
        fetchData();
        fetchDataJurusan();
    }, [userId, barangId, daftarBarang]);

    const fetchDataJurusan = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/jurusans');
            setJurusan(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [showScanner, setShowScanner] = useState(false); // Add this line
    // Add this line
    const handleShowScanner = () => {
        setShowScanner(true);
    };

    const handleCloseScanner = () => {
        setShowScanner(false);
    };

    const handlePilihBarang = (barang) => {
        // Mengatur nilai Kode Barang dan Nama Peminjam dari barang yang dipilih
        setKodeBarang(`${barang.kode_barang}-${barang.nama_barang}`);
        handleKodeBarangChange({ target: { value: barang.kode_barang } });
    
        // Menutup modal setelah memilih barang
        closeModal();
    };

    const handleChange = (evt) => {
        const value = evt.target.value.toLowerCase();
        setSearchTerm(value);
        handleSearch(evt); // Panggil fungsi handleSearch dengan event sebagai argumen
    };

    //perubahan search pertama
    const handleSearch = (evt) => {
        const value = evt.target.value.toLowerCase();
        setSearchTerm(value);
        
        // Filter data berdasarkan nilai pencarian
        const results = barang.filter(item =>
            item && (
                (item.kode_barang && item.kode_barang.toLowerCase().includes(value)) ||
                (item.nama_barang && item.nama_barang.toLowerCase().includes(value)) ||
                (item.jenis_barang && item.jenis_barang.toLowerCase().includes(value)) ||
                (item.keadaan_barang && item.keadaan_barang.toLowerCase().includes(value)) ||
                (item.kategori_barang && item.kategori_barang.toLowerCase().includes(value)) ||
                (item.ruangan.nama_ruangan && item.ruangan.nama_ruangan.toLowerCase().includes(value)) ||
                (item.jurusan.nama_jurusan && item.jurusan.nama_jurusan.toLowerCase().includes(value)) ||
                (item.status_ketersediaan && item.status_ketersediaan.toLowerCase().includes(value)) ||
                (item.keterangan_barang && item.keterangan_barang.toLowerCase().includes(value))
            )
        );
    
        // Set state searchResults dengan hasil pencarian
        setSearchResults(results);
        setCurrentPage(1);
    };
    
    // Ubah dataToRender agar menggunakan searchResults jika searchTerm ada
    const dataToRender = searchTerm ? searchResults : barang;
    
    // Fungsi untuk mengubah format tanggal menjadi format 'Y-m-d H:i:s'
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString()
    };

    // Event handler untuk perubahan input waktu peminjaman
    const handleWaktuPeminjamanChange = (e) => {
        const newWaktuPeminjaman = e.target.value;
        const formattedWaktuPeminjaman = newWaktuPeminjaman;
        setWaktuPeminjaman(formattedWaktuPeminjaman);
    };

    // Event handler untuk perubahan input waktu pengembalian
    const handleWaktuPengembalianChange = (e) => {
        const newWaktuPengembalian = e.target.value;
        const formattedWaktuPengembalian = newWaktuPengembalian;
        setWaktuPengembalian(formattedWaktuPengembalian);
    };

    return (
    <div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Slidebar />
      </div>
            <div className={`main ${isSidebarOpen ? 'shifted' : ''}`}>
            <Topbar toggleSidebar={toggleSidebar} />
        <div className="form-container">
            <h2>Form Peminjaman</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="kodeBarang">Barang yang Dipinjam</label>
                    <input
                        type="text"
                        id="kodeBarang"
                        placeholder=""
                        value={kodeBarang}
                        onChange={handleKodeBarangChange}
                    />
                    <button type="button" onClick={openModal}>
                        Cari Barang
                    </button>
                    <button type="button" className="scan-button" onClick={handleShowScanner}>
                        Scan QR Code
                    </button>
                    {showScanner && (
                        <div className="qr-scanner-container">
                            <QrScanner
                                onScan={handleScan}
                                onError={handleError}
                                style={{ width: '100%', borderRadius: '8px' }} // Atur border radius agar lebih menarik
                            />
                            <button className="close-scanner" onClick={handleCloseScanner}>
                                Close Scanner
                            </button>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="jumlah">Jumlah</label>
                    <input
                        type="number"
                        id="jumlah"
                        value={jumlah[jumlah.length - 1] || ""}
                        onChange={(e) => setJumlah([...jumlah, e.target.value])}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="namaPeminjam">Nama Peminjam</label>
                    <input
                        type="text"
                        id="namaPeminjam"
                        value={namaPeminjam}
                        readOnly={true}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="waktuPeminjaman">Waktu Peminjaman</label>
                    <input
                        type="datetime-local"
                        id="waktuPeminjaman"
                        value={waktuPeminjaman}
                        onChange={handleWaktuPeminjamanChange}
                        disabled={dataUmumTerkunci}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="waktuPengembalian">Waktu Pengembalian</label>
                    <input
                        type="datetime-local"
                        id="waktuPengembalian"
                        value={waktuPengembalian}
                        onChange={handleWaktuPengembalianChange}
                        disabled={dataUmumTerkunci}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deskripsi">Keperluan</label>
                    <textarea
                        id="deskripsi"
                        value={deskripsi}
                        rows="3"
                        onChange={(e) => setDeskripsi(e.target.value)}
                        disabled={dataUmumTerkunci}
                    />
                </div>

                <button type="button" onClick={handleTambahBarang}>
                    Tambah Barang
                </button>
            </form>
            <div>
                <h3>Daftar Barang</h3>
                <Table striped bordered hover responsive className="font-ubuntu" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr>
                            <th>Nama Peminjam</th>
                            <th>Kode Barang</th>
                            <th>Waktu Peminjaman</th>
                            <th>Waktu Pengembalian</th>
                            <th>Jumlah</th>
                            <th>Keperluan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarBarang.map((barang, index) => (
                            <tr key={index}>
                                <td>{barang.namaPeminjam}</td>
                                <td>{barang.kodeBarang}</td>
                                <td>{barang.waktuPeminjaman}</td>
                                <td>{barang.waktuPengembalian}</td>
                                <td>{barang.jumlah}</td>
                                <td>{barang.deskripsi}</td>
                                <td>
                                    
                                    <Button variant="danger" onClick={() => handleHapusBarang(index)}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {daftarBarang.length > 0 && (
                    <>
                        <button type="button" onClick={handleAjukanSemuaPeminjaman}>
                            Ajukan Semua Peminjaman
                        </button>
                        &nbsp;
                        &nbsp;
                        <Button variant="danger" onClick={handleBatalPeminjaman}>
                            Batal
                        </Button>
                    </>
                )}
            </div>

            {/* Modal untuk memilih barang */}
            <Modal show={showModal} onHide={closeModal} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Data Barang</Modal.Title>
                </Modal.Header>
                <div className="seah">
                        <label>
                        <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Search"
                            aria-controls="barang"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                        </label>
                    </div>
                <Modal.Body>
                    <Table striped bordered hover responsive className="font-ubuntu" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Kode Barang</th>
                                <th>Nama Barang</th>
                                <th>Jenis Barang</th>
                                <th>Kategori Barang</th>
                                <th>Keadaan Barang</th>
                                <th>Letak Barang</th>
                                <th>Jurusan</th>
                                <th>Jumlah Barang</th>
                                <th>Status Ketersedian</th>
                                <th>Keterangan</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentData.length > 0 ?(
                            currentData.map((barang, index) => (
                                <tr key={barang.id}>
                                    <td>{startIndex + index}</td>
                                    <td>{barang.kode_barang}</td>
                                    <td>{barang.nama_barang}</td>
                                    <td>{barang.jenis_barang}</td>
                                    <td>{barang.kategori_barang}</td>
                                    <td>{barang.keadaan_barang}</td>
                                    <td>{barang.ruangan.nama_ruangan}</td>
                                    <td>{barang.jurusan.nama_jurusan}</td>
                                    <td>{barang.kuantitas}</td>
                                    <td>{barang.status_ketersediaan}</td>
                                    <td>{barang.keterangan_barang}</td>
                                    <td>
                                    
                                    <Button className='btn btn-info' onClick={() => handlePilihBarang(barang)}>
                                                            Pilih
                                                        </Button>
                                </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center' }}>No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                    <div className='d-flex justify-content-between align-items-center mt-2'>
            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndex} to {endIndex} of {searchTerm ? searchResults.length : barang.length} results</p>
        
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
        </div>
        </div>
    );
};

export default FormPeminjaman;
