// AllJob.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../Jsx/navbar';
import AppContainer from './AppContainer';
import Footer from '../Jsx/Footer';
import TokenManager from '../utils/tokenManager';

const AllJob = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null); 
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8; // Số công việc trên mỗi trang

  useEffect(() => {
    // Fetch job data from backend
    const fetchJobs = async () => {
      try {
        const token = TokenManager.getToken(); // Lấy token từ TokenManager
        const response = await fetch('/jobpostings', {
          headers: {
            'Authorization': `Bearer ${token}`, // Thêm token vào header
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError(error.message);
      }
    };
    fetchJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-1 py-8 max-w-full">
        {/* <h1 className="text-2xl font-bold mb-6">All Available Jobs</h1> */}
        <AppContainer 
          jobs={currentJobs} 
          savedJobs={savedJobs} 
          setSavedJobs={setSavedJobs} 
        />
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors duration-200`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />   
    </>
  );
};

export default AllJob;