import React from 'react'
import Sidebar from "../../component/Slidebar.js";
import Pemakaian from "../../DataPemakaian/Datapemakaian.js"

const datapeminjaman = () => {
  return (
    <div>
      <Sidebar/>
      <Pemakaian/>
    </div>
  )
}

export default datapeminjaman
