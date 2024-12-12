import React from 'react';
import '../css/ConfirmModal.css'
import Loading from './Loading'


const ConfirmModal = ({isLoading, isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-load-overlay">
    {isLoading ? (
      <Loading/>
    ) : (
    
      <div className="modal-load-content">
        <h1>Xác nhận chỉnh sửa</h1>
        <p>Bạn có chắc chắn muốn chỉnh sửa thông tin này?</p>
        <div className="button-load-container">
          <button className="cancel-load-btn" onClick={onCancel}>Hủy</button>
          <button className="confirm-load-btn" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    
    )
    }
    </div>
  );
};

export default ConfirmModal;
