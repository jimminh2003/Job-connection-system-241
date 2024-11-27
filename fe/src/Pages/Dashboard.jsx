import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import userService from '../services/user/userService';
const EditUserModal = ({ isOpen, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    status: user.status
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa người dùng</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(user.id, formData);
          onClose();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* Thêm các trường khác tương tự */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'applicant',
    phone: '',
    status: 'active'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm người dùng mới</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
          onClose();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* Thêm các trường khác tương tự */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Thêm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const data = await userService.getUsers();
        setUsers(data);
    } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error.message);
        // Có thể thêm thông báo lỗi cho người dùng ở đây
        setUsers([]); // Set mảng rỗng khi có lỗi
    }
};
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search
  const formatDate =(dataString) =>{
    return new Date(formatDate).toLocaleDateString('vi-VN');
  }
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaUserPlus /> Thêm người dùng
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
          <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thông tin cơ bản</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thông tin liên hệ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kỹ năng & Chứng chỉ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
              <tr key={user.id}>
                {/* Thông tin cơ bản */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-500">Username: {user.username}</div>
                      <div className="text-sm text-gray-500">Ngày sinh: {formatDate(user.dob)}</div>
                      <div className="text-sm text-gray-500">Cấp bậc: {user.applicantJobtypeEntities[0]?.level}</div>
                      {user.resume && (
                        <div className="text-sm text-blue-600">
                          <a href={user.resume} target="_blank" rel="noopener noreferrer">Xem CV</a>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Thông tin liên hệ */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Email:</span>
                      {user.emails.map(email => (
                        <div key={email.id}>{email.email}</div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Số điện thoại:</span>
                      {user.phoneNumbers.map(phone => (
                        <div key={phone.id}>{phone.phoneNumber}</div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Địa chỉ:</span>
                      <div>{user.address}</div>
                    </div>
                  </div>
                </td>
                  {/* Kỹ năng & Chứng chỉ */}
                  <td className="px-6 py-4">
                  <div>
                    <div className="font-medium mb-2">Kỹ năng:</div>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.map(skill => (
                        <span
                          key={skill.id}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="font-medium mb-2">Chứng chỉ:</div>
                    {user.certifications.map(cert => (
                      <div key={cert.id} className="mb-2">
                        <div className="text-sm font-medium">{cert.name}</div>
                        <div className="text-xs text-gray-500">
                          Cấp độ: {cert.level}
                          <br />
                          Hiệu lực: {formatDate(cert.startDate)} - {formatDate(cert.endDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                 {/* Trạng thái */}
                 <td className="px-6 py-4">
                  <div className="space-y-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                    <br />
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.isBanned ? 'Đã bị cấm' : 'Bình thường'}
                    </span>
                    <br />
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {user.isAvailable ? 'Đang sẵn sàng' : 'Đang bận'}
                    </span>
                    <br />
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.isPublic ? 'Công khai' : 'Riêng tư'}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => userService.deleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Add User Modal */}
      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={userService.addUser}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSubmit={userService.updateUser}
        />
      )}
    </div>
  );
};

  export default AdminDashboard;