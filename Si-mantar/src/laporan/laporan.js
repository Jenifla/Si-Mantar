import './laporan.css';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import logo from "../assets/smk ijo.jpg";


const Laporan = React.forwardRef(({ data, columnData, jurusanId, jenislap, detaillap }, ref) => {
  const isJurusanId6 = jurusanId === 6 || jurusanId === null;

  console.log('Data yang diterima di Laporan:', data);
  console.log('Data colom:', columnData);

  const ttdkp= localStorage.getItem('ttd_ketua_program');
  const ttdsp= localStorage.getItem('ttd_sarpras');
  const [userData, setUserData] = useState([]);
  const [userDataS, setUserDataS] = useState([]);
  const [userDataKS, setUserDataKS] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users');
            // Filter pengguna dengan peran 'sarpras' saja
            const sarprasUsers = response.data.filter(user => user.role === 'ketua_program' && user.jurusan_id === jurusanId.toString());
            // Mengubah URL tanda tangan sesuai dengan kebutuhan Anda
            const usersWithImageUrl = sarprasUsers.map(user => {
                return {
                    ...user,
                    ttd_url: `http://127.0.0.1:8000${user.ttd}` // Sesuaikan dengan URL gambar TTD yang sesuai
                };
            });
            setUserData(usersWithImageUrl);
            console.log("user data, ", usersWithImageUrl)
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
    fetchData();
    const fetchDataS = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:8000/api/users');
          // Filter pengguna dengan peran 'sarpras' saja
          const sarprasUsers = response.data.filter(user => user.role === 'sarpras');
          // Mengubah URL tanda tangan sesuai dengan kebutuhan Anda
          const usersWithImageUrl = sarprasUsers.map(user => {
              return {
                  ...user,
                  ttd_url: `http://127.0.0.1:8000${user.ttd}` // Sesuaikan dengan URL gambar TTD yang sesuai
              };
          });
          setUserDataS(usersWithImageUrl);
          console.log("user data S, ", usersWithImageUrl)
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
  fetchDataS();
  const fetchDataKS = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/users');
        // Filter pengguna dengan peran 'sarpras' saja
        const sarprasUsers = response.data.filter(user => user.role === 'kepsek');
        // Mengubah URL tanda tangan sesuai dengan kebutuhan Anda
        const usersWithImageUrl = sarprasUsers.map(user => {
            return {
                ...user,
                ttd_url: `http://127.0.0.1:8000${user.ttd}` // Sesuaikan dengan URL gambar TTD yang sesuai
            };
        });
        setUserDataKS(usersWithImageUrl);
        console.log("user data KS, ", usersWithImageUrl)
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
fetchDataKS();
}, []);


  const getCurrentSchoolYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    let startYear, endYear;

    if (currentMonth < 6) { // Before July (January to June)
      startYear = currentYear - 1;
      endYear = currentYear;
    } else { // July and after (July to December)
      startYear = currentYear;
      endYear = currentYear + 1;
    }

    return `${startYear}/${endYear}`;
  };

  const currentSchoolYear = getCurrentSchoolYear();


  const date = new Date();
  const options = {  year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('id-ID', options);

  const renderSignatures = () => {
    if (isJurusanId6) {
      return (
        <div className="signature-section">
          <div className="header-rows">
      <div style={{ textAlign: 'center'}}>
            Mengetahui,
          </div>
      </div>
      <div className="header-roww">
      <div className="header-cols col-10">
        {userDataKS.map((user, index) => (
          <div key={index} className="signature-section">
          
          <div style={{ textAlign: 'center'}}>
          Kepala Sekolah SMK 1 Mejayan,
          </div>
          <div style={{ textAlign: 'center'}} className="gambar-container" > 
                <img
                  src={user.ttd_url}
                  alt={`TTD Kepsek`}
                  className="ttd-image"
                  style={{ width: '100px', height: '100px', marginRight: '10px' }}
                />
          </div>
          <div style={{ textAlign: 'center', textDecoration: 'underline'}}>{user.nama_user}</div>
          <div style={{ textAlign: 'center'}}>NIP. {user.nip}</div>
          </div>
        ))}
        </div>
      <div className="header-cols col-10">
  {userDataS.map((user, index) => (
    <div key={index} className="signature-section">
      <div style={{ textAlign: 'center' }}>Ketua Sarana Prasarana</div>
      <div style={{ textAlign: 'center' }} className="gambar-container">
        <img
          src={user.ttd_url}
          alt={`TTD Sarpras ${index + 1}`}
          className="ttd-image"
          style={{ width: '100px', height: '100px', marginRight: '10px' }}
        />
      </div>
      <div style={{ textAlign: 'center', textDecoration: 'underline' }}>{user.nama_user}</div>
      <div style={{ textAlign: 'center' }}>NIP. {user.nip}</div>
    </div>
  ))}
</div>
</div>
        </div>
      );
    }else {
      return (
        <div>
          <div className="header-roww">
      <div className="header-cols col-10">
  {userDataS.map((user, index) => (
    <div key={index} className="signature-section">
      <div style={{ textAlign: 'center' }}>Ketua Sarana Prasarana</div>
      <div style={{ textAlign: 'center' }} className="gambar-container">
        <img
          src={user.ttd_url}
          alt={`TTD Sarpras ${index + 1}`}
          className="ttd-image"
          style={{ width: '100px', height: '100px', marginRight: '10px' }}
        />
      </div>
      <div style={{ textAlign: 'center', textDecoration: 'underline' }}>{user.nama_user}</div>
      <div style={{ textAlign: 'center' }}>NIP. {user.nip}</div>
    </div>
  ))}
</div>

        <div className="header-cols col-10">
        {userData.map((user, index) => (
          <div key={index} className="signature-section">
          <div style={{ textAlign: 'center'}}>
          Ketua Program Keahlian,
          </div>
          <div style={{ textAlign: 'center' }} className="gambar-container">
                <img
                  src={user.ttd_url}
                  alt={`TTD Keprop ${index + 1}`}
                  className="ttd-image"
                  style={{ width: '100px', height: '100px', marginRight: '10px' }}
                />
             
          </div>
          <div style={{ textAlign: 'center', textDecoration: 'underline'}}>{user.nama_user}</div>
          <div style={{ textAlign: 'center'}}>NIP. {user.nip}</div>
          </div>
        ))}
        </div>
      </div>
      <br></br>
      <div className="header-roww">
      <div className="header-cols col-10">
        {userDataKS.map((user, index) => (
          <div key={index} className="signature-section">
          <div style={{ textAlign: 'center'}}>
            Mengetahui,
          </div>
          <div style={{ textAlign: 'center'}}>
          Kepala Sekolah SMK 1 Mejayan,
          </div>
          <div style={{ textAlign: 'center'}} className="gambar-container" > 
                <img
                  src={user.ttd_url}
                  alt={`TTD Kepsek`}
                  className="ttd-image"
                  style={{ width: '100px', height: '100px', marginRight: '10px' }}
                />
          </div>
          <div style={{ textAlign: 'center', textDecoration: 'underline'}}>{user.nama_user}</div>
          <div style={{ textAlign: 'center'}}>NIP. {user.nip}</div>
          </div>
        ))}
        </div>
      </div>
        </div>
      );
    }
  };

  return (
    
    <div ref={ref} className="surat-container">
      
      <div className="header-row">
        <div className="header-col col-1">
          <strong>PEMERINTAH PROVINSI JAWA TIMUR</strong><br />
          DINAS PENDIDIKAN<br />
          SEKOLAH MENENGAH KEJURUAN NEGERI 1. MEJAYAN
        </div>
      </div>
      <div className="header-row">
        <div className="header-col col-2">
          J Imam Bonjol No. 7 Telp. (0351) 388 490, Email: smkn.mejayan@yahoo.co.id
        </div>
      </div>
      <div className="header-row">
        <div className="header-col col-3">
          MADIUN
        </div>
        <div className="header-col col-4">
          Kode Pos 63153
        </div>
      </div>
      <div className="garis">
        _________________________________________________________________________________
      </div>
      <br></br>
      <div className="header-row">
        <div className="header-col col-5">
          LAPORAN BARANG INVENTARIS {jenislap ? `PER ${jenislap.toUpperCase()}` : ''}
        </div>
      </div>
      <div className="header-row">
        <div className="header-col col-6">
          {detaillap.toUpperCase()}
        </div>
      </div>
      <div className="header-row">
        <div className="header-col col-7">
          SMK NEGERI 1 MEJAYAN
        </div>
      </div>
      <div className="header-row">
        <div className="header-col col-8">
          Tahun ajaran {currentSchoolYear}
        </div>
      </div>
      <br></br>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
            <th style={{ fontSize: '12px' }}>No</th>
              {columnData.map((column, index) => (
                <th key={index}style={{ fontSize: '12px' }}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((barang, index) => (
              <tr key={index}>
                <td style={{ fontSize: '10px' }}>{index + 1}</td>
                {columnData.map((column, index) => (
                  <td key={index}style={{ fontSize: '10px' }}>{barang[column.field]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br></br>
      
      <div className="header-roow">
        <div >
          Mejayan, {formattedDate}
        </div>
      </div>
      {renderSignatures()}
      
    </div>
  );
});

export default Laporan;
