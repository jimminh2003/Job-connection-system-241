import React from 'react';
import { Search as SearchIcon, Home, MapPin, X } from 'lucide-react';

const Search = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-12 grid gap-10">
      <form action="">
        <div className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center gap-2.5">
          <div className="flex gap-2 items-center flex-1">
            <SearchIcon className="w-6 h-6 text-gray-500" />
            <input 
              type="text" 
              className="bg-transparent text-blue-500 focus:outline-none w-full" 
              placeholder="Search Job Here..."
            />
          </div>

          <div className="flex gap-2 items-center flex-1">
            <Home className="w-6 h-6 text-gray-500" />
            <input 
              type="text" 
              className="bg-transparent text-blue-500 focus:outline-none w-full" 
              placeholder="Search by Company..."
            />
          </div>

          <div className="flex gap-2 items-center flex-1">
            <MapPin className="w-6 h-6 text-gray-500" />
            <input 
              type="text" 
              className="bg-transparent text-blue-500 focus:outline-none w-full" 
              placeholder="Search by Location..."
            />
          </div>

          <button className="bg-blue-600 py-2 px-10 rounded-lg text-white hover:bg-blue-500 transition-colors">
            Search
          </button>
        </div>
      </form>

      <div className="flex items-center gap-10 justify-center">
        <div className="flex items-center gap-2">
          <label htmlFor="relevance" className="text-gray-500 font-semibold">
            Sort by:
          </label>
          <select 
            id="relevance" 
            className="bg-white rounded px-4 py-1 border border-gray-200"
          >
            <option value="">Relevance</option>
            <option value="">Inclusive</option>
            <option value="">Starts With</option>
            <option value="">Contains</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="type" className="text-gray-500 font-semibold">
            Type:
          </label>
          <select 
            id="type" 
            className="bg-white rounded px-4 py-1 border border-gray-200"
          >
            <option value="">Full-time</option>
            <option value="">Remote</option>
            <option value="">Contract</option>
            <option value="">Part-time</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="level" className="text-gray-500 font-semibold">
            Level:
          </label>
          <select 
            id="level" 
            className="bg-white rounded px-4 py-1 border border-gray-200"
          >
            <option value="">Senior</option>
            <option value="">Beginner</option>
            <option value="">Intermediate</option>
            <option value="">Advocate</option>
          </select>
        </div>

        <button className="text-gray-400 hover:text-gray-600">
          Clear All
        </button>
      </div>
      
    </div>
  );
};

export default Search;