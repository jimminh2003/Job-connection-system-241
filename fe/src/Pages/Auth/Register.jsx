import { Outlet, useNavigate } from "react-router-dom";

const NavigationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center"
    style={{
      backgroundImage: 'linear-gradient(45deg, var(--thirdColor), var(--themeColor))',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
    }}
  >
      <h1 className="text-center text-4xl font-bold mb-8">Chọn loại tài khoản để đăng ký</h1>

      {/* Nút điều hướng */}
      <div className="flex gap-6 mb-8">
        <button
          onClick={() => navigate("/register-applicant")}
          className="px-6 py-3 bg-white text-blue-500 font-medium rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Đăng ký Ứng viên
        </button>
        <button
          onClick={() => navigate("/register-company")}
          className="px-6 py-3 bg-white text-pink-500 font-medium rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Đăng ký Công ty
        </button>
      </div>

      {/* Nơi hiển thị các route con
      <div className="w-full">
        <Outlet />
      </div> */}
    </div>
  );
};

export default NavigationPage;
