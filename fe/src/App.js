import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './Contexts/AuthContext';
import MainNavbar from './Jsx/navbar';
import { TabProvider } from './Jsx/TabContext';
import CompanyNavbar from './Jsx/CompanyNavbar';
import CompanyProfile from './Jsx/CompanyProfile';

function App() {
  return (
    // <AuthProvider>
    <>
      {/* <MainNavbar /> */}
      <div className="app">
        <Outlet />
      </div>
     </>
     //</AuthProvider>
  );
}

export default App;