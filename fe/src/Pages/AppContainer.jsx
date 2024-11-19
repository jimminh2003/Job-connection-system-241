import React, { useState, useEffect } from 'react';
import Search from './Search';
import ListedJobs from './ListedJobs';

const AppContainer = ({ jobs, savedJobs, setSavedJobs }) => {
  const [filteredJobs, setFilteredJobs] = useState(jobs || []);

  // Update filteredJobs when jobs prop changes
  useEffect(() => {
    setFilteredJobs(jobs || []);
  }, [jobs]);

  return (
    <div className="container mx-auto px-4">
      <Search 
        jobs={jobs || []}
        setFilteredJobs={setFilteredJobs}
      />
      <ListedJobs 
        jobs={filteredJobs} 
        savedJobs={savedJobs} 
        setSavedJobs={setSavedJobs}
      />
    </div>
  );
};

export default AppContainer;