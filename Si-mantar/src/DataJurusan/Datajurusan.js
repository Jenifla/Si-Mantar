import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEdit, faTrashAlt, faSearch, faPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../assets/images.png";
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';
import { Pagination } from 'react-bootstrap';

const Datajurusan = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [jurusanData, setJurusanData] = useState({
        id: '',
        kode_jurusan: '',
        nama_jurusan: '',
        deskripsi_jurusan: ''    
    });

    const [kodejurusanError, setKodeJurusanError] = useState(false);
    const [namajurusanError, setNamaJurusanError] = useState(false);
    const [duplicateKodeJurusanError, setDuplicateKodeJurusanError] = useState(false);
    const [jurusan, setJurusan] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10); 

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        setCurrentPage(1);
    };

    useEffect(() => {
        console.log("key:", searchTerm);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/jurusans');
            setJurusan(response.data);
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filterData = jurusan.filter((jurusan) => {
        return (
            jurusan.nama_jurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jurusan.deskripsi_jurusan.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
    });

    // Hitung startIndex dan endIndex berdasarkan currentPage dan perPage
    const startIndex = (currentPage - 1) * dataPerPage + 1;
    const endIndex = Math.min(startIndex + dataPerPage - 1, filterData.length);

    // Potong data sesuai dengan indeks data awal dan akhir
    const currentData = filterData.slice(startIndex - 1, endIndex);

    // Hitung jumlah total halaman
    const totalPages = Math.ceil(filterData.length / dataPerPage);;


    const validateForm = () => {
        let isValid = true;
    
        // Validasi input 
        if (!jurusanData.kode_jurusan) {
            setKodeJurusanError(true);
            isValid = false;
        } else {
            setKodeJurusanError(false);
        }
        
        // Check for duplicate kode jurusan
        if (jurusan.some(item => item.kode_jurusan === jurusanData.kode_jurusan)) {
            setDuplicateKodeJurusanError(true);
            isValid = false;
        } else {
            setDuplicateKodeJurusanError(false);
        }

        if (!jurusanData.nama_jurusan) {
            setNamaJurusanError(true);
            isValid = false;
        } else {
            setNamaJurusanError(false);
        }

        return isValid;
    };


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeModal = () => {
        setNamaJurusanError(false);
        setJurusanData({
            id: '',
            kode_jurusan: '',
            nama_jurusan: '',
            deskripsi_jurusan: ''
        });
        // window.location.reload();
        setShow(false);
    };

    const showModal = (jurusanData) => {
        setJurusanData(jurusanData);
        setShow(true);
    };

    const closeModalDelete = () => {
        setShowDelete(false);
    };

    const showModalDelete = (jurusanData) => {
        setJurusanData(jurusanData);
        setShowDelete(true);
    };

    const closeModalAdd = () => {
        // window.location.reload();
        setKodeJurusanError(false);
        setDuplicateKodeJurusanError(false);
        setNamaJurusanError(false);
        setJurusanData({
            id: '',
            kode_jurusan: '',
            nama_jurusan: '',
            deskripsi_jurusan: ''
        });
        setShowAdd(false);
    };

    const showModalAdd = () => {
        setShowAdd(true);
    };

    const AddDataJurusan = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append('kode_jurusan', jurusanData.kode_jurusan);
            formData.append('nama_jurusan', jurusanData.nama_jurusan);
            formData.append('deskripsi_jurusan', jurusanData.deskripsi_jurusan);

            const response = await axios.post('http://127.0.0.1:8000/api/jurusans', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data); // Output respons dari server

            // Atur pesan sukses atau perbarui data yang ditampilkan ke pengguna
            fetchData(); // Ambil data terbaru setelah berhasil menambahkan
            setShowAdd(false)
            setKodeJurusanError(false);
            setDuplicateKodeJurusanError(false);
            setNamaJurusanError(false);
            setJurusanData({
                id: '',
                kode_jurusan: '',
                nama_jurusan: '',
                deskripsi_jurusan: ''
            });
            // window.location.reload();
        } catch (error) {
            console.error('Error adding data:', error);
            // Tambahkan logika untuk menampilkan pesan kesalahan di sini
        }
    };

    const DeleteDataJurusan = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/jurusans/${jurusanData.id}`);
            setShowDelete(false);
            fetchData();
            // window.location.reload();
            alert("Data berhasil dihapus");
        } catch (error) {
            console.error('Error deleting user:', error);
            alert("Data gagal dihapus");
        }
    };

    const UpdateDataJurusan = async (e) => {
        e.preventDefault();
        console.log('Data yang akan dikirim:', jurusanData);
        // Validasi input nama 
        if (!jurusanData.nama_jurusan) {
            setNamaJurusanError(true);
            return; // Keluar dari fungsi jika validasi gagal
        } else {
            setNamaJurusanError(false);
        }
    
        
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/jurusans/update/${jurusanData.id}`, jurusanData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            console.log(response.data); // Output respons dari server
            setJurusanData({
                id: '',
                kode_jurusan: '',
                nama_jurusan: '',
                deskripsi_jurusan: ''
            });
            setNamaJurusanError(false);
            fetchData(); // Ambil data terbaru setelah berhasil mengupdate
            setShow(false);
            // window.location.reload();
        } catch (error) {
            console.error('Error updating data:', error);
            // Menangani kesalahan dan menampilkan pesan kesalahan kepada pengguna
            if (error.response) {
                console.log(error.response.data); // Pesan kesalahan dari server
                // Tambahkan logika untuk menampilkan pesan kesalahan kepada pengguna
            } else if (error.request) {
                console.log(error.request); // Kesalahan koneksi jaringan
                // Tambahkan logika untuk menampilkan pesan kesalahan kepada pengguna
            } else {
                console.log('Error', error.message); // Kesalahan lainnya
                // Tambahkan logika untuk menampilkan pesan kesalahan kepada pengguna
            }
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
                                <h2 className='mb-3'style={{ backgroundColor: '#436850', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: 'white' }}>Data Program Keahlian</h2>
                                {/* Modal DELETE */}
                                <Modal show={showDelete} onHide={closeModalDelete} centered>
                                    
                                    <Modal.Body className="text-center" style={{ borderBottom: 'none' }}>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger mb-3" style={{ fontSize: '6em' }} />
                                        <h4>Apakah anda yakin?</h4>
                                        <p>Data yang sudah dihapus mungkin tidak bisa dikembalikan lagi!</p>
                                        <Button variant="primary" onClick={closeModalDelete}>Batal</Button>
                                        &nbsp;
                                        &nbsp;
                                        <Button variant="danger" onClick={DeleteDataJurusan}>Hapus</Button>
                                    </Modal.Body>
                                </Modal>

                                <Modal show={show} onHide={closeModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Form Update Data</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form onSubmit={UpdateDataJurusan}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputKodeJurusan">
                                                <Form.Label>Kode Jurusan</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    autoFocus
                                                    readOnly
                                                    value={jurusanData.kode_jurusan}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputNamaJurusan">
                                                <Form.Label>Nama Jurusan</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => {
                                                        setJurusanData({...jurusanData, nama_jurusan: e.target.value});
                                                        setNamaJurusanError(false);
                                                    }}
                                                    value={jurusanData.nama_jurusan}
                                                />
                                                {namajurusanError && <p style={{ color: 'red' }}>Nama Jurusan wajib diisi!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputDeskripsi">
                                                <Form.Label>Deskripsi</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    onChange={(e) => setJurusanData({...jurusanData, deskripsi_jurusan: e.target.value})}
                                                    value={jurusanData.deskripsi_jurusan}
                                                />
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
                                        <Form onSubmit={AddDataJurusan}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputKodeJurusan">
                                                <Form.Label>Kode Jurusan</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    autoFocus
                                                    onChange={(e) => {
                                                        setJurusanData({...jurusanData, kode_jurusan: e.target.value}); 
                                                        setKodeJurusanError(false);
                                                        setDuplicateKodeJurusanError(false);
                                                    }}
                                                    value={jurusanData.kode_jurusan}
                                                />
                                                {kodejurusanError && <p style={{ color: 'red' }}>Kode Jurusan wajib diisi!</p>}
                                                {duplicateKodeJurusanError && <p style={{ color: 'red' }}>Kode Jurusan sudah ada!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputNamaJurusan">
                                                <Form.Label>Nama Jurusan</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => {
                                                        setJurusanData({...jurusanData, nama_jurusan: e.target.value});
                                                        setNamaJurusanError(false);
                                                    }}
                                                    value={jurusanData.nama_jurusan}
                                                />
                                                {namajurusanError && <p style={{ color: 'red' }}>Nama Jurusan wajib diisi!</p>}
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputDeskripsi">
                                                <Form.Label>Deskripsi</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    onChange={(e) => setJurusanData({...jurusanData, deskripsi_jurusan: e.target.value})}
                                                    value={jurusanData.deskripsi_jurusan}
                                                />
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
                                            <th>Nama Jurusan</th>
                                            <th>Deskripsi</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0?(
                                            currentData.map((jurusan, index) => (
                                            <tr key={jurusan.id}>
                                                <td>{startIndex + index }</td>
                                                <td>{jurusan.nama_jurusan}</td>
                                                <td>{jurusan.deskripsi_jurusan}</td>
                                                <td>
                                                    <Button variant="primary" onClick={() => showModal(jurusan)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    &nbsp;
                                                    <Button variant="danger" onClick={() => showModalDelete(jurusan)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center' }}>No data available</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                                {/* Tampilkan informasi jumlah data yang ditampilkan */}
        <div className='d-flex justify-content-between align-items-center mt-2'>
            <p style={{ fontSize: '14px', color: 'grey' }}>Showing {startIndex} to {endIndex} of {filterData.length} results</p>
        
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

export default Datajurusan;
