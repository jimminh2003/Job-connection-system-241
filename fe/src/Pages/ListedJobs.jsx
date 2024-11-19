import React from 'react';
import { useNavigate } from "react-router-dom";
import defaultImage from '../images/logo1.png';
import {
  BookmarkPlus,
  Bookmark,
  Building2,
  MapPin,
  Newspaper
} from "lucide-react";

const ListedJobs = ({ jobs = [], setSavedJobs = () => {}, savedJobs = [] }) => {
  const navigate = useNavigate();
   
  const handleSave = (id) => {
    setSavedJobs(prev => {
      const isAlreadySaved = prev.includes(id);
      if (isAlreadySaved) {
        return prev.filter(savedId => savedId !== id);
      }
      return [...prev, id];
    });
  };

  const formatSalaryRange = (min, max) => {
    if (min === 0 && max === 0) return "Negotiable";
    if (min === 0) return `Up to $${max}k`;
    if (max === 0) return `From $${min}k`;
    return `$${min}k - $${max}k`;
  };

  if (!Array.isArray(jobs)) {
    return (
      <div className="w-full flex justify-center items-center mt-8">
        <span className="text-gray-500 text-lg">Loading jobs...</span>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="w-full flex justify-center items-center mt-8">
        <span className="text-gray-500 text-lg">No jobs found!</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-between flex-wrap mt-8">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="md:w-[49%] w-full bg-white mb-5 rounded-lg flex items-center justify-between md:p-8 py-8 px-4 border border-gray-200"
        >
          <div className="flex md:flex-row flex-col md:items-center items-start gap-6">
            <img
              src={job.image || defaultImage}
              alt="Company logo"
              className="w-[70px] h-[70px] object-contain bg-gray-50 rounded-md"
            />
            <div className="flex flex-col gap-[6px]">
              <span className="font-semibold text-indigo-500 text-[22px]">
                {job.description || 'Position Available'}
              </span>
              
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-600" />
                <span className="text-[14px] font-medium text-gray-600">
                  Level: {job.level}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-[14px] font-medium text-gray-600">
                  Schedule: {job.schedule === '0' ? 'Part Time' : job.schedule === '1' ? 'Full Time' : 'Not specified'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-gray-600" />
                <span className="text-[14px] font-medium text-gray-600">
                  {formatSalaryRange(job.minSalary, job.maxSalary)}
                </span>
              </div>

              <div className="text-sm text-gray-500 mt-2">
                <span className="font-medium">
                  Applicants: {job.numberOfApplicants} | 
                  Allowance: ${job.allowance}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 self-end">
            <button
              onClick={() => navigate(`/JobDetail/${job.id}`)}
              className={`text-white font-bold text-lg rounded-md transition-colors w-40 h-10 ${
                job.status 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
              disabled={!job.status}
            >
              {job.status ? 'Closed' : 'Apply'}
            </button>
            
            <button
              onClick={() => handleSave(job.id)}
              className={`flex items-center gap-2 cursor-pointer rounded-md justify-center py-1 border ${
                savedJobs.includes(job.id)
                  ? "bg-gray-100 border-indigo-500"
                  : "bg-gray-200 border-gray-200"
              }`}
            >
              {savedJobs.includes(job.id) ? (
                <Bookmark className="w-4 h-4 text-indigo-500" />
              ) : (
                <BookmarkPlus className="w-4 h-4 text-indigo-500" />
              )}
              <span className="font-medium text-[14.5px] text-gray-600">
                {savedJobs.includes(job.id) ? "Saved!" : "Save"}
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListedJobs;