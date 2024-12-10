import React, { useState, useEffect } from 'react';
import '../css/Notifications.css';
import TokenManager from '../utils/tokenManager';
import LoadInfo from './LoadingInfo';
import { FaSpinner } from 'react-icons/fa'; // Thêm spinner icon từ react-icons

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // Trạng thái đang xóa
  const token = TokenManager.getToken();
  const userId = token?.id; // Lấy userId từ token

  useEffect(() => {
    if (userId) {
      // Gọi API để lấy dữ liệu thông báo
      fetch(`/notifications/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          // Sắp xếp thông báo theo id giảm dần
          const sortedData = data.sort((a, b) => b.id - a.id);
          setNotifications(sortedData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching notifications:', error);
          setIsLoading(false);
        });
    }
  }, [userId]);

  const handleDelete = (id) => {
    setIsDeleting(true); // Đặt trạng thái đang xóa
    // Gọi API DELETE để xóa thông báo
    fetch(`/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete notification');
        }
        // Nếu xóa thành công, cập nhật lại state
        setNotifications(notifications.filter(notification => notification.id !== id));
        alert("Đã xóa thông báo thành công");
      })
      .catch(error => {
        console.error('Error deleting notification:', error);
        // Có thể hiển thị thông báo lỗi cho người dùng
      })
      .finally(() => {
        setIsDeleting(false); // Đặt lại trạng thái không còn xóa nữa
      });
  };

  if (isLoading) {
    return <LoadInfo text="Đang tải thông báo" />;
  }

  return (
    <div className="notifications">
      <h2>Thông báo</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification.id} className="notification-item">
              <div className="notification-content">
                <p>{notification.content}</p>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(notification.id)}
                disabled={isDeleting} // Disable button khi đang xóa
              >
                {isDeleting ? <FaSpinner className="spinner" /> : 'Xóa'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
