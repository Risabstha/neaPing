import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login/Login.jsx';
import MainDashboard from './Component/MainDashboard.jsx';
// import ManageUser from './Component/Manage_User.jsx';
import ProtectedRoute from './Protected_Route/ProtectedRoute.jsx';
import MainManageIp from './Component/MainManageIp.jsx';
import Heatmap from "./Dashborad/Heatmap.jsx";

function App() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [showText, setShowText] = useState(() => window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      // Collapse if screen width is less than or equal to 768px
      if (window.innerWidth <= 768) {
        setCollapsed(true);
        setShowText(false);
      }
      else {
        setCollapsed(false);
        setShowText(true);
      }
    };

    // Run on initial load
    handleResize();
    // dynamically respond to resize:
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="dashboard"
              element={<MainDashboard collapsed={collapsed} setCollapsed={setCollapsed}
                showText={showText} setShowText={setShowText} />} />
            {/* <Route path="/manage_user" element ={<ManageUser/>} /> */}
            <Route
              path="/manageIp"
              element={<MainManageIp collapsed={collapsed} setCollapsed={setCollapsed}
                showText={showText} setShowText={setShowText}/>} />
            <Route
              path="/heatmap"
              element={<Heatmap />}
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
