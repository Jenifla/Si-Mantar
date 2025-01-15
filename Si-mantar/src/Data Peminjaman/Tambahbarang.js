import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Tambahbarang.css";
import { Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEdit, faTrashAlt, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import avatar from "../assets/images.png";
import Slidebar from '../component/Slidebar';
import Topbar from '../component/topbar';

function InputBarang() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ruanganOptions, setRuanganOptions] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [existingBarangCodes, setExistingBarangCodes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [jurusanId, setJurusanId] = useState(null);
  
  const [formData, setFormData] = useState({
    ruangan_id:'',
    user_id: userId,
    jurusan_id: jurusanId,
    kode_barang: '',
    nama_barang: '',
    spesifikasi: '',
    jenis_barang: '',
    kategori_barang: '',
    pengadaan: '',
    keadaan_barang: '',
    kuantitas: '',
    keterangan_barang: ''
  });

   console.log("data ini:", formData)
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
};

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.post('http://127.0.0.1:8000/api/auth/me');
    setUserId(response.data.id);
    console.log("User ID diperbarui:", response.data.id);
    await fetchExistingBarangCodes();
      await fetchRuanganOptions();
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

useEffect(() => {
  
  fetchData();
  console.log("User ID:", userId);
  console.log("Jurusan ID:", jurusanId);
  if (userId !== null && jurusanId !== null) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      user_id: userId,
      jurusan_id: jurusanId,
    }));
  }
  console.log("data dari database:", existingBarangCodes)
}, [userId, jurusanId]);

const fetchExistingBarangCodes = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/barangs');
    const barangData = response.data;
    const codes = barangData.map(barang => barang.kode_barang);
    
    setExistingBarangCodes(codes);
  } catch (error) {
    console.error("Error fetching existing barang codes:", error);
  }
};

  const fetchRuanganOptions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/ruangans');
      const ruanganData = response.data;
      console.log("data ruangans: ", ruanganData)
      const options = ruanganData.map(ruangan => ({
        value: ruangan.id,
        label: ruangan.nama_ruangan,
        jurusan_id: ruangan.jurusan_id
      }));
      setRuanganOptions(options);
    } catch (error) {
      console.error("Error fetching ruangan data:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
  
    // Validasi kode barang harus diisi dan harus unik
    if (!formData.kode_barang.trim()) {
      errors.kode_barang = "Kode Barang harus diisi!*";
    } else if (existingBarangCodes.includes(formData.kode_barang)) {
      errors.kode_barang = "Kode Barang sudah digunakan!*";
    }
  
    if (!formData.nama_barang.trim()) {
      errors.nama_barang = "Nama Barang harus diisi!*";
    }

    // Validasi kategori barang harus dipilih
    if (!formData.kategori_barang.trim()) {
      errors.kategori_barang = "Kategori Barang harus dipilih!*";
    }

    // Validasi jenis barang harus dipilih
    if (!formData.jenis_barang.trim()) {
      errors.jenis_barang = "Jenis Barang harus dipilih!*";
    }
  
    // Validasi keadaan barang harus dipilih
    if (!formData.keadaan_barang.trim()) {
      errors.keadaan_barang = "Keadaan Barang harus dipilih!*";
    }

    // Validasi kuantitas
    if (formData.kuantitas === null || formData.kuantitas === undefined || formData.kuantitas === "") {
      errors.kuantitas = "Kuantitas Barang harus diisi!";
  } else {
      // Pastikan kuantitas adalah angka
      const kuantitas = parseFloat(formData.kuantitas);
      if (isNaN(kuantitas)) {
          errors.kuantitas = "Kuantitas Barang harus berupa angka!";
      } else if (kuantitas <= 0) {
          errors.kuantitas = "Kuantitas Barang harus lebih besar dari 0!";
      }
  }

    if (!formData.pengadaan.trim()) {
      errors.pengadaan = "Tanggal Pengadaan Barang harus diisi!*";
    }
  
    // Validasi lokasi barang harus dipilih
    if (!formData.ruangan_id) {
      errors.ruangan_id = "Letak Barang harus dipilih!*";
    }
  
    return errors;
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Nilai yang dipilih:", value);
    console.log("Opsi ruangan:", ruanganOptions);
    setFormData({
      ...formData,
      user_id: userId,
      [name]: value,
      // jurusan_id: jurusanId 
    });
    // setJurusanId(jurusanId);
  };

  const handleInputLetakChange = (e) => {
    const { name, value } = e.target;
    console.log("Nilai yang dipilih:", value);
    const jurusanId = e.target.options[e.target.selectedIndex].dataset.jurusanid || null;
    console.log("Opsi ruangan:", ruanganOptions);
  console.log("jurusan select: ", jurusanId);
    setFormData({
      ...formData,
      // user_id: userId,
      [name]: value,
      jurusan_id: jurusanId 
    });
    setJurusanId(jurusanId);
  };

  


  const submitData = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const dataToSend = {
          ...formData,
          ruangan_id: parseInt(formData.ruangan_id),
          user_id: parseInt(formData.user_id),
          jurusan_id: parseInt(formData.jurusan_id)
        };
        console.log("Data yang akan dikirim:", dataToSend);
        await axios.post('http://127.0.0.1:8000/api/barangs', dataToSend);
        console.log("Data berhasil disimpan!");
        alert("Data berhasil ditambahkan!");
        window.location.href = "/databarang";
      } catch (error) {
        console.error("Error saat menyimpan data:", error.response ? error.response.data : error.message);
      }
    } else {
      setErrorMessages(errors);
    }
  };
  

  return (
    <div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Slidebar />
      </div>
            <div className={`main ${isSidebarOpen ? 'shifted' : ''}`}>
            <Topbar toggleSidebar={toggleSidebar} />
          <div className="co-input">
            <h2>Input Data Barang</h2>
            <br />
            <div className="input-group">
              <label htmlFor="kodebarang">Kode Barang</label>
              <input type="text" id="kodebarang" name="kode_barang" value={formData.kode_barang} onChange={handleInputChange} placeholder="Masukkan kode barang" />
              {errorMessages.kode_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.kode_barang}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="nama">Nama Barang</label>
              <input type="text" id="nama" name="nama_barang" value={formData.nama_barang} onChange={handleInputChange} placeholder="Masukkan nama barang" />
              {errorMessages.nama_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.nama_barang}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="spesifikasi">Spesifikasi</label>
              <input
                type="spesifikasi"
                id="spesifikasi"
                name="spesifikasi" value={formData.spesifikasi} onChange={handleInputChange}
                placeholder=""
              />
            </div>

            <div className="input-group">
              <label htmlFor="jenisbarang">Jenis Barang</label>
              <select id="jenisbarang" name="jenis_barang" value={formData.jenis_barang} onChange={handleInputChange}>
                <option value="">Pilih Jenis Barang</option>
                <option value="barang sekolah">Barang Sekolah</option>
                <option value="barang jurusan">Barang Jurusan</option>
              </select>
              {errorMessages.jenis_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.jenis_barang}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="kategoribarang">Kategori Barang</label>
              <select id="kategoribarang" name="kategori_barang" value={formData.kategori_barang} onChange={handleInputChange}>
                <option value="">Pilih Kategori Barang</option>
                <option value="barang inventaris">Barang Inventaris</option>
                <option value="barang habis pakai">Barang Habis Pakai</option>
              </select>
              {errorMessages.kategori_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.kategori_barang}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="pengadaan">Pengadaan</label>
              <input type="date" id="pengadaan" name="pengadaan" value={formData.pengadaan} onChange={handleInputChange} placeholder="" />
              {errorMessages.pengadaan && <p style={{ color: 'red' }} className="error-message">{errorMessages.pengadaan}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="keadaanbarang">Keadaan Barang</label>
              <select id="keadaanbarang" name="keadaan_barang" value={formData.keadaan_barang} onChange={handleInputChange}>
                <option value="">Pilih Keadaan Barang</option>
                <option value="baik">Baik</option>
                <option value="rusak ringan">Rusak Ringan</option>
                <option value="rusak sedang">Rusak Sedang</option>
                <option value="rusak berat">Rusak Berat</option>
              </select>
              {errorMessages.keadaan_barang && <p style={{ color: 'red' }} className="error-message">{errorMessages.keadaan_barang}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="ruanganId">Letak Barang</label>
              <select id="ruanganId" name="ruangan_id" value={formData.ruangan_id} onChange={handleInputLetakChange}>
              <option value="">Pilih Letak Barang</option>
              {ruanganOptions.map(option => (
                <option key={option.value} value={option.value} data-jurusanid={option.jurusan_id}>
                  {option.label}
                </option>
              ))}
              </select>
              {errorMessages.ruangan_id && <p style={{ color: 'red' }} className="error-message">{errorMessages.ruangan_id}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="kuantitas">Kuantitas</label>
              <input type="number" id="kuantitas" name="kuantitas" value={formData.kuantitas} onChange={handleInputChange} placeholder="Masukkan jumlah barang" />
              {errorMessages.kuantitas && <p style={{ color: 'red' }} className="error-message">{errorMessages.kuantitas}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="keterangan">Keterangan Barang</label>
              <input type="text" id="keterangan" name="keterangan_barang" value={formData.keterangan_barang} onChange={handleInputChange} placeholder="Masukkan keterangan barang" />
            </div>

            <button className="butn" onClick={submitData}>
              Submit
            </button>
          </div>
          </div>
    </div>
  );
}

export default InputBarang;
