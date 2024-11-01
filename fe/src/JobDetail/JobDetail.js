import React from "react";
import Navbar from "../conponents/navbar/navbar";
import Footer from "../conponents/Footer/Footer";
import { useParams } from 'react-router-dom';

import './JobDetail.css';


const JobDetail = () => {
  const { id } = useParams();

  const job = {
    id,
    title: "Frontend Developer",
    company: "ABC Tech",
    location: "Ho Chi Minh City, Vietnam",
    salary: "800 - 1200 USD",
    type: "Full-time",
    description: `
      We are looking for a Frontend Developer to join our team. The ideal candidate will have a strong background in React, JavaScript, and CSS. 
      You will be responsible for building the client-side of our web applications, ensuring optimal performance and user experience.
    `,
    requirements: [
      "At least 2 years of experience in frontend development.",
      "Strong knowledge of JavaScript, React, and CSS.",
      "Experience with responsive and adaptive design.",
      "Good problem-solving skills and attention to detail."
    ],
    benefits: [
      "Competitive salary and performance-based bonuses.",
      "Flexible working hours and remote options.",
      "Health insurance and annual leave."
    ]
  };

  return (
    <div>
    <Navbar/>
    <div id="job-detail-container">
      <div className="content-container">
        
        {/* Main Content (Left Column) */}
        <div className="left-column">
          <div className="job-overview">
            <h2>Quản Trị Dự Án - PM</h2>
            <div className="job-info">
              <div className="info-item">Mức lương: 20 - 27 triệu</div>
              <div className="info-item">Địa điểm: Hà Nội</div>
              <div className="info-item">Kinh nghiệm: 5 năm</div>
            </div>
            <div className="button">
              <button className="apply-btn">Ứng tuyển ngay</button>
              <button className="save-btn">Lưu tin</button>
            </div>
          </div>

          <div className="job-details">
            <h3>Chi tiết tin tuyển dụng</h3>
            <div className="job-description">
              <h4>Mô tả công việc</h4>
              <p>- Tiếp cận khách hàng để nắm bắt yêu cầu từ khách hàng từ giai đoạn đầu chưa hợp đồng. Từ đó phân tích, đánh giá nhu cầu/mong muốn và tư vấn xây dựng giải pháp thực hiện tới khách hàng.</p>
              <p>- Chủ trì tổ chức triển khai dự án.</p>
              <p>- Kiểm soát đảm bảo tiến độ và chất lượng thực hiện dự án theo kế hoạch</p>
              <p>- Kiểm soát thay đổi yêu cầu</p>
              <p>- Tổ chức thực hiện công tác nghiệm thu, triển khai đưa sản phẩm vào sử dụng.</p>
              <p>- Lập báo cáo về tình hình thực dự án theo quy định của công ty</p>
              <p>- Thực hiện nhiệm vụ theo yêu cầu của trưởng bộ phận</p>
            </div>
            <div className="job-requirements">
              <h4>Yêu cầu ứng viên</h4>
              <p>- Tốt nghiệp đại học trở lên về CNTT, điện tử viễn thông, hệ thống thông tin và các ngành có liên quan</p>
              <p>- Có kiến thức tốt về CNTT và hiểu được thiết kế kỹ thuật phân tích, thiết kế hệ thống CNTT</p>
              <p>- Kinh nghiệm từ 2 năm trở lên ở các vị trí tương đương</p>
              <p> - Có kỹ năng làm việc độc lập và đội nhóm tốt</p>
              <p>- Tinh thần hợp tác và làm việc tốt</p>
              <p>- Có khả năng chịu áp lực công việc tốt</p>
              <p>- Có Tinh thần học hỏi và cầu tiến trong công việc</p>
              <p>- Ứng viên có chứng chỉ quản lý dự án là lợi thế</p>
              <p>- Kỹ năng giao tiếp tốt, làm việc với khách hàng hiệu quả</p>
              <p>- Có khả năng thuyết trình, không nói ngọng khó nghe.</p>
              <p>- Khả năng phân tích, tư duy logic tốt.</p>
              <p>- Có kiến thức và kinh nghiệm phát triển phần mềm theo mô hình waterfall, Agile</p>
              <p>- Sử dụng thành thạo các công cụ hỗ trợ phân tích như: UML, Microsoft Visio, ...</p>
              <p>- Kỹ năng trình bày, giải quyết vấn đề và làm việc nhóm.</p>
              <p>- Kỹ năng xử lý tình huống linh hoạt, khả năng làm việc độc lập, chủ động</p>
            </div>
            <div className="job-benefits">
              <h4>Quyền lợi</h4>
              <p>- Lương: Thỏa thuận theo năng lực</p>
              <p>- Thưởng tháng 13 + Thưởng thi đua quý/năm + Thưởng KPI (2-3 tháng)</p>
              <p>- Môi trường làm việc năng động, thân thiện, chuyên nghiệp với nhiều cơ hội phát triển</p>
              <p>- Được tham gia các khóa đào tạo nội bộ và bên ngoài để nâng cao kiến thức, kỹ năng mềm và trình độ chuyên môn.</p>
              <p>- Phúc lợi: Teambuilding, nghỉ mát, sinh nhật, thưởng lễ/tết,...</p>
              <p>- Các chế độ bảo hiểm, nghỉ phép,... theo Luật lao động</p>
              <p>- Thời gian làm việc: 8h00 - 12h00, 13h00 - 17h00</p>

            </div>
            <div className="job-location">
              <h4>Địa điểm làm việc</h4>
              <p>- Hà Nội: 107a, Nguyễn Phong Sắc, Cầu Giấy, Hà Nội, Cầu Giấy</p>
            </div>
            <div className="job-time">
              <h4>Thời gian làm việc</h4>
              <p>- Thứ 2 - Thứ 6 (từ 08:00 đến 17:00)</p>
            </div>
            <div className="job-way">
              <h4>Cách thức ứng tuyển</h4>
              <p>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm Ứng tuyển ngay dưới đây.</p>
            </div>
            <p>Hạn nộp hồ sơ: 30/11/2024</p>


          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="company-info">
            <h3>Thông tin công ty</h3>
            <p>Công Ty Cổ Phần Đầu Tư Thương Mại Và Phát Triển Công Nghệ FSI</p>
            <p>Quy mô: 100-499 nhân viên</p>
            <p>Lĩnh vực: IT - Phần mềm</p>
            <p>Địa điểm: Tầng 5A, Tòa Lâm Viên, Số 107A Nguyễn Phong Sắc, Dịch Vọng Hậu, Cầu Giấy, Hà Nội</p>
          </div>

          <div className="general-info">
            <h3>Thông tin chung</h3>
            <p>Cấp bậc: Nhân viên</p>
            <p>Kinh nghiệm: 5 năm</p>
          </div>

          <div className="specialty-tags">
            <h4>Vị trí chuyên môn</h4>
            <span className="tag">Công nghệ Thông tin</span>
            <span className="tag">Product Management</span>
            <h4>Khu vực</h4>
            <span className="tag">Hà Nội</span>
          </div>

          <div className="recommended-jobs">
            <h3>Gợi ý việc làm phù hợp</h3>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
  );
};

export default JobDetail;