import React from 'react'
import Sidebar from "../../component/Slidebar.js";
import Konten from "../../dashboard_user/dashboarduser.js"

const dashboard_user = () => {
  return (
    <div>
      <Sidebar/>
      <Konten/>
    </div>
  )
}

export default dashboard_user
