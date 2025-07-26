import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const Layout = () => {

  useEffect(() => {
    const tracked = sessionStorage.getItem("visitor-tracked");
    if (!tracked) {
      fetch("http://localhost:5001/api/visitor/track", { method: "POST" });
      sessionStorage.setItem("visitor-tracked", "1");
    }
  }, []);
  
    
  return (
    <div>
      <MainNav />
      
      <main className='h-full px-4 mt-2'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout