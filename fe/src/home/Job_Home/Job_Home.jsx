import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Job_Home.css';
import './JobList.css';

function Job_Home() {
    const [selectedFilter, setSelectedFilter] = useState('nganh-nghe');
    const [currentValues, setCurrentValues] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [jobPage, setJobPage] = useState(1);

    const allValues = {
        'nganh-nghe': ['Kinh doanh', 'Phiên dịch', 'Báo chí', 'Viễn thông', 'Game', 'IT'],
        'muc-luong': ['Tất cả', 'Dưới 10 triệu', '10-20 triệu', '20-30 triệu', 'Trên 30 triệu'],
        'dia-diem': ['Tất cả', 'Hà Nội', 'TP Hồ Chí Minh', 'Miền Bắc', 'Miền Nam']
    };

    const jobs = [
        { id: 1, title: 'Quản lý dự án - PM', company: 'Công Ty Cổ Phần Đầu Tư Thương Mại Và Phát Triển Công Nghệ FSI', description: '20 - 27 triệu' },
        { id: 2, title: 'Backend Developer', company: 'Company B', description: 'Thỏa thuận' },
        { id: 3, title: 'Full Stack Developer', company: 'Company C', description: 'Thỏa thuận' },
        { id: 4, title: 'Data Scientist', company: 'Company D', description: 'Thỏa thuận' },
        { id: 5, title: 'Mobile Developer', company: 'Company E', description: 'Thỏa thuận' },
        { id: 6, title: 'DevOps Engineer', company: 'Company F', description: 'Thỏa thuận' },
        { id: 7, title: 'UI/UX Designer', company: 'Company G', description: 'Thỏa thuận' },
        { id: 8, title: 'QA Engineer', company: 'Company H', description: 'Thỏa thuận' },
        { id: 9, title: 'Project Manager', company: 'Company I', description: 'Thỏa thuận' },
        { id: 10, title: 'Cybersecurity Expert', company: 'Company J', description: 'Thỏa thuận' },
        { id: 11, title: 'Cloud Architect', company: 'Company K', description: 'Thỏa thuận' },
        { id: 12, title: 'AI Engineer', company: 'Company L', description: 'Thỏa thuận' },
        { id: 13, title: 'Blockchain Developer', company: 'Company M', description: 'Thỏa thuận' },
        { id: 14, title: 'Marketing Manager', company: 'Company N', description: 'Thỏa thuận' },
        { id: 15, title: 'Product Manager', company: 'Company O', description: 'Thỏa thuận' },
    ];

    const valuesPerPage = 4;
    const jobsPerPage = 9;

    const navigate = useNavigate();

    const handleJobDetail = (jobId) => {
      navigate(`/JobDetail/${jobId}`);
    };
    

    const handleFilterChange = (event) => {
        const selected = event.target.value;
        setSelectedFilter(selected);
        setCurrentPage(0); // Khi thay đổi filter, chuyển về trang đầu tiên
    };

    const handlePreviousClick = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        const maxPage = Math.ceil(allValues[selectedFilter].length / valuesPerPage) - 1;
        if (currentPage < maxPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        const startIndex = currentPage * valuesPerPage;
        const endIndex = startIndex + valuesPerPage;
        setCurrentValues(allValues[selectedFilter].slice(startIndex, endIndex));
    }, [selectedFilter, currentPage]);

    const indexOfLastJob = jobPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    const paginate = (pageNumber) => setJobPage(pageNumber);

    return (
        <div>
            <div id="jobhome-container">
                {/* Hàng đầu tiên - Việc làm tốt nhất và nút Xem tất cả */}
                <div className="header">
                    <h1>Việc làm tốt nhất</h1>
                    <button className="view-all-btn" onClick={() => alert('Chuyển sang trang khác')}>Xem tất cả</button>
                </div>

                {/* Bộ lọc */}
                <div className="filter-container">
                    <div className="filter-left">
                        <label>Lọc theo:</label>
                        <select onChange={handleFilterChange}>
                            <option value="nganh-nghe">Ngành nghề</option>
                            <option value="muc-luong">Mức lương</option>
                            <option value="dia-diem">Địa điểm</option>
                        </select>
                    </div>

                    <div className="filter-right">
                        <button className="arrow-btn" onClick={handlePreviousClick}>{"<"}</button>
                        <div className="filter-values">
                            {currentValues.map((value, index) => (
                                <span key={index} className="filter-value">{value}</span>
                            ))}
                        </div>
                        <button className="arrow-btn" onClick={handleNextClick}>{">"}</button>
                    </div>
                </div>

                {/* Hàng thứ ba - Danh sách các job */}
                <div className="job-list-container">
                    <div className="job-list">
                        {currentJobs.map((job) => (
                            <div
                                key={job.id}
                                className="job-card"
                                onClick={() => handleJobDetail(job.id)}
                            >
                                <h3>{job.title}</h3>
                                <p><strong>Company:</strong> {job.company}</p>
                                <p className="job-description" title={job.description}>
                                    <strong>Lương: </strong>
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
                                className={jobPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Job_Home;
