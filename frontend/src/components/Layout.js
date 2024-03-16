import React from 'react';
import HeaderComponent from './HeaderComponent';
import { Outlet } from 'react-router-dom'; 

const Layout = () => {
  return (
    <>
      <HeaderComponent />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
