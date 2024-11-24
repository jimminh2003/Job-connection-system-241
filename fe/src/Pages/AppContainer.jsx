import React, { useState, useEffect, useCallback } from 'react';
import Search from './Search';
import ListedJobs from './ListedJobs';
import JobFilter from './JobFilter';

const AppContainer = ({ jobs, savedJobs, setSavedJobs }) => {
  const [filteredJobs, setFilteredJobs] = useState(jobs || []);
  const [searchCriteria, setSearchCriteria] = useState({
    searchType: 'all',
    searchTerm: '',
    location: {
      province: '',
      city: '',
      ward: ''
    }
  });

  // Tối ưu hóa hàm filterJobs bằng useCallback
  const filterJobs = useCallback(() => {
    let results = [...jobs];
    
    // Lọc theo searchTerm và searchType
    if (searchCriteria.searchTerm) {
      const searchTerm = searchCriteria.searchTerm.toLowerCase();
      results = results.filter(job => {
        const title = job.title?.toLowerCase() || '';
        const jobType = job.jobType?.toLowerCase() || '';
        const companyName = job.companyName?.toLowerCase() || '';

        switch (searchCriteria.searchType) {
          case 'job':
            return title.includes(searchTerm) || jobType.includes(searchTerm);
          case 'company':
            return companyName.includes(searchTerm);
          default: // 'all'
            return title.includes(searchTerm) || 
                   jobType.includes(searchTerm) || 
                   companyName.includes(searchTerm);
        }
      });
    }

    // Lọc theo location
    const { province, city, ward } = searchCriteria.location;
    if (province) {
      results = results.filter(job => job.province === province);
      
      if (city) {
        results = results.filter(job => job.city === city);
        
        if (ward) {
          results = results.filter(job => job.ward === ward);
        }
      }
    }

    setFilteredJobs(results);
  }, [jobs, searchCriteria]);

  // Theo dõi thay đổi của searchCriteria để cập nhật filteredJobs
  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  // Handler để cập nhật searchCriteria
  const handleSearchUpdate = useCallback((newCriteria) => {
    setSearchCriteria(prev => ({
      ...prev,
      ...newCriteria
    }));
  }, []);

  // Handler để áp dụng bộ lọc từ JobFilter
  const handleFilterUpdate = useCallback((filteredResults) => {
    setFilteredJobs(filteredResults);
  }, []);

  return (
    
    <div className="container-fluid mx-auto px-4">
      
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full px-8 py-6 mb-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Search 
            jobs={jobs}
            searchCriteria={searchCriteria}
            onSearchUpdate={handleSearchUpdate}
            currentResults={filteredJobs}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full max-w-[2000px] mx-auto px-8 py-6 mb-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <JobFilter 
            jobs={jobs}
            onFilterUpdate={handleFilterUpdate}
            currentResults={filteredJobs}
          />
        </div>

        <div className="w-full max-w-[2000px] mx-auto px-8 py-6 mb-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <ListedJobs 
            jobs={filteredJobs}
            savedJobs={savedJobs}
            setSavedJobs={setSavedJobs}
            searchCriteria={searchCriteria}
          />
        </div>
      </div>
      </div>
    
  );
};

export default AppContainer;