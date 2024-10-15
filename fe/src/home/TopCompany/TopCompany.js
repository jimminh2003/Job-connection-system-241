import React, { useState } from 'react';
import './TopCompany.css';



function TopCompany() {
    const newsList = [
        { title: 'Tin tức 1', description: 'Nội dung chi tiết của tin tức 1...', url: '/news-1' },
        { title: 'Tin tức 2', description: 'Nội dung chi tiết của tin tức 2...', url: '/news-2' },
        { title: 'Tin tức 3', description: 'Nội dung chi tiết của tin tức 3...', url: '/news-3' },
        { title: 'Tin tức 4', description: 'Nội dung chi tiết của tin tức 4...', url: '/news-4' },
        { title: 'Tin tức 5', description: 'Nội dung chi tiết của tin tức 5...', url: '/news-5' },
      ];
      const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    const handleNext = () => {
        setCurrentNewsIndex((prevIndex) =>
        prevIndex === newsList.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevious = () => {
        setCurrentNewsIndex((prevIndex) =>
        prevIndex === 0 ? newsList.length - 1 : prevIndex - 1
        );
    };

    const handleNewsClick = (url) => {
        window.location.href = url; // Điều hướng đến trang tin tức tương ứng
    };
    const companies = [
        { name: 'Công ty A', logo: 'https://via.placeholder.com/100', url: '/company-a' },
        { name: 'Công ty B', logo: 'https://via.placeholder.com/100', url: '/company-b' },
        { name: 'Công ty C', logo: 'https://via.placeholder.com/100', url: '/company-c' },
        { name: 'Công ty D', logo: 'https://via.placeholder.com/100', url: '/company-d' },
        { name: 'Công ty E', logo: 'https://via.placeholder.com/100', url: '/company-e' },
        { name: 'Công ty F', logo: 'https://via.placeholder.com/100', url: '/company-f' }
      ];
      const handleCompanyClick = (url) => {
        // Điều hướng đến trang giới thiệu công ty
        window.location.href = url;
      };
    return (
        <div className="home-container">
            <div className="news-carousel-container">
            <button className="carousel-control left" onClick={handlePrevious}>
                {"<"}
            </button>

            <div
                className="news-card"
                onClick={() => handleNewsClick(newsList[currentNewsIndex].url)}
            >
                <h2>{newsList[currentNewsIndex].title}</h2>
                <p>{newsList[currentNewsIndex].description}</p>
            </div>

            <button className="carousel-control right" onClick={handleNext}>
                {">"}
            </button>
            </div>


            
            <div>
                <h2 className="section-title">Các Công Ty Hàng Đầu</h2>
                <div className="topcompany-list">
                    {companies.map((company, index) => (
                    <div
                        key={index}
                        className="topcompany-card"
                        onClick={() => handleCompanyClick(company.url)}
                    >
                        <img src={company.logo} alt={company.name} className="topcompany-logo" />
                        <p className="topcompany-name">{company.name}</p>
                    </div>
                    ))}
                </div>
             </div>
        </div>
    );
}

export default TopCompany;