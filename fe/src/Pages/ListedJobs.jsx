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
  Flame
} from "lucide-react";
import '../css/ListedJob.css';
const ListedJobs = ({ jobs = [], savedJobs = [], setSavedJobs = () => {} }) => {
  const navigate = useNavigate();
  const [hoveredJob, setHoveredJob] = useState(null);
   
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
    if (min === 0 && max === 0) return "Thương lượng";
    if (min === 0) return `Tối đa ${max}tr`;
    if (max === 0) return `Từ ${min}tr`;
    return `${min}tr - ${max}tr`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const isHotJob = (postedDate) => {
    if (!postedDate) return false;
    const postDate = new Date(postedDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postDate);
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

  // Lọc các job có status = false (đang mở) và sắp xếp theo ngày mới nhất
  const activeJobs = jobs
    .filter(job => job.status) // Chỉ lấy các job có status = false (đang mở)
    .sort((a, b) => {
      const dateA = a.postedDate ? new Date(a.postedDate) : new Date(0);
      const dateB = b.postedDate ? new Date(b.postedDate) : new Date(0);
      return dateB - dateA;
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
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra job card
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
              bg-white 
              rounded-2xl 
              shadow-lg 
              overflow-hidden 
              border-2
              transition-all 
              duration-300
              cursor-pointer
              ${hoveredJob === job.id 
                ? 'border-blue-500 ring-4 ring-blue-100' 
                : 'border-transparent'}
            `}
          >
            {/* Job Card Content */}
            <div className="p-6 relative">
              {/* Header with Title and Badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4 items-start ">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md ">
                    <img
                      src={job.companyImage || defaultImage}
                      alt={job.companyName}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 transition">
                        {job.title || "Chưa cập nhật"}
                      </h3>
                    </div>
                    {/* Badges Container */}
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
                    <p 
  onClick={(e) => handleCompanyClick(e, job.companyId)} 
  className="text-gray-600 hover:text-blue-600 cursor-pointer hover:underline"
>
  {job.companyName}
</p>
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
              
              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-600">{job.level || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-gray-600">{job.province}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-600">{job.jobType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-600">{job.schedule}</span>
                </div>
              </div>

              {/* Footer */}
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

              {/* Hover Effect & Detail Navigation */}
              {hoveredJob === job.id && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-4 right-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <span className="text-sm font-medium">Chi tiết</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ListedJobs;