import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './App.css';
import Job_Home from './Jsx/Job_Home.jsx';
import Home from './Jsx/Home.jsx';
import JobDetail from './Pages/JobDetail.jsx';
import CompanyProfile from './Jsx/CompanyProfile.jsx';
import ApplicantProfile from './Jsx/ApplicantProfile.jsx';

import AllJob from "./Pages/AllJob";
import SavedJobs from "./Pages/SavedJobs";
import ErrorBoundary from "./Pages/ErrorBoudary";
//import Test from './Pages/test.jsx';
import CompanyDetail from './Pages/CompanyDetail.jsx';
import AllCompany from './Pages/Allcompany.jsx';
import Login from './Pages/Auth/Login.jsx';
import Register from './Pages/Auth/Register.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
//import LocationSelector from './Pages/test.jsx';
import { AuthProvider } from './Contexts/AuthContext.jsx';

function App() {
  return (
 
    <AuthProvider>  
    <div>

  <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/JobDetail/:id" element={<JobDetail />} />
        <Route path="/CompanyProfile/:id" element={<CompanyProfile />} />
        <Route path="/CompanyProfile" element={<CompanyProfile />} />
        <Route path="/ApplicantProfile" element={<ApplicantProfile />} />
        <Route path="/alljob" element={<AllJob />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/saved-jobs/:id" element={<SavedJobs />} />
        <Route path="/allcompany" element={<AllCompany />} />
        <Route path="/allcompany/:id" element={<CompanyDetail />} />
        <Route path="*" element={<ErrorBoundary />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/applicantprofile" element={<ApplicantProfile />} />
        <Route path="/companyprofile" element={<CompanyProfile />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
      </Route>
  </Routes>


    </div>
    </AuthProvider>
    
  );
}

export default App;
