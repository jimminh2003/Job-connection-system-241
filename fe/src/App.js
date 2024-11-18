import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './App.css';
import Job_Home from './Jsx/Job_Home.jsx';
import Home from './Jsx/Home.jsx';
import JobDetail from './Jsx/JobDetail.jsx';
import CompanyProfile from './Jsx/CompanyProfile.jsx';
import ApplicantProfile from './Jsx/ApplicantProfile.jsx';
import AllCompany from './Pages/Allcompany.jsx';
import AllJob from "./Pages/AllJob";
import SavedJobs from "./Pages/SavedJobs";
import ErrorBoundary from "./Pages/ErrorBoudary";
import Test from './Pages/test.jsx';


function App() {
  return (
    
    <div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/JobDetail/:jobId" element={<JobDetail />} />
        <Route path="/CompanyProfile" element={<CompanyProfile />} />
        <Route path="/ApplicantProfile" element={<ApplicantProfile />} />
        <Route path="/alljob" element={<AllJob />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/saved-jobs/:id" element={<SavedJobs />} />
        <Route path="/allcompany" element={<AllCompany />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<ErrorBoundary />} />
      </Routes>


    </div>
  );
}

export default App;
