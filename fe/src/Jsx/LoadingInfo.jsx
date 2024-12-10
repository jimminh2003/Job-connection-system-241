import React, { useState, useEffect } from 'react';
import Loadinfo from '../images/Evitare loader.gif'; // Đảm bảo đường dẫn đúng tới ảnh GIF

const LoadInfo = ({ text }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prevVisible) => !prevVisible);
    }, 1000); // Điều chỉnh thời gian mờ và đậm lại (1000ms)

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, []);

  return (
    <div style={styles.container}>
      <img src={Loadinfo} alt="Loading..." style={styles.gif} />
      <div
        style={{
          ...styles.text,
          opacity: visible ? 1 : 0.2, // Sử dụng opacity thay vì visibility
          transform: visible ? 'scale(1)' : 'scale(1.2)', // Tạo hiệu ứng phóng to và thu nhỏ
          transition: 'opacity 1s ease, transform 1s ease', // Thêm hiệu ứng chuyển đổi mượt mà cho opacity và scale
        }}
      >
        {text}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
  },
  gif: {
    width: '500px', // Kích thước GIF
    height: '500px', // Kích thước GIF
  },
  text: {
    marginTop: '-10px', // Khoảng cách giữa ảnh và văn bản
    fontSize: '18px', // Kích thước chữ
    color: '#5a5a5a', // Màu chữ có thể thay đổi theo yêu cầu
    zindex: '10',
  },
};

export default LoadInfo;
