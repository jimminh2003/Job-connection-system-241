import React, { useMemo } from 'react';
import { FaBriefcase, FaChartLine, FaRegClock } from 'react-icons/fa';

const StatsCard = ({ icon, title, value, className }) => (
  <div className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="p-3 bg-blue-100 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-sm text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const JobMarketStats = ({ jobs }) => {
    const stats = useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      return {
        // Đếm việc làm đang mở dựa vào status = true
        totalOpenJobs: jobs.filter(job => job.status === true).length,
        
        // Đếm việc làm mới trong ngày dựa vào postedDate
        newTodayJobs: jobs.filter(job => {
          if (!job.postedDate) return false;
          const jobDate = new Date(job.postedDate);
          jobDate.setHours(0, 0, 0, 0);
          return jobDate.getTime() === today.getTime();
        }).length,
        
        // Đếm số công ty unique dựa vào companyId
        activeCompanies: new Set(jobs.map(job => job.companyId)).size,
        
        // Thêm thống kê theo level nếu muốn
        seniorJobs: jobs.filter(job => job.level === 'Senior').length,
        
        // Thêm thống kê theo schedule
        fullTimeJobs: jobs.filter(job => job.schedule === 'Full-time').length
      };
    }, [jobs]);
  
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Thống kê thị trường việc làm</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={<FaBriefcase className="text-blue-600 text-xl" />}
            title="Việc làm đang mở"
            value={stats.totalOpenJobs}
          />
          <StatsCard
            icon={<FaRegClock className="text-green-600 text-xl" />}
            title="Việc làm Full-time"
            value={stats.fullTimeJobs}
          />
          <StatsCard
            icon={<FaChartLine className="text-purple-600 text-xl" />}
            title="Công ty đang tuyển"
            value={stats.activeCompanies}
          />
        </div>
      </div>
    );
  };
  
  export default JobMarketStats;