import React from 'react'
import Sidebar from "../../component/Slidebar.js";
import Peminjaman from "../../DataPeminjaman/Datapeminjaman.js"

const datapeminjaman = () => {
  return (
    <div>
      <Sidebar/>
      <Peminjaman/>
    </div>
  )
}

export default datapeminjaman
