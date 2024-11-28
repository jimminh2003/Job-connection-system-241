import React, {useState, useEffect} from "react";
import axios from 'axios';
import '../css/AppNavBar.css';
// import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from "../Contexts/AuthContext";
import TokenManager from "../utils/tokenManager";

function AppNavbar() {
    const [userInfo, setUserInfo] = useState(null);
    const { handleLogout, isAuthenticated } = useAuth();
    useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const token = TokenManager.getToken();
            if (!token) return;
            const role = token.role.toLowerCase();
            const userId = token.id; // Lấy userId từ token
            

            let apiUrl = "";

            // Chọn API dựa trên role
            switch (role) {
                case "applicant":
                    apiUrl = `/applicants/${userId}`;
                    break;
                case "company":
                    apiUrl = `/companies/${userId}`;
                    break;
                case "admin":
                    apiUrl = `/admin/${userId}`;
                    break;
                case "user":
                    apiUrl = `/users/${userId}`;
                    break;
                default:
                    throw new Error("Invalid role");
            }

            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            });

            setUserInfo(response.data);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    fetchUserInfo();
}, []);

const onLogoutClick = () => {
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (confirmLogout) {
        handleLogout();
    }
};

    return (
        <div className="headernav">
        <div className="nav">
        <div className='nav__logo'>
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

            <div className="nav__icons">
                <div className="nav__notification">
                    {/* <i className="fa-solid fa-bell"></i> */}
                    <img
                        src='https://png.pngtree.com/png-clipart/20200224/original/pngtree-bell-alarm-line-icon-vector-png-image_5247801.jpg'
                        className='bell-notifi'
                    />
                </div>

                <div className="nav__avatar">
                    <img 
                        src="https://meatworld.info/wp-content/uploads/avatar-trang-16.jpg" 
                        alt="Học Đăng"
                        className="avatar-icon"
                    />
                    {/* <i className="fa-solid fa-angle-down">v</i> */}
                    <ul className="dropdown-menu">
                    <div className='infor-application'>
            {userInfo?.role === 'applicant' ? (
                <>
                    <h4>{`${userInfo?.firstName} ${userInfo?.lastName}`}</h4>
                    <p>{userInfo?.email}</p>
                </>
            ) : userInfo?.role === 'company' ? (
                <>
                    <h4>{userInfo?.name}</h4>
                    <p>{userInfo?.email}</p>
                </>
            ) : (
                <>
                    <h4>Người dùng</h4>
                    <p>{userInfo?.email}</p>
                </>
            )}
        </div>
        <li>
    <i className="fa-solid fa-user-cog"></i>
    {userInfo?.role === 'applicant' ? (
        <Link to={`/ApplicantProfile/${userInfo.id}`}>Cài đặt thông tin cá nhân</Link>
    ) : userInfo?.role === 'company' ? (
        <Link to={`/CompanyProfile/${userInfo.id}`}>Cài đặt thông tin công ty</Link>
    ) : (
        <Link to="/profile">Cài đặt thông tin cá nhân</Link>
    )}
</li>
                    <li className="logout">
                                        <i className="fa-solid fa-sign-out-alt"></i>
                                        <button onClick={onLogoutClick}>Đăng xuất</button>
                                    </li>
                    <li>
                        <i className="fa-solid fa-crown"></i>
                        <a href="/upgrade">Nâng cấp tài khoản VIP</a>
                    </li>

                    <li>
                        <i className="fa-solid fa-bell"></i>
                        <a href="/notifications">Thông Báo</a>
                    </li>
                    </ul>
                    </div>
                    {isAuthenticated ? (
                    <>
                        {/* Nội dung cho người dùng đã đăng nhập */}
                    </>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="login-btn">Đăng nhập</Link>
                        <Link to="/register" className="register-btn">Đăng ký</Link>
                    </div>
                )}
            </div>
                    
                    
        </div>
    </div>
      );
}

export default AppNavbar;