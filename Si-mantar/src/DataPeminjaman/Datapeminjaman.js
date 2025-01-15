import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Table, Form, Nav} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEye, faEdit, faTrashAlt, faSearch, faPlus, faInfo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../assets/images.png";
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';
import { Link } from "react-router-dom";
import { Pagination } from 'react-bootstrap';
import QrScanner from 'react-qr-scanner';

const Datapeminjaman = () => {
    const [catatan, setCatatan] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAjju, setLoadingAjju] = useState(true);
    const [loadingTunggu, setLoadingTunggu] = useState(true);
    const [loadingPersetu, setLoadingPersetu] = useState(true);
    const [loadingKembali, setLoadingKembali] = useState(true);
    const [loadingRiwayat, setLoadingRiwayat] = useState(true);

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        let filterData = [];

        if (userRole === 'admin' || userRole === 'kepsek'){
            filterData = peminjamanBarangs.filter((peminjamanBarangs) => 
                    (peminjamanBarangs.peminjaman.nama_peminjam && peminjamanBarangs.peminjaman.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.barang.nama_barang && peminjamanBarangs.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.jumlah_dipinjam && peminjamanBarangs.jumlah_dipinjam.toString().includes(searchTerm)) ||
                    (peminjamanBarangs.peminjaman.tgl_peminjaman && peminjamanBarangs.peminjaman.tgl_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.peminjaman.tgl_pengembalian && peminjamanBarangs.peminjaman.tgl_pengembalian.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.peminjaman.keperluan && peminjamanBarangs.peminjaman.keperluan.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.status_peminjaman && peminjamanBarangs.status_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.catatan && peminjamanBarangs.catatan.toLowerCase().includes(searchTerm.toLowerCase()))

                );
                setCurrentPage(1);
        }else if (activeTab === 'peminjamanSaya'){
            filterData = peminjamanAjju.filter((peminjamanBarangs) => 
                    (peminjamanBarangs.peminjaman.nama_peminjam && peminjamanBarangs.peminjaman.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.barang.nama_barang && peminjamanBarangs.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.jumlah_dipinjam && peminjamanBarangs.jumlah_dipinjam.toString().includes(searchTerm)) ||
                    (peminjamanBarangs.peminjaman.tgl_peminjaman && peminjamanBarangs.peminjaman.tgl_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.peminjaman.tgl_pengembalian && peminjamanBarangs.peminjaman.tgl_pengembalian.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.peminjaman.keperluan && peminjamanBarangs.peminjaman.keperluan.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.status_peminjaman && peminjamanBarangs.status_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (peminjamanBarangs.catatan && peminjamanBarangs.catatan.toLowerCase().includes(searchTerm.toLowerCase()))

                );
                setAjjuPage(1);
        } else if (activeTab === 'peminjamanMenunggu'){
            filterData = peminjamanTunggu.filter((peminjamanBarangs) => 
                (peminjamanBarangs.peminjaman.nama_peminjam && peminjamanBarangs.peminjaman.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.barang.nama_barang && peminjamanBarangs.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.jumlah_dipinjam && peminjamanBarangs.jumlah_dipinjam.toString().includes(searchTerm)) ||
                (peminjamanBarangs.peminjaman.tgl_peminjaman && peminjamanBarangs.peminjaman.tgl_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.peminjaman.tgl_pengembalian && peminjamanBarangs.peminjaman.tgl_pengembalian.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.peminjaman.keperluan && peminjamanBarangs.peminjaman.keperluan.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.status_peminjaman && peminjamanBarangs.status_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.catatan && peminjamanBarangs.catatan.toLowerCase().includes(searchTerm.toLowerCase()))

            );
            setMenungguPages(1);
        } else if (activeTab === 'peminjamanPersetujuan'){
            filterData = peminjamanPersetu.filter((peminjamanBarangs) => 
                (peminjamanBarangs.peminjaman.nama_peminjam && peminjamanBarangs.peminjaman.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.barang.nama_barang && peminjamanBarangs.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.jumlah_dipinjam && peminjamanBarangs.jumlah_dipinjam.toString().includes(searchTerm)) ||
                (peminjamanBarangs.peminjaman.tgl_peminjaman && peminjamanBarangs.peminjaman.tgl_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.peminjaman.tgl_pengembalian && peminjamanBarangs.peminjaman.tgl_pengembalian.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.peminjaman.keperluan && peminjamanBarangs.peminjaman.keperluan.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.status_peminjaman && peminjamanBarangs.status_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.catatan && peminjamanBarangs.catatan.toLowerCase().includes(searchTerm.toLowerCase()))

            );
            setPersetuPages(1);
        } else if (activeTab === 'peminjamanKembali'){
            filterData = peminjamanKembali.filter((peminjamanBarangs) => 
                (peminjamanBarangs.peminjaman.nama_peminjam && peminjamanBarangs.peminjaman.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.barang.nama_barang && peminjamanBarangs.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.jumlah_dipinjam && peminjamanBarangs.jumlah_dipinjam.toString().includes(searchTerm)) ||
                (peminjamanBarangs.peminjaman.tgl_peminjaman && peminjamanBarangs.peminjaman.tgl_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.peminjaman.tgl_pengembalian && peminjamanBarangs.peminjaman.tgl_pengembalian.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.peminjaman.keperluan && peminjamanBarangs.peminjaman.keperluan.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.status_peminjaman && peminjamanBarangs.status_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.catatan && peminjamanBarangs.catatan.toLowerCase().includes(searchTerm.toLowerCase()))

            );
            setKembaliPages(1);
        } else if (activeTab === 'peminjamanRiwayat'){
            filterData = peminjamanRiwayat.filter((peminjamanBarangs) => 
                (peminjamanBarangs.peminjaman.nama_peminjam && peminjamanBarangs.peminjaman.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.barang.nama_barang && peminjamanBarangs.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.jumlah_dipinjam && peminjamanBarangs.jumlah_dipinjam.toString().includes(searchTerm)) ||
                (peminjamanBarangs.peminjaman.tgl_peminjaman && peminjamanBarangs.peminjaman.tgl_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.peminjaman.tgl_pengembalian && peminjamanBarangs.peminjaman.tgl_pengembalian.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.peminjaman.keperluan && peminjamanBarangs.peminjaman.keperluan.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.status_peminjaman && peminjamanBarangs.status_peminjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (peminjamanBarangs.catatan && peminjamanBarangs.catatan.toLowerCase().includes(searchTerm.toLowerCase()))

            );
            setKembaliPages(1);
        }
        setSearchResult(filterData);
        // setCurrentPage(1);
    }

    // Peminjaman Menunggu = peminjaman sedang dipinjam

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
    const [peminjamanAjju, setPeminjamanAjju] = useState([]);
    const [peminjamanTunggu, setPeminjamanTunggu] = useState([]);
    const [peminjamanPersetu, setPeminjamanPersetu] = useState([]);
    const [peminjamanKembali, setPeminjamanKembali] = useState([]);
    const [peminjamanRiwayat, setPeminjamanRiwayat] = useState([]);
    const [showPinjamButton, setShowPinjamButton] = useState(false);
    const [showActionColumn, setShowActionColumn] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10); // Ubah sesuai kebutuhan Anda

    const [ajjuPage, setAjjuPage] = useState(1);
    const [dataAPerPage] = useState(10); 

    const [riwayatPage, setRiwayatPage] = useState(1);
    const [dataRPerPage] = useState(10); 

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
            const filter = userData.role === 'siswa' || userData.role === 'sarpras' || userData.role === 'guru' || userData.role === 'ketua_program'
            ? dataPeminjam.filter(peminjamanBarang => peminjamanBarang.peminjaman.user_id === userData.id && peminjamanBarang.status_peminjaman !== 'Diajukan')
            : userData.role === 'admin' || userData.role === 'kepsek'
                ? dataPeminjam
                : [];

        console.log("Data peminjaman setelah filter:", filter);
            // Menyimpan data peminjaman ke state
            setPeminjamanBarangs(filter);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
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

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndex = (currentPage - 1) * dataPerPage + 1;
    const endIndex = Math.min(startIndex + dataPerPage - 1, (searchTerm ? searchResult.length : peminjamanBarangs.length));

    // Potong data sesuai dengan indeks data awal dan akhir
    const currentData = (searchTerm ? searchResult : peminjamanBarangs).slice(startIndex - 1, endIndex);

    // Hitung jumlah total halaman
    const totalPages = Math.ceil((searchTerm ? searchResult.length : peminjamanBarangs.length) / dataPerPage);

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndea = (ajjuPage - 1) * dataAPerPage + 1;
    const endIndea = Math.min(startIndea + dataAPerPage - 1, (searchTerm ? searchResult.length : peminjamanAjju.length));

    // Potong data sesuai dengan indeks data awal dan akhir
    const ajjuData = (searchTerm ? searchResult : peminjamanAjju).slice(startIndea - 1, endIndea);

    // Hitung jumlah total halaman
    const totalPagea = Math.ceil((searchTerm ? searchResult.length : peminjamanAjju.length) / dataAPerPage);

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startInder = (riwayatPage - 1) * dataRPerPage + 1;
    const endInder = Math.min(startInder + dataRPerPage - 1, (searchTerm ? searchResult.length : peminjamanRiwayat.length));

    // Potong data sesuai dengan indeks data awal dan akhir
    const riwayatData = (searchTerm ? searchResult : peminjamanRiwayat).slice(startInder - 1, endInder);

    // Hitung jumlah total halaman
    const totalPager = Math.ceil((searchTerm ? searchResult.length : peminjamanRiwayat.length) / dataRPerPage);

    const [menungguPage, setMenungguPages] = useState(1);
    const [dataMPerPages] = useState(10); 

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndexs = (menungguPage - 1) * dataMPerPages + 1;
    const endIndexs = Math.min(startIndexs + dataMPerPages - 1, (searchTerm ? searchResult.length : peminjamanTunggu.length));

    // Potong data sesuai dengan indeks data awal dan akhir
    const menungguDatas = (searchTerm ? searchResult : peminjamanTunggu).slice(startIndexs - 1, endIndexs);

    // Hitung jumlah total halaman
    const totalMPages = Math.ceil((searchTerm ? searchResult.length : peminjamanTunggu.length) / dataMPerPages);

    const [persetuPage, setPersetuPages] = useState(1);
    const [dataPPerPages] = useState(10); // Ubah sesuai kebutuhan Anda

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndexp = (persetuPage - 1) * dataPPerPages + 1;
    const endIndexp = Math.min(startIndexp + dataPPerPages - 1, (searchTerm ? searchResult.length : peminjamanPersetu.length));

    // Potong data sesuai dengan indeks data awal dan akhir
    const persetuDatas = (searchTerm ? searchResult : peminjamanPersetu).slice(startIndexp - 1, endIndexp);

    // Hitung jumlah total halaman
    const totalPPages = Math.ceil((searchTerm ? searchResult.length : peminjamanPersetu.length) / dataPPerPages);
    
    const [kembaliPage, setKembaliPages] = useState(1);
    const [dataKPerPages] = useState(10); // Ubah sesuai kebutuhan Anda

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndexes = (kembaliPage - 1) * dataKPerPages + 1;
    const endIndexes = Math.min(startIndexes + dataKPerPages - 1, (searchTerm ? searchResult.length : peminjamanKembali.length));

    // Potong data sesuai dengan indeks data awal dan akhir
    const kembaliDatas = (searchTerm ? searchResult : peminjamanKembali).slice(startIndexes - 1, endIndexes);

    // Hitung jumlah total halaman
    const totalKPages = Math.ceil((searchTerm ? searchResult.length : peminjamanKembali.length) / dataKPerPages);
    
    const fetchPeminjamanTunggu = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/getT`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Sesuaikan dengan cara Anda mengelola autentikasi
                }
            });
            setPeminjamanTunggu(response.data.peminjamanTunggu);
            setLoadingTunggu(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoadingTunggu(false);
        }
    };
    const fetchPeminjamanRiwayat = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/getR`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Sesuaikan dengan cara Anda mengelola autentikasi
                }
            });
            setPeminjamanRiwayat(response.data.peminjamanRiwayat);
            setLoadingRiwayat(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoadingRiwayat(false);
        }
    };
    const fetchPeminjamanAjju = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/getA`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Sesuaikan dengan cara Anda mengelola autentikasi
                }
            });
            setPeminjamanAjju(response.data.peminjamanAjju);

            setLoadingAjju(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoadingAjju(false);
            
        }
    };

    const fetchPeminjamanPersetu = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/getP`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Sesuaikan dengan cara Anda mengelola autentikasi
                }
            });
            setPeminjamanPersetu(response.data.peminjamanPersetu);
            setLoadingPersetu(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoadingPersetu(false);
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

    const fetchPeminjamanKembali = async () => {
        try {
            
            // Mengambil data peminjaman kembali dari endpoint API
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/getK`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Sesuaikan dengan cara Anda mengelola autentikasi
                }
            });
    
            console.log("pengembalian:", response.data.peminjamanRiwayat);
            setPeminjamanKembali(response.data.peminjamanRiwayat);
            setLoadingKembali(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            console.log('URL yang dikirimkan:', `http://127.0.0.1:8000/api/peminjamans?barangId=${barangId}`);
            setLoadingKembali(false);
        }
    };

   
    // Fungsi untuk mengubah status peminjaman menjadi "Dipinjam"
    const changeStatusToDipinjam = async (dipinjamIds) => {
        for (const peminjamanId of dipinjamIds){
        try {
            // console.log('data sebelum perubahan status: ', peminjamanBarangs);
            console.log(`Fungsi changeStatusToDipinjam dipanggil untuk ID peminjaman: ${peminjamanId}`);
            await axios.put(`http://127.0.0.1:8000/api/peminjamans/updatestatus/${peminjamanId}`, { status_peminjaman: 'Dipinjam' });
            console.log('Status peminjaman berhasil diubah menjadi "Dipinjam".');
            
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
    };
   

    // Fungsi untuk memantau perubahan status peminjaman
    const monitorStatusChanges = () => {
        // console.log('Memantau perubahan status...');
        console.log('StatusPeminjaman function is running');
        const dipinjamIds = [];
        // Memantau perubahan status pada data peminjaman yang sudah disetujui
        peminjamanBarangs.forEach(peminjaman => {
            console.log(`Periksa peminjaman ID: ${peminjaman.id}, status: ${peminjaman.status_peminjaman}`);
            if (peminjaman.status_peminjaman === 'Disetujui') {
                console.log(`changeStatusToDipinjam untuk ID peminjaman: ${peminjaman.id}`);
                // Panggil fungsi untuk mengubah status menjadi "Dipinjam"
                dipinjamIds.push(peminjaman.id)
                // changeStatusToDipinjam(peminjaman.id);
                
            }
        });
        console.log("peminjaman dipinjam:", dipinjamIds);
        return dipinjamIds;
    };
    useEffect(() => {
        const dipinjamIds = monitorStatusChanges();
        if (dipinjamIds.length > 0) {
            changeStatusToDipinjam(dipinjamIds);
        }
    }, [peminjamanBarangs]);

    
    
    const handleRole = (role) => {
        if (role === 'siswa' || role === 'guru') {
            setShowPinjamButton(true);
            setShowActionColumn(false);
        } else if (role === 'ketua_program') {
            setShowPinjamButton(true);
            setShowActionColumn(true);
        } else {
            setShowPinjamButton(false);
            setShowActionColumn(false);
        }
    };

    useEffect(() => {
        const UserRole = localStorage.getItem('role');
        const UserID = localStorage.getItem('userid');
        console.log("User role: ", UserRole)
        setUserRole(UserRole)
        fetchDataAndUserData();
        console.log("peminjaman saya:", peminjamanBarangs)
        fetchPeminjamanTunggu(userId);
        fetchPeminjamanAjju(userId);
        fetchPeminjamanPersetu(userId);
        fetchPeminjamanRiwayat(userId);
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

     // Fungsi untuk memeriksa apakah ada peminjaman yang perlu diubah statusnya menjadi "Terlambat"
    const checkLateStatus = () => {
        console.log('checkLateStatus function is running');
        const currentDate = new Date();
        const latePeminjamanIds = [];

        peminjamanBarangs.forEach(peminjaman => {
            console.log(`Checking peminjaman ID: ${peminjaman.id}, status: ${peminjaman.status_peminjaman}`);
            if (peminjaman.status_peminjaman === 'Dipinjam' && peminjaman.peminjaman.tgl_pengembalian) {
                const returnDate = new Date (peminjaman.peminjaman.tgl_pengembalian); // Pastikan field tanggal benar
                console.log(`Checking return date for peminjaman ID: ${peminjaman.id}, returnDate: ${returnDate}, currentDate: ${currentDate}`);
                if (returnDate < currentDate) {
                    console.log(`Peminjaman ID ${peminjaman.id} is late.`);
                    latePeminjamanIds.push(peminjaman.id);
                }
            }
        });
        console.log("peminjaman terlambat:", latePeminjamanIds);
        return latePeminjamanIds;
        
    };

    // Fungsi untuk mengupdate status peminjaman menjadi "Terlambat"
    const updateStatusToLate = async (latePeminjamanIds) => {
        for (const peminjamanId of latePeminjamanIds) {
            try {
                await axios.put(`http://127.0.0.1:8000/api/peminjamans/updatestatus/${peminjamanId}`, { status_peminjaman: 'Terlambat' });
                console.log(`Status peminjaman dengan ID ${peminjamanId} berhasil diubah menjadi "Terlambat".`);
            } catch (error) {
                console.error(`Error updating status for peminjaman ID ${peminjamanId} to "Terlambat":`, error);
            }
        }
    };

    useEffect(() => {
        const latePeminjamanIds = checkLateStatus();
        if (latePeminjamanIds.length > 0) {
            updateStatusToLate(latePeminjamanIds);
        }
    }, [peminjamanBarangs]);
    
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleCloseErrorModal = () => setShowErrorModal(false);


    const approvePeminjaman = async (peminjamanBarangId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/peminjamans/updatestatus/${peminjamanBarangId}`, { status_peminjaman: 'Disetujui' });
            fetchDataAndUserData();
            alert("Peminjaman berhasil disetujui");
            window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error);
            let errorMessage = "Gagal memperbarui status";
            if (error.response) {
                // Respons dari server
                console.error("Detail kesalahan:", error.response.data);
                errorMessage = error.response.data.message || errorMessage;
            }
            setErrorMessage(errorMessage);
            setShowErrorModal(true);
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
            alert("Peminjaman berhasil tidak disetujui");
            window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const changeStatus = async (peminjamanId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/peminjamans/updatestatus/${peminjamanId}`, { status_peminjaman: 'Dikembalikan' });
            fetchDataAndUserData();
            alert("Peminjaman berhasil dikembalikan");
            window.location.href = "/datapeminjaman";
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
            <Topbar toggleSidebar={toggleSidebar} onSearch={handleSearch}/>
                <div className='datapengguna' >
                    <div className='body-flex'>
                        <div className='flex mx-6 d-flex justify-content-center'>
                            <div className='col-11 p-6'>
                            <h2 className='mb-3' style={{ backgroundColor: '#436850', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: 'white' }}>Data Peminjaman</h2>
                            <Nav variant="tabs" defaultActiveKey="peminjamanSaya">
    {(userRole === 'ketua_program' || userRole === 'sarpras' || userRole === 'siswa' || userRole === 'guru') && (
        <Nav.Item>
            <Nav.Link eventKey="peminjamanSaya" onClick={() => setActiveTab('peminjamanSaya')}>
                Pengajuan Saya
            </Nav.Link>
        </Nav.Item>
    )}
    
    {(userRole === 'ketua_program' || userRole === 'sarpras') && (
        <Nav.Item>
            <Nav.Link eventKey="peminjamanPersetujuan" onClick={() => setActiveTab('peminjamanPersetujuan')}>
                Perlu Persetujuan
            </Nav.Link>
        </Nav.Item>
    )}
    {(userRole === 'ketua_program' || userRole === 'sarpras' || userRole === 'siswa' || userRole === 'guru') && (
        <Nav.Item>
            <Nav.Link eventKey="peminjamanMenunggu" onClick={() => setActiveTab('peminjamanMenunggu')}>
                Sedang Dipinjam
            </Nav.Link>
        </Nav.Item>
    )}
    {(userRole === 'ketua_program' || userRole === 'sarpras') && (
        <Nav.Item>
            <Nav.Link eventKey="peminjamanKembali" onClick={() => setActiveTab('peminjamanKembali')}>
                Pengembalian
            </Nav.Link>
        </Nav.Item>
    )}
    {(userRole === 'ketua_program' || userRole === 'sarpras' || userRole === 'siswa' || userRole === 'guru') && (
        <Nav.Item>
            <Nav.Link eventKey="peminjamanRiwayat" onClick={() => setActiveTab('peminjamanRiwayat')}>
                Riwayat Peminjaman
            </Nav.Link>
        </Nav.Item>
    )}
</Nav>


{activeTab === 'peminjamanSaya' && (userRole === 'ketua_program' || userRole === 'sarpras' || userRole === 'siswa' || userRole === 'guru') && (
   <div> <Button variant="success" onClick={handleShowModal} className='mt-3 mb-3'>
   Pengajuan Baru
</Button>
    <Modal show={showModal} onHide={handleCloseModal} centered>
    <Modal.Header closeButton>
        <Modal.Title>Pilih Jenis Pengajuan</Modal.Title>
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


{(userRole === 'admin' || userRole === 'kepsek')  && (
    loading ? (
        <div>Loading...</div>
    ) : (
    <div>
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
            {currentData.length > 0 ?(
                currentData.map((peminjamanBarang, index) => (
                        <tr key={peminjamanBarang.id}>
                            <td>{startIndex + index }</td>
                            <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                            <td>{peminjamanBarang.barang.nama_barang}</td>
                            <td>{peminjamanBarang.jumlah_dipinjam}</td>
                            <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                            <td>{peminjamanBarang.peminjaman.tgl_pengembalian}</td>
                            <td>{peminjamanBarang.peminjaman.keperluan}</td>
                            <td>{peminjamanBarang.status_peminjaman}</td>
                            <td>{peminjamanBarang.catatan}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" style={{ textAlign: 'center' }}>No data available</td>
                    </tr>
                )}
            </tbody>
        </Table>
        {/* Tampilkan informasi jumlah data yang ditampilkan */}
        <div className='d-flex justify-content-between align-items-center mt-2'>
            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndex} to {endIndex} of {(searchTerm ? searchResult.length : peminjamanBarangs.length)} results</p>
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
    )
)}

{activeTab === 'peminjamanSaya' && (userRole === 'ketua_program' || userRole === 'sarpras' || userRole === 'siswa' || userRole === 'guru') && (
    loadingAjju ? ( // Render loading text if loading is true
    <div>Loading...</div>
) : (
    <div>
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
            {ajjuData.length > 0 ?(
                ajjuData.map((peminjamanBarang, index) => (
                        <tr key={peminjamanBarang.id}>
                            <td>{startIndea + index }</td>
                            <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                            <td>{peminjamanBarang.barang.nama_barang}</td>
                            <td>{peminjamanBarang.jumlah_dipinjam}</td>
                            <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                            <td>{peminjamanBarang.peminjaman.tgl_pengembalian}</td>
                            <td>{peminjamanBarang.peminjaman.keperluan}</td>
                            <td>{peminjamanBarang.status_peminjaman}</td>
                            <td>{peminjamanBarang.catatan}</td>
                        </tr>
                    ))
            ) : (
                <tr>
                    <td colSpan="9" style={{ textAlign: 'center' }}>No data available</td>
                </tr>
            )}
            </tbody>
        </Table>
        {/* Tampilkan informasi jumlah data yang ditampilkan */}
        <div className='d-flex justify-content-between align-items-center mt-2'>
            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndea} to {endIndea} of {(searchTerm ? searchResult.length : peminjamanAjju.length)} results</p>
            {/* Pagination */}
            <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(ajjuPage - 1)} disabled={ajjuPage === 1} />
                {Array.from({ length: totalPagea }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === ajjuPage} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(ajjuPage + 1)} disabled={ajjuPage === totalPagea} />
            </Pagination>
        </div>
    </div>
    
)
)}


                            {activeTab === 'peminjamanMenunggu' && (
                                loadingTunggu ? (
                                    <div>Loading...</div>
                                ) : (
                                <div>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {menungguDatas.length > 0 ? (
                                        menungguDatas.map((peminjamanBarang, index) => (
                                            <tr key={peminjamanBarang.id}>
                                                <td>{startIndexs + index }</td>
                                                <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                                                <td>{peminjamanBarang.barang.nama_barang}</td>
                                                <td>{peminjamanBarang.jumlah_dipinjam}</td>
                                                <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                                                <td>{peminjamanBarang.peminjaman.tgl_pengembalian}</td>
                                                <td>{peminjamanBarang.peminjaman.keperluan}</td>
                                                <td>{peminjamanBarang.status_peminjaman}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center' }}>No data available</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                                {/* Tampilkan informasi jumlah data yang ditampilkan */}
                                <div className='d-flex justify-content-between align-items-center mt-2'>
                                    <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndexs} to {endIndexs} of {(searchTerm ? searchResult.length : peminjamanTunggu.length)} results</p>
                                    {/* Pagination */}
                                    <Pagination>
                                        <Pagination.Prev onClick={() => handlePageChange(menungguPage - 1)} disabled={menungguPage === 1} />
                                        {Array.from({ length: totalMPages }, (_, index) => (
                                            <Pagination.Item key={index + 1} active={index + 1 === menungguPage} onClick={() => handlePageChange(index + 1)}>
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => handlePageChange(menungguPage + 1)} disabled={menungguPage === totalMPages} />
                                    </Pagination>
                                </div>
                                </div>
                                )
                            )}


                            {activeTab === 'peminjamanPersetujuan' && (
                               loadingPersetu ? (
                                <div>Loading...</div>
                               ) : (
                               <div>
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
                                            {userRole !== 'siswa' && userRole !== 'guru' && <th>Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {persetuDatas.length > 0 ? (
                                        persetuDatas.map((peminjamanBarang, index) => (
                                            <tr key={peminjamanBarang.id}>
                                                <td>{startIndexp + index}</td>
                                                <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                                                <td>{peminjamanBarang.barang.nama_barang}</td>
                                                <td>{peminjamanBarang.jumlah_dipinjam}</td>
                                                <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                                                <td>{peminjamanBarang.peminjaman.tgl_pengembalian}</td>
                                                <td>{peminjamanBarang.peminjaman.keperluan}</td>
                                                <td>{peminjamanBarang.status_peminjaman}</td>
                                                    <td>
                                                        <Button variant="success" onClick={() => approvePeminjaman(peminjamanBarang.id)}>Setujui</Button>
                                                        &nbsp;
                                                        <Button variant="danger" onClick={() => {setRejectedPeminjamanId(peminjamanBarang.id);handleShowCatatanModal()}}>Tolak</Button>
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
                                {/* Tampilkan informasi jumlah data yang ditampilkan */}
                                <div className='d-flex justify-content-between align-items-center mt-2'>
                                    <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndexp} to {endIndexp} of {(searchTerm ? searchResult.length : peminjamanPersetu.length)} results</p>
                                    {/* Pagination */}
                                    <Pagination>
                                        <Pagination.Prev onClick={() => handlePageChange(persetuPage - 1)} disabled={persetuPage === 1} />
                                        {Array.from({ length: totalPPages }, (_, index) => (
                                            <Pagination.Item key={index + 1} active={index + 1 === persetuPage} onClick={() => handlePageChange(index + 1)}>
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => handlePageChange(persetuPage + 1)} disabled={persetuPage === totalPPages} />
                                    </Pagination>
                                </div>
                                </div>
                               )
                            )}

                            <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Error</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>{errorMessage}</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseErrorModal}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

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
                                    loadingKembali ? (
                                        <div>Loading...</div>
                                    ) : (
                                    <div>
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
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {kembaliDatas.length > 0 ? (
                                                kembaliDatas.map((peminjamanBarang, index) => (
                                                    <tr key={peminjamanBarang.id}>
                                                            <td>{startIndexes + index}</td>
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
                                                <tr>
                                                    <td colSpan="9" style={{ textAlign: 'center' }}>No data available</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </Table>
                                        {/* Tampilkan informasi jumlah data yang ditampilkan */}
                                        <div className='d-flex justify-content-between align-items-center mt-2'>
                                            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndexes} to {endIndexes} of {(searchTerm ? searchResult.length : peminjamanKembali.length)} results</p>
                                            {/* Pagination */}
                                            <Pagination>
                                                <Pagination.Prev onClick={() => handlePageChange(kembaliPage - 1)} disabled={kembaliPage === 1} />
                                                {Array.from({ length: totalKPages }, (_, index) => (
                                                    <Pagination.Item key={index + 1} active={index + 1 === kembaliPage} onClick={() => handlePageChange(index + 1)}>
                                                        {index + 1}
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Next onClick={() => handlePageChange(kembaliPage + 1)} disabled={kembaliPage === totalKPages} />
                                            </Pagination>
                                        </div>
                                    </div>
                                    )
                                )}

                            {activeTab === 'peminjamanRiwayat' && (
                                loadingRiwayat ? (
                                    <div>Loading...</div>
                                ) : (
                                <div>
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
                                    {riwayatData.length > 0 ? (
                                        riwayatData.map((peminjamanBarang, index) => (
                                            <tr key={peminjamanBarang.id}>
                                                <td>{startInder + index}</td>
                                                <td>{peminjamanBarang.peminjaman.nama_peminjam}</td>
                                                <td>{peminjamanBarang.barang.nama_barang}</td>
                                                <td>{peminjamanBarang.jumlah_dipinjam}</td>
                                                <td>{peminjamanBarang.peminjaman.tgl_peminjaman}</td>
                                                <td>{peminjamanBarang.peminjaman.tgl_pengembalian}</td>
                                                <td>{peminjamanBarang.peminjaman.keperluan}</td>
                                                <td>{peminjamanBarang.status_peminjaman}</td>
                                                <td>{peminjamanBarang.catatan}</td>
                                               
                                            


                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center' }}>No data available</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                                {/* Tampilkan informasi jumlah data yang ditampilkan */}
                                <div className='d-flex justify-content-between align-items-center mt-2'>
                                    <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startInder} to {endInder} of {(searchTerm ? searchResult.length : peminjamanRiwayat.length)} results</p>
                                    {/* Pagination */}
                                    <Pagination>
                                        <Pagination.Prev onClick={() => handlePageChange(riwayatPage - 1)} disabled={riwayatPage === 1} />
                                        {Array.from({ length: totalPager }, (_, index) => (
                                            <Pagination.Item key={index + 1} active={index + 1 === riwayatPage} onClick={() => handlePageChange(index + 1)}>
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => handlePageChange(riwayatPage + 1)} disabled={riwayatPage === totalPager} />
                                    </Pagination>
                                </div>
                                </div>
                                )
                            )}

                                
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
  )
}

export default Datapeminjaman
