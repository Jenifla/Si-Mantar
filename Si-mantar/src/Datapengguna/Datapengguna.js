import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form, Table, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEdit, faTrashAlt, faSearch, faPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../assets/images.png";
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';
import { Pagination } from 'react-bootstrap';

const Datapengguna = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [userData, setUserData] = useState({
        id: '',
        jurusan_id: '',
        username: '',
        password: '',
        nama_user: '',
        nip: '',
        no_hp: '',
        ttd: '',
        role: '' 
    });
    const [users, setUsers] = useState([]);
    const [jurusans, setJurusan] = useState([]);

    const [selectedRole, setSelectedRole] = useState(''); 
    
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [jurusanIdError, setJurusanIdError] = useState(false);
    // const [nohpErrorMessage, setNohpErrorMessage] = useState('');
    const [ttdErrorMessage, setTtdErrorMessage] = useState('');
    const [namaUserError, setNamaUserError] = useState(false);
    const [nipError, setNIPError] = useState(false);
    const [noHpError, setNoHpError] = useState(false);
    const [noHpErrorMessage, setNoHpErrorMessage] = useState('');
    const [ttdError, setTtdError] = useState(false);
    const [roleError, setRoleError] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (searchQuery) => {
        setSearchQuery(searchQuery);
        setCurrentPage(1); 
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredData = users.filter(user => {
        const jurusan = jurusans.find(j => j.id === parseInt(user.jurusan_id))?.nama_jurusan.toLowerCase();
        return(
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.nama_user && user.nama_user.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.no_hp && user.no_hp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        jurusan.includes(searchQuery.toLowerCase())
        );
    });
    

    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10); 

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndex = (currentPage - 1) * dataPerPage + 1;
    const endIndex = Math.min(startIndex + dataPerPage - 1, filteredData.length);

    // Potong data sesuai dengan indeks data awal dan akhir
    const currentData = filteredData.slice(startIndex - 1, endIndex);

    // Hitung jumlah total halaman
    const totalPages = Math.ceil(filteredData.length / dataPerPage);


    const validateForm = () => {
        let isValid = true;
        // Validasi input jurusan dipilih
        if (!userData.jurusan_id) {
            setJurusanIdError(true);
            isValid = false;
        } else {
            setJurusanIdError(false);
        }
    
        // Validasi input username
        if (!userData.username) {
            setUsernameError(true);
            isValid = false;
        } else {
            setUsernameError(false);
        }
    
        // Validasi input password
        if (!userData.password) {
            setPasswordError(true);
            setPasswordErrorMessage("Password wajib diisi!");
            isValid = false;
        } else if (userData.password.length < 6 || userData.password.length > 6) {
            setPasswordError(true);
            setPasswordErrorMessage("Password harus terdiri dari 6 karakter!");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }
    
        // Validasi input nama user
        if (!userData.nama_user) {
            setNamaUserError(true);
            isValid = false;
        } else {
            setNamaUserError(false);
        }

        // Validasi input nip
        if (!userData.nip) {
            setNIPError(true);
            isValid = false;
        } else {
            setNIPError(false);
        }
    
        // Validasi input no HP
        if (!userData.no_hp) {
            setNoHpError(true);
            setNoHpErrorMessage("Nomor HP wajib diisi");
            isValid = false;
        } else if (!userData.no_hp.startsWith('62')) {
            setNoHpError(true);
            setNoHpErrorMessage("Nomor HP harus dimulai dengan angka 62");
            isValid = false;
        } else {
            setNoHpError(false);
            setNoHpErrorMessage("");
        }
        
    
        // Validasi input role
        if (!selectedRole) {
            setRoleError(true);
            isValid = false;
        } else {
            setRoleError(false);
        }
    
        // Validasi tanda tangan (TTD)
        if (userData.ttd) {
            // Validasi gambar hanya jika ada gambar yang diunggah
            if (userData.ttd instanceof File) {
                // Periksa ekstensi file
                const allowedExtensions = /(\.png)$/i;
                const fileName = userData.ttd.name;
                if (!allowedExtensions.exec(fileName)) {
                    setTtdError(true);
                    setTtdErrorMessage('Format tanda tangan harus PNG!');
                    isValid = false;
                }
        
                // Periksa ukuran file
                if (userData.ttd.size > 2 * 1024 * 1024) {
                    setTtdError(true);
                    setTtdErrorMessage('Ukuran tanda tangan tidak boleh lebih dari 2 MB!');
                    isValid = false;
                }
            }
        }
        
    
        return isValid;
    };

    useEffect(() => {
        fetchDataJurusan();
        fetchData();
    }, []);

    const fetchDataJurusan = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/jurusans');
            setJurusan(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users');
            const usersWithImageUrl = response.data.map(user => {
                const ttd_url = `http://127.0.0.1:8000${user.ttd}`;
                console.log(`Generating URL for ${user.username}: ${ttd_url}`);
                return {
                    ...user,
                    ttd_url
                };
            });
            console.log("data user:", usersWithImageUrl)
            setUsers(usersWithImageUrl);
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeModal = () => {
        setUsernameError(false);
        setJurusanIdError(false);
        setNIPError(false);
        setNamaUserError(false);
        setNoHpError(false);
        setNoHpErrorMessage("");
        setPasswordError(false);
        setPasswordErrorMessage(false);
        setRoleError(false);
        setTtdError(false);
        setTtdErrorMessage("");
        setUserData({
            id: '',
            jurusan_id: '',
            username: '',
            password: '',
            nama_user: '',
            nip: '',
            no_hp: '',
            ttd: '',
            role: '' 
        });
        // window.location.reload();
        setShow(false);
    };

    const showModal = (userData) => {
        console.log(userData); // Cek nilai userData sebelum menampilkan modal
        setUserData({
            ...userData,
        jurusanId: userData.jurusan_id});
        setSelectedRole(userData.role); // Menetapkan selectedRole saat modal ditampilkan
        setShow(true);
    };
    
    

    const closeModalDelete = () => {
        setShowDelete(false);
    };

    const showModalDelete = (userData) => {
        setUserData(userData);
        setShowDelete(true);
    };

    const closeModalAdd = () => {
        setUsernameError(false);
        setJurusanIdError(false);
        setNIPError(false);
        setNamaUserError(false);
        setNoHpError(false);
        setNoHpErrorMessage("");
        setPasswordError(false);
        setPasswordErrorMessage(false);
        setRoleError(false);
        setTtdError(false);
        setTtdErrorMessage("");
        setUserData({
            id: '',
            jurusan_id: '',
            username: '',
            password: '',
            nama_user: '',
            nip: '',
            no_hp: '',
            ttd: '',
            role: '' 
        });
        window.location.reload();
        setShowAdd(false);
    };

    const showModalAdd = () => {
        setShowAdd(true);
    };

    const AddDataUser = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        // Jika ada gambar yang diunggah, lakukan validasi gambar
        if (userData.ttd instanceof File) {
            // Validasi format file gambar
            const allowedExtensions = /(\.png)$/i;
            if (!allowedExtensions.exec(userData.ttd.name)) {
                alert('Format gambar harus PNG!');
                return;
            }

            // Validasi ukuran file gambar
            if (userData.ttd.size > 2 * 1024 * 1024) {
                alert('Ukuran gambar tidak boleh lebih dari 2 MB!');
                return;
            }
        }
        try {
            const formData = new FormData();
            formData.append('jurusan_id', userData.jurusan_id);
            formData.append('username', userData.username);
            formData.append('password', userData.password);
            formData.append('nama_user', userData.nama_user);
            formData.append('nip', userData.nip);
            formData.append('no_hp', userData.no_hp);
            formData.append('ttd', userData.ttd);
            formData.append('role', selectedRole); // Menggunakan selectedRole yang dipilih

            console.log('Data yang akan dikirim:', {
                jurusan_id: userData.jurusan_id,
                username: userData.username,
                password: userData.password,
                nama_user: userData.nama_user,
                nip: userData.nip,
                no_hp: userData.no_hp,
                ttd: userData.ttd,
                role: selectedRole
            });

            await axios.post('http://127.0.0.1:8000/api/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowAdd(false);
            setUserData({
                id: '',
                jurusan_id: '',
                username: '',
                password: '',
                nama_user: '',
                nip: '',
                no_hp: '',
                ttd: '',
                role: '' 
            });
            setUsernameError(false);
            setJurusanIdError(false);
            setNIPError(false);
            setNamaUserError(false);
            setNoHpError(false);
            setNoHpErrorMessage("");
            setPasswordError(false);
            setPasswordErrorMessage(false);
            setRoleError(false);
            setTtdError(false);
            setTtdErrorMessage("");
            fetchData();
            // window.location.reload();
            alert("Data berhasil ditambahkan");
        } catch (error) {
            alert("Data gagal ditambahkan");
            if (error.response && error.response.data && error.response.data.message) {
                console.log(error)
                // Set pesan kesalahan dari server
            } else {
                console.error('Error adding user:', error);
            }
        }
    };

    const DeleteDataUser = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${userData.id}`);
            setShowDelete(false);
            fetchData();
            // window.location.reload();
            alert("Data berhasil dihapus");
        } catch (error) {
            console.error('Error deleting user:', error);
            alert("Data gagal dihapus");
        }
    };

    const UpdateDataUser = async (e) => {
        e.preventDefault();
        console.log('Profile yang akan dikirim:', userData);

        let isValid = true;
        // Validasi input jurusan dipilih
        if (!userData.jurusan_id) {
            setJurusanIdError(true);
            isValid = false;
        } else {
            setJurusanIdError(false);
        }

        // Validasi input username
        if (!userData.username) {
            setUsernameError(true);
            isValid = false;
        } else {
            setUsernameError(false);
        }

        // Validasi input nama user
        if (!userData.nama_user) {
            setNamaUserError(true);
            isValid = false;
        } else {
            setNamaUserError(false);
        }

        // Validasi input nip
        if (!userData.nip) {
            setNIPError(true);
            isValid = false;
        } else {
            setNIPError(false);
        }

        // Validasi input no HP
        if (!userData.no_hp) {
            setNoHpError(true);
            setNoHpErrorMessage("Nomor HP wajib diisi");
            isValid = false;
        } else if (!userData.no_hp.startsWith('62')) {
            setNoHpError(true);
            setNoHpErrorMessage("Nomor HP harus dimulai dengan angka 62");
            isValid = false;
        } else {
            setNoHpError(false);
            setNoHpErrorMessage("");
        }
    

        // Validasi input role
        if (!selectedRole) {
            setRoleError(true);
            isValid = false;
        } else {
            setRoleError(false);
        }

        // Validasi password hanya jika pengguna ingin mengubahnya
        if (userData.password) {
            // Jika pengguna memasukkan password baru, validasi password
            if (userData.password.length < 6 || userData.password.length > 6) {
                setPasswordError(true);
                setPasswordErrorMessage("Password harus terdiri dari 6 karakter!");
                isValid = false;
            } else {
                setPasswordError(false);
                setPasswordErrorMessage("");
            }
        }

        
        // Jika ada gambar yang diunggah, lakukan validasi gambar
        if (userData.ttd instanceof File) {
            // Validasi format file gambar
            const allowedExtensions = /(\.png)$/i;
            if (!allowedExtensions.exec(userData.ttd.name)) {
                setTtdError(true);
                setTtdErrorMessage('Format tanda tangan harus PNG!');
                // alert('Format gambar harus PNG!');
                isValid = false;
            }

            // Validasi ukuran file gambar
            if (userData.ttd.size > 2 * 1024 * 1024) {
                setTtdError(true);
                setTtdErrorMessage('Ukuran tanda tangan tidak boleh lebih dari 2 MB!');
                // alert('Ukuran gambar tidak boleh lebih dari 2 MB!');
                isValid = false;
            }
        }
        try {
            const missingFields = [];
            if (!userData.username) missingFields.push('Username');
            if (!userData.nama_user) missingFields.push('Nama User');
            if (!userData.nip) missingFields.push('NIP/NISN');
            if (!userData.no_hp) missingFields.push('NoHp');
            if (!selectedRole) missingFields.push('Role');
    
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}.`);
            }
    
            // Lanjutkan dengan mengirimkan permintaan PUT jika semua bidang yang diperlukan telah diisi
            const formData = new FormData();
            formData.append('username', userData.username);
            formData.append('nama_user', userData.nama_user);
            formData.append('nip', userData.nip);
            formData.append('no_hp', userData.no_hp);
            formData.append('jurusan_id', parseInt(userData.jurusan_id));
            formData.append('role', selectedRole);

            // Jika pengguna memasukkan password baru, tambahkan password baru ke FormData
            if (userData.password) {
                formData.append('password', userData.password);
            }

            // Jika pengguna tidak memasukkan password baru, abaikan bidang password

            // Periksa apakah pengguna memilih file gambar TTD baru
            if (userData.ttd instanceof File) {
                formData.append('ttd', userData.ttd);
            }
    
            await axios.post(`http://127.0.0.1:8000/api/users/update/${userData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShow(false);
            setUserData({
                id: '',
                jurusan_id: '',
                username: '',
                password: '',
                nama_user: '',
                nip: '',
                no_hp: '',
                ttd: '',
                role: '' 
            });
            setUsernameError(false);
            setJurusanIdError(false);
            setNIPError(false);
            setNamaUserError(false);
            setNoHpError(false);
            setNoHpErrorMessage("");
            setPasswordError(false);
            setPasswordErrorMessage(false);
            setRoleError(false);
            setTtdError(false);
            setTtdErrorMessage("");
            fetchData();
            // window.location.reload();
            alert("Update data berhasil");
        } catch (error) {
            console.error('Error updating user:', error);
            // alert("Update data gagal");
        }
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
                                <h2 className='mb-3'style={{ backgroundColor: '#436850', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: 'white' }}>Data Pengguna</h2>
                                {/* Modal DELETE */}
                                <Modal show={showDelete} onHide={closeModalDelete} centered>
                                    
                                    <Modal.Body className="text-center" style={{ borderBottom: 'none' }}>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger mb-3" style={{ fontSize: '6em' }} />
                                        <h4>Apakah anda yakin?</h4>
                                        <p>Data yang sudah dihapus mungkin tidak bisa dikembalikan lagi!</p>
                                        <Button variant="primary" onClick={closeModalDelete}>Batal</Button>
                                        &nbsp;
                                        &nbsp;
                                        <Button variant="danger" onClick={DeleteDataUser}>Hapus</Button>
                                    </Modal.Body>
                                </Modal>

                                <Modal show={show} onHide={closeModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Form Update Data</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form onSubmit={UpdateDataUser}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputUsername">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    autoFocus
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, username: e.target.value });
                                                        setUsernameError(false);
                                                    }}
                                                    value={userData.username}
                                                />
                                                {usernameError && <p style={{ color: 'red' }}>Username wajib diisi!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Masukkan password baru"
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, password: e.target.value });
                                                        setPasswordError(false);
                                                    }}
                                                    value={userData.password}
                                                />
                                                {passwordError && <p style={{ color: 'red' }}>{passwordErrorMessage}</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputNama">
                                                <Form.Label>Nama User</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, nama_user: e.target.value });
                                                        setNamaUserError(false);
                                                    }}
                                                    value={userData.nama_user}
                                                />
                                                {namaUserError && <p style={{ color: 'red' }}>Nama user wajib diisi!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputNama">
                                                <Form.Label>NIP/NISN</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, nip: e.target.value });
                                                        setNIPError(false);
                                                    }}
                                                    value={userData.nip}
                                                />
                                                {nipError && <p style={{ color: 'red' }}>NIP/NISN wajib diisi!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputNohp">
                                                <Form.Label>No Hp</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, no_hp: e.target.value });
                                                        setNoHpError(false);
                                                        setNoHpErrorMessage("");
                                                    }}
                                                    value={userData.no_hp}
                                                />
                                                {noHpError && <p style={{ color: 'red' }}>{noHpErrorMessage}</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputTtd">
                                                <Form.Label>TTD</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    onChange={(e) => setUserData({...userData, ttd: e.target.files[0]})}
                                                />
                                                {userData.ttd_url && <img src={userData.ttd_url} alt="TTD" style={{ width: '50px', height: '50px' }} />}
                                                {ttdError && <p style={{ color: 'red' }}>{ttdErrorMessage}</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputRole">
                                                <Form.Label>Role</Form.Label>
                                                <Dropdown style={{ width: '100%' }}>
                                                    <Dropdown.Toggle
                                                        variant="light"
                                                        id="dropdown-basic"
                                                        style={{
                                                            width: '100%',
                                                            borderWidth: '1px',
                                                            borderColor: 'lightgray',
                                                            textAlign: 'left', 
                                                        }}
                                                    >
                                                        {userData.role || "Pilih Role"}
                                                        
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu
                                                        align="end"
                                                        style={{ width: '100%', textAlign: 'left' }}
                                                    >
                                                        <Dropdown.Item onClick={() => {setSelectedRole(''); setUserData({...userData, role: ''});console.log('Selected Role:', selectedRole);}}>Pilih Role</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setSelectedRole('admin')}>Admin</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setSelectedRole('sarpras')}>Sarpras</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setSelectedRole('ketua_program')}>Ketua Program Keahlian</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setSelectedRole('kepsek')}>Kepala Sekolah</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setSelectedRole('guru')}>Guru</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setSelectedRole('siswa')}>Siswa</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {roleError && <p style={{ color: 'red' }}>Role wajib dipilih!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlSelectJurusan">
                                                    <Form.Label>Jurusan</Form.Label>
                                                    <Form.Control 
                                                        as="select" 
                                                        onChange={(e) => setUserData({...userData, jurusan_id: e.target.value})} // Pastikan nilai jurusanId diatur dengan benar
                                                        value={userData.jurusan_id}
                                                    >
                                                        <option value="">Pilih Jurusan</option>
                                                        {jurusans.map(jurusan => (
                                                            <option key={jurusan.id} value={jurusan.id}>{jurusan.nama_jurusan}</option>
                                                        ))}
                                                    </Form.Control>
                                                    {jurusanIdError && <p style={{ color: 'red' }}>Jurusan wajib dipilih!</p>}
                                            </Form.Group>
                                            <Button type='submit' color="primary" className="px-4">Simpan</Button>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={closeModal}>Close</Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* Modal ADD */}
                                <Modal show={showAdd} onHide={closeModalAdd}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Tambah Data</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form onSubmit={AddDataUser}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputUsername">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    autoFocus
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, username: e.target.value });
                                                        setUsernameError(false);
                                                    }}
                                                    value={userData.username}
                                                />
                                                {usernameError && <p style={{ color: 'red' }}>Username wajib diisi!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, password: e.target.value });
                                                        setPasswordError(false);
                                                    }}
                                                    value={userData.password}
                                                />
                                                {passwordError && <p style={{ color: 'red' }}>{passwordErrorMessage}</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputNama">
                                                <Form.Label>Nama User</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, nama_user: e.target.value });
                                                        setNamaUserError(false);
                                                    }}
                                                    value={userData.nama_user}
                                                />
                                                {namaUserError && <p style={{ color: 'red' }}>Nama user wajib diisi!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputNama">
                                                <Form.Label>NIP/NISN</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, nip: e.target.value });
                                                        setNIPError(false);
                                                    }}
                                                    value={userData.nip}
                                                />
                                                {nipError && <p style={{ color: 'red' }}>NIP/NISN wajib diisi!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputNohp">
                                                <Form.Label>No HP</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="62..."
                                                    onChange={(e) => {
                                                        setUserData({ ...userData, no_hp: e.target.value });
                                                        setNoHpError(false);
                                                    }}
                                                    value={userData.no_hp}
                                                />
                                                {noHpError && <p style={{ color: 'red' }}>{noHpErrorMessage}</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputTtd">
                                                <Form.Label>TTD</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    onChange={(e) => setUserData({...userData, ttd: e.target.files[0]})}
                                                />
                                                {ttdError && <p style={{ color: 'red' }}>{ttdErrorMessage}</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputRole">
                                                <Form.Label>Role</Form.Label>
                                                <Dropdown style={{ width: '100%' }}>
                                                    <Dropdown.Toggle
                                                        variant="light"
                                                        id="dropdown-basic"
                                                        style={{
                                                            width: '100%',
                                                            borderWidth: '1px',
                                                            borderColor: 'lightgray',
                                                            textAlign: 'left', 
                                                        }}
                                                    >
                                                        {userData.role || "Pilih Role"}
                                                        
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu
                                                        align="end"
                                                        style={{ width: '100%', textAlign: 'left' }}
                                                    >
                                                        <Dropdown.Item onClick={() => {setSelectedRole('');setUserData({...userData, role: ''});}}>Pilih Role</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => {setSelectedRole('admin');setRoleError(false);setUserData({...userData, role: 'admin'});}}>Admin</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => {setSelectedRole('sarpras');setRoleError(false);setUserData({...userData, role: 'sarpras'});}}>Sarpras</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => {setSelectedRole('ketua_program');setRoleError(false);setUserData({...userData, role: 'ketua_program'});}}>Ketua Program Keahlian</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => {setSelectedRole('kepsek');setRoleError(false);setUserData({...userData, role: 'kepsek'});}}>Kepala Sekolah</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => {setSelectedRole('guru');setRoleError(false);setUserData({...userData, role: 'guru'});}}>Guru</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => {setSelectedRole('siswa');setRoleError(false);setUserData({...userData, role: 'siswa'});}}>Siswa</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {roleError && <p style={{ color: 'red' }}>Role wajib dipilih!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlSelectJurusan">
                                                    <Form.Label>Jurusan</Form.Label>
                                                    <Form.Control 
                                                        as="select" 
                                                        onChange={(e) => setUserData({...userData, jurusan_id: e.target.value})} // Pastikan nilai jurusanId diatur dengan benar
                                                        value={userData.jurusan_id}
                                                    >
                                                        <option value="">Pilih Jurusan</option>
                                                        {jurusans.map(jurusan => (
                                                            <option key={jurusan.id} value={jurusan.id}>{jurusan.nama_jurusan}</option>
                                                        ))}
                                                    </Form.Control>
                                                    {jurusanIdError && <p style={{ color: 'red' }}>Jurusan wajib dipilih!</p>}
                                            </Form.Group>


                                            <Button type='submit' color="primary" className="px-4">Tambah</Button>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={closeModalAdd}>Close</Button>
                                    </Modal.Footer>
                                </Modal>

                                <Button className='mt-3 mb-3' variant="success" onClick={showModalAdd}>
                                    <FontAwesomeIcon icon={faPlus} /> Tambah Data
                                </Button>
                                <Table striped bordered hover responsive className="font-ubuntu" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                    <thead style={{ backgroundColor: '#436850', color: 'white' }}>
                                        <tr>
                                            <th>No</th>
                                            <th>Username</th>
                                            <th>Nama User</th>
                                            <th>NIP</th>
                                            <th>No Hp</th>
                                            <th>TTD</th>
                                            <th>Role</th>
                                            <th>Jurusan</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0 ?(
                                            currentData.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>{startIndex + index}</td>
                                                <td>{user.username}</td>
                                                <td>{user.nama_user}</td>
                                                <td>{user.nip}</td>
                                                <td>{user.no_hp}</td>
                                                {/* <td><img src={user.ttd_url} alt="TTD" style={{ width: '50px', height: '50px' }} /></td> */}
                                                <td>{user.ttd ? (
                                            <img src={user.ttd_url} alt="TTD" style={{ width: '50px', height: '50px' }} />
                                        ) : (
                                            'N/A'
                                        )}</td>
                                                <td>{user.role}</td>
                                                <td>{jurusans.find(j => j.id === parseInt(user.jurusan_id))?.nama_jurusan}</td>
                                                <td>
                                                    <Button variant="primary" onClick={() => showModal(user)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    &nbsp;
                                                    <Button variant="danger" onClick={() => showModalDelete(user)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
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
                                {/* Tampilkan informasi jumlah data yang ditampilkan */}
        <div className='d-flex justify-content-between align-items-center mt-2'>
            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndex} to {endIndex} of {filteredData.length} results</p>
        
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
            </div>
        </div>
    );
}

export default Datapengguna;
