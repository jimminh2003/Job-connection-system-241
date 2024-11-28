import React, { useState, useEffect } from 'react';
import '../css/ApplicationForm.css';
import { Button, Flex } from 'antd';

const ApplicationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    introduction: '',
    resume: null,
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // Set a timeout to clear errors after 5 seconds (5000 ms)
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [errors]); // Only run when errors change

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted", formData);
      onClose();
    }
  };

  return (
    <div className="popup-apply-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h3>Ứng Tuyển</h3>
        <p className="required-info">
            <span className="asterisk">(*): Thông tin bắt buộc</span>
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            Tải lên CV từ máy tính, chọn hoặc kéo thả
            <input type="file" name="resume" accept="application/pdf" onChange={handleChange} />
          </label>

          <label>
            Họ Và Tên<span className="required">*</span>:
            <input type="text" name="fullName" placeholder='Họ và tên' value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </label>

          <label>
            Email<span className="required">*</span>:
            <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>

          <label>
            Số Điện Thoại<span className="required">*</span>:
            <input type="tel" name="phoneNumber" placeholder='Số điện thoại' value={formData.phoneNumber} onChange={handleChange} />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </label>

          <label>
            <p>Thư Giới Thiệu</p>
            <p className='intro'>
              Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển dụng.
            </p>
            <textarea name="introduction" placeholder='Giới thiệu ngắn gọn về bản thân, nêu rõ mong muốn, lý do bạn muốn ứng tuyển công việc này'
                  value={formData.introduction} onChange={handleChange}></textarea>
          </label>

          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Submit Application</button>
            {/* <Flex vertical gap="small" style={{ width: '100%' }}>
              <Button type="primary" block>
                Primary
              </Button>
            </Flex> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
