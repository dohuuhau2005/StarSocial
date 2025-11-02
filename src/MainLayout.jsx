import React from 'react'
import Sidebar from './Components/Sidebar'
import TopCreators from './Components/TopCreators'
import { Outlet } from 'react-router-dom'
import { usePopup } from './Components/IsPopup'
import { is } from 'date-fns/locale'
const MainLayout = () => {
  const { isPopup, setIsPopup } = usePopup();
  return (<>
    {
      isPopup ? (
        <div className="flex bg-white-900" >
          <div className="sticky top-0 w-64 h-screen">
            <Sidebar />
          </div>

          <div className="flex-1 p-4">
            <Outlet />
          </div>

          <div className="sticky top-0 w-1/4 bg-white-800 p-4 text-white h-screen overflow-auto">
            <TopCreators />
          </div>
        </div >) : (
        <div className="flex bg-white-900" >
          <div className="sticky top-0 w-20 h-screen">
            <Sidebar />
          </div>

          <div className="flex-1 p-0 ">
            <Outlet />
          </div>

          <div className="sticky top-0 w-1/4 bg-white-800 p-4 text-white h-screen overflow-auto hidden">
            <TopCreators />
          </div>
        </div >
      )


    }
  </>
  )
}

export default MainLayout
