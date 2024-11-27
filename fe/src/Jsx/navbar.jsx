import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const MainNavbar = () => {
  const { isAuthenticated, user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLoginClick = () => {
    navigate('/login');
  };

  const onRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="headernav">
      <div className="nav">
        <div className="nav__logo">
          <a className="navbar-brand-custom" href="/">
            <img 
              src="https://images.vexels.com/media/users/3/245747/isolated/preview/fc5e5179e126bb8b8878c65ed0639179-great-job-badge.png"
              width="40"
              height="40"
              alt="logo"
            />
          </a>
        </div>

        <div className="nav__menu">
          <div className="menu-home menu-effect">
            <a href="/">Trang chủ</a>
          </div>
          <div className="menu-job menu-effect auth-only">
            <a href="/alljob">
              Việc Làm
              <i className="fa-solid fa-angle-down"></i>
            </a>
            <ul className="subnav">
              <li><Link to="/alljob">Toàn Bộ Việc Làm</Link></li>
              <li><a href="./">Việc Làm IT</a></li>
              <li><a href="./">Việc Làm Hot</a></li>
            </ul>
            <div className="underline"></div>
          </div>
          <div className="menu-company menu-effect student-only">
            <a href="/allcompany">
              Công Ty
              <i className="fa-solid fa-angle-down"></i>
            </a>
            <ul className="subnav">
              <li><Link to="/allcompany">Toàn Bộ Công Ty</Link></li>
              <li><a href="./">Công Ty Hàng Đầu</a></li>
              <li><a href="./">Công Ty IT</a></li>
            </ul>
            <div className="underline"></div>
          </div>
          <div className="menu-courses menu-effect student-only">
            <a href="./">
              Công Cụ
              <i className="fa-solid fa-angle-down"></i>
            </a>
            <ul className="subnav">
              <li><a href="./">Danh sách khóa học</a></li>
              <li><a href="./">Đăng kí mới</a></li>
            </ul>
            <div className="underline"></div>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="nav__icons">
            <div className="nav__notification">
              <img
                src='https://png.pngtree.com/png-clipart/20200224/original/pngtree-bell-alarm-line-icon-vector-png-image_5247801.jpg'
                className='bell-notifi'
                alt="notifications"
              />
            </div>

            <div className="nav__avatar">
              <img 
                src={user?.avatar || "https://meatworld.info/wp-content/uploads/avatar-trang-16.jpg"}
                alt={user?.name || "User Avatar"}
                className="avatar-icon"
              />
              <ul className="dropdown-menu">
                <div className='infor-application'>
                  <h4>{user?.name || "User"}</h4>
                  <p>{user?.email || "email@example.com"}</p>
                </div>
                <li>
                  <i className="fa-solid fa-user-cog"></i>
                  <Link to="/ApplicantProfile">Cài đặt thông tin cá nhân</Link>
                </li>
                <li>
                  <i className="fa-solid fa-crown"></i>
                  <a href="/upgrade">Nâng cấp tài khoản VIP</a>
                </li>
                <li>
                  <i className="fa-solid fa-bell"></i>
                  <a href="/notifications">Thông Báo</a>
                </li>
                <li>
                  <i className="fa-solid fa-key"></i>
                  <a href="/change-password">Đổi mật khẩu</a>
                </li>
                <li className="logout">
                  <i className="fa-solid fa-sign-out-alt"></i>
                  <a href="#" onClick={handleLogout}>Đăng xuất</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="navbar-auth-custom">
            <button onClick={onLoginClick} className="btn-login">Đăng nhập</button>
            <button onClick={onRegisterClick} className="btn-register">Đăng ký</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavbar;