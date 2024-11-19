import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const Search = ({ jobs = [], setFilteredJobs }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    level: ''
  });

  // Filter jobs whenever filters change
  useEffect(() => {
    if (Array.isArray(jobs)) {
      const results = jobs.filter(job => {
        const matchSearch = job.description?.toLowerCase().includes(filters.search.toLowerCase());
        const matchType = !filters.type || getScheduleType(job.schedule) === filters.type;
        const matchLevel = !filters.level || job.level === filters.level;

        return matchSearch && matchType && matchLevel;
      });

      setFilteredJobs(results);
    }
  }, [filters, jobs, setFilteredJobs]);

  const getScheduleType = (schedule) => {
    return schedule === "0" ? "Part Time" : "Full Time";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: '',
      level: ''
    });
    setFilteredJobs(jobs);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-12 grid gap-10">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center gap-2.5">
          <div className="flex gap-2 items-center flex-1">
            <SearchIcon className="w-6 h-6 text-gray-500" />
            <input 
              type="text" 
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              className="bg-transparent text-blue-500 focus:outline-none w-full" 
              placeholder="Search Job Here..."
            />
          </div>
        </div>
      </form>

      <div className="flex items-center gap-10 justify-center">
        <div className="flex items-center gap-2">
          <label htmlFor="type" className="text-gray-500 font-semibold">
            Type:
          </label>
          <select 
            id="type"
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="bg-white rounded px-4 py-1 border border-gray-200"
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="level" className="text-gray-500 font-semibold">
            Level:
          </label>
          <select 
            id="level"
            name="level"
            value={filters.level}
            onChange={handleInputChange}
            className="bg-white rounded px-4 py-1 border border-gray-200"
          >
            <option value="">All Levels</option>
            <option value="FRESHER">Fresher</option>
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
          </select>
        </div>

        <button 
          onClick={handleClearFilters}
          className="text-gray-400 hover:text-gray-600"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Search;