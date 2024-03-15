// Layout.js
import React from 'react';
import HeaderComponent from './HeaderComponent';
import { Outlet } from 'react-router-dom'; // Import Outlet

const Layout = () => {
  return (
    <>
      <HeaderComponent />
      <div>
        <Outlet /> {/* This renders the nested routes */}
      </div>
    </>
  );
};

export default Layout;
