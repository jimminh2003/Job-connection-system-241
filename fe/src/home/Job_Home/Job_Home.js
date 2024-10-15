import React, { useState, useEffect } from 'react';
import './Job_Home.css';
import JobList from './JobList.js';



function Job_Home() {  
    const [selectedFilter, setSelectedFilter] = useState('nganh-nghe');
    const [currentValues, setCurrentValues] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const allValues = {
        'nganh-nghe': ['Kinh doanh', 'Phiên dịch', 'Báo chí', 'Viễn thông', 'Game', 'IT'],
        'muc-luong': ['Tất cả', 'Dưới 10 triệu', '10-20 triệu', '20-30 triệu', 'Trên 30 triệu'],
        'dia-diem': ['Tất cả', 'Hà Nội', 'TP Hồ Chí Minh', 'Miền Bắc', 'Miền Nam']
    };

    const valuesPerPage = 5;

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
        
      return (
        <div>
        <div className="jobhome-container" id='job-portial'>
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
          <div className="job-list-section">
            <JobList />
          </div>
        </div>
        
        </div>
      );
}

export default Job_Home;