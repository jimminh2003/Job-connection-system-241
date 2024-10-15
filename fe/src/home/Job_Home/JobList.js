import React, { useState } from 'react';
import './JobList.css'; // File CSS đã được cập nhật

const JobList = () => {
  const jobs = [
    { id: 1, title: 'Frontend Developer', company: 'Company A', description: 'React, JavaScript, CSS' },
    { id: 2, title: 'Backend Developer', company: 'Company B', description: 'Node.js, Express, MongoDB' },
    { id: 3, title: 'Full Stack Developer', company: 'Company C', description: 'MERN stack' },
    { id: 4, title: 'Data Scientist', company: 'Company D', description: 'Python, Machine Learning' },
    { id: 5, title: 'Mobile Developer', company: 'Company E', description: 'React Native, Android, iOS' },
    { id: 6, title: 'DevOps Engineer', company: 'Company F', description: 'AWS, Docker, Kubernetes' },
    { id: 7, title: 'UI/UX Designer', company: 'Company G', description: 'Figma, Adobe XD' },
    { id: 8, title: 'QA Engineer', company: 'Company H', description: 'Manual Testing, Automation' },
    { id: 9, title: 'Project Manager', company: 'Company I', description: 'Agile, Scrum' },
    { id: 10, title: 'Cybersecurity Expert', company: 'Company J', description: 'Network Security, Ethical Hacking' },
    { id: 11, title: 'Cloud Architect', company: 'Company K', description: 'Azure, Google Cloud' },
    { id: 12, title: 'AI Engineer', company: 'Company L', description: 'Artificial Intelligence, Deep Learning' },
    { id: 13, title: 'Blockchain Developer', company: 'Company M', description: 'Ethereum, Solidity' },
    { id: 14, title: 'Marketing Manager', company: 'Company N', description: 'Digital Marketing, SEO' },
    { id: 15, title: 'Product Manager', company: 'Company O', description: 'Product Management, Strategy' },
  ];

  const jobsPerPage = 9; // Hiển thị 12 job mỗi trang (4 hàng, mỗi hàng 3 bài đăng)
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="job-list-container">
      <div className="job-list">
        {currentJobs.map((job) => (
          <div 
            key={job.id} 
            className="job-card" 
            onClick={() => alert(`Chuyển đến trang chi tiết của job ID: ${job.id}`)} // Chuyển đến trang chi tiết job
          >
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p className="job-description" title={job.description}>
              {job.description.length > 30 ? job.description.slice(0, 30) + '...' : job.description}
            </p>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobList;
