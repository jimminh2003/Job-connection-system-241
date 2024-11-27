import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Không có quyền truy cập
        </h1>
        <p className="text-gray-600 mb-4">
          Bạn không có quyền truy cập vào trang này
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;