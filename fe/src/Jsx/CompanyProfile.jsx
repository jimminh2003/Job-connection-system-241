import React, { useState } from 'react';
import '../css/CompanyProfile.css';
import Navbar from './navbar';
import Footer from './Footer';
import CompanyInfo from './CompanyInfo';
import CompanyJobManagement from './CompanyJobManager';
import Notifications from './Notifications';
import CompanyPostJob from './CompanyPostJob';
import ChangePassword from './ChangePassword';

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('Thông tin công ty');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    // Xóa thông tin xác thực, token hoặc state
    localStorage.removeItem('token'); // Xóa token lưu trong localStorage (nếu có)
    alert('Bạn đã đăng xuất!');
    // Điều hướng về trang đăng nhập
    window.location.href = '/login'; // Điều hướng về trang đăng nhập
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Thông tin công ty':
        return <CompanyInfo />;
      case 'Quản lý việc làm':
        return <CompanyJobManagement />;
      case 'Thông báo':
        return <Notifications />;
      case 'Đăng tuyển việc làm':
        return <CompanyPostJob />;
      case 'Đổi mật khẩu':
        return <ChangePassword />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div id="company-profile-container">
        {/* Sidebar */}
        <div className="sidebar">
          <ul>
            {['Thông tin công ty', 'Quản lý việc làm', 'Thông báo', 'Đăng tuyển việc làm', 'Đổi mật khẩu'].map((item) => (
              <li
                key={item}
                className={activeTab === item ? 'active' : ''}
                onClick={() => handleTabClick(item)}
              >
                {item}
              </li>
            ))}
            <li onClick={handleLogout} className="logout">Đăng xuất</li>
          </ul>
        </div>
        {/* Main Content */}
        <div className="content">{renderContent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyProfile;
