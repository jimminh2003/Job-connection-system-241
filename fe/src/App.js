import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './App.css';
import Navbar from './conponents/navbar/navbar.js'
import Job_Home from './home/Job_Home/Job_Home.js'
import Home from './home/Home/Home.js';
import JobDetail from './JobDetail/JobDetail.js';

function App() {
  return (
    
    <div>
        {/* <Router> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/JobDetail/:jobId" element={<JobDetail />} />
          </Routes>
        {/* </Router> */}

        {/* <Home/> */}
    </div>
  );
}

export default App;
