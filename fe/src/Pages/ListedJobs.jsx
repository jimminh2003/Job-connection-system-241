import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import defaultImage from '../images/logo1.png';
import {
  Heart,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  DollarSign,
  ArrowRight,
  Flame,
  Code
} from "lucide-react";

const ListedJobs = ({ jobs = [], savedJobs = [], setSavedJobs = () => {} }) => {
  const navigate = useNavigate();
  const [hoveredJob, setHoveredJob] = useState(null);

  // Helper function to parse ISO date strings and handle nulls
  const parseDateString = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleSave = (e, id) => {
    e.stopPropagation();
    setSavedJobs(prev => {
      const isAlreadySaved = prev.includes(id);
      if (isAlreadySaved) {
        return prev.filter(savedId => savedId !== id);
      }
      return [...prev, id];
    });
  };
   
  const formatSalaryRange = (min, max) => {
    if (!min && !max) return "Thương lượng";
    
    // Convert to millions for display
    const formatMillion = (value) => {
      if (!value) return 0;
      return (value / 1000000).toFixed(1);
    };
    
    if (!min) return `Tối đa ${formatMillion(max)}tr`;
    if (!max) return `Từ ${formatMillion(min)}tr`;
    return `${formatMillion(min)}tr - ${formatMillion(max)}tr`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = parseDateString(dateString);
    if (!date) return "Chưa cập nhật";
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const isHotJob = (postedDate) => {
    if (!postedDate) return false;
    const date = parseDateString(postedDate);
    if (!date) return false;
    
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  if (!Array.isArray(jobs)) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex justify-center items-center mt-8"
      >
        <span className="text-gray-500 text-lg">Đang tải danh sách việc làm...</span>
      </motion.div>
    );
  }

  // Improved sorting logic for null dates and ISO format
  const activeJobs = jobs
    .filter(job => job.status)
    .sort((a, b) => {
      const dateA = parseDateString(a.postedDate);
      const dateB = parseDateString(b.postedDate);
      
      // Put jobs with dates first
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      
      return dateB.getTime() - dateA.getTime();
    });

  if (activeJobs.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex justify-center items-center mt-8"
      >
        <span className="text-gray-500 text-lg">Không tìm thấy việc làm phù hợp!</span>
      </motion.div>
    );
  }

  const handleCompanyClick = (e, companyId) => {
    if (!companyId) return; // Prevent navigation if companyId is null
    e.stopPropagation();
    navigate(`/allcompany/${companyId}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
    >
      <AnimatePresence>
        {activeJobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0,0,0,0.12)"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
            onClick={() => navigate(`/JobDetail/${job.id}`)}
            onMouseEnter={() => setHoveredJob(job.id)}
            onMouseLeave={() => setHoveredJob(null)}
            className={`
              relative 
              bg-green-50
              rounded-2xl 
              shadow-lg 
              overflow-hidden 
              border-2
              transition-all 
              duration-300
              cursor-pointer
              ${hoveredJob === job.id 
                ? 'border-blue-600 ring-4 ring-blue-100' 
                : 'border-transparent'}
            `}
          >
            <div className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={job.companyImage || defaultImage}
                      alt={job.companyName || "Công ty"}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 transition truncate max-w-[600px]">
                        {job.title || "Chưa cập nhật tên công việc"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {isHotJob(job.postedDate) && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-sm"
                        >
                          <Flame className="w-4 h-4" />
                          Hot
                        </motion.span>
                      )}
                    </div>
                    {job.companyId && job.companyName && (
                      <p 
                        onClick={(e) => handleCompanyClick(e, job.companyId)} 
                        className="text-gray-600 hover:text-blue-600 cursor-pointer hover:underline truncate max-w-[600px]"
                      >
                        {job.companyName}
                      </p>
                    )}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleSave(e, job.id)}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Heart
                    className={`
                      w-4 h-4 
                      transition-all 
                      duration-300 
                      ${savedJobs.includes(job.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-300"}
                    `}
                  />
                  <span className="text-sm">
                    {savedJobs.includes(job.id) ? "Đã lưu" : "Lưu tin"}
                  </span>
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-600">{job.level || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-gray-600">{job.province || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-600">{job.jobType || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-600">{job.schedule || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-600">{job.yoe ? `${job.yoe} năm kinh nghiệm` : "Chưa cập nhật"}</span>
                </div>

                {job.skills && (
                  <div className="mt-4 flex items-start gap-2">
                    <Code className="w-5 h-5 mt-1 text-indigo-400" />
                    <div className="flex flex-wrap gap-2">
                      {job.skills.split(',').map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-sm truncate max-w-[150px]"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-600">
                    {formatSalaryRange(job.minSalary, job.maxSalary)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {formatDate(job.postedDate)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ListedJobs;