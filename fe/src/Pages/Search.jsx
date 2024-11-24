import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search as SearchIcon, MapPin, Building, Briefcase, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '../Jsx/card';
import debounce from 'lodash/debounce';
import { motion } from "framer-motion";
import JobTrendChart from './JobChart';

const getLastSevenDaysJobs = (jobs) => {
  const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Sắp xếp jobs theo ngày đăng, mới nhất lên đầu
  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = normalizeDate(a.postedDate);
    const dateB = normalizeDate(b.postedDate);
    return dateB - dateA;
  });

  // Debug log
  console.log('Sorted jobs dates:', sortedJobs.map(job => ({
    original: job.postedDate,
    normalized: normalizeDate(job.postedDate)
  })));

  // Lấy ngày mới nhất từ dữ liệu
  const latestDate = normalizeDate(sortedJobs[0]?.postedDate || new Date());
  const dates = [];

  // Tạo mảng 7 ngày
  for (let i = 0; i < 7; i++) {
    const date = new Date(latestDate);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  dates.reverse(); // Đảo ngược để có thứ tự tăng dần

  // Debug log
  console.log('Generated dates:', dates);

  const jobsByDate = dates.map(date => {
    const count = jobs.filter(job => {
      const jobDate = normalizeDate(job.postedDate);
      return jobDate.getTime() === date.getTime();
    }).length;

    return {
      postedDate: date.toISOString(), // Lưu trữ dạng ISO để dễ debug
      date: date.toLocaleDateString('vi-VN', {
        weekday: 'short',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      }),
      count: count
    };
  });

  // Tính trend (tăng/giảm)
  const trend = jobsByDate[jobsByDate.length - 1].count - jobsByDate[0].count;

  return {
    data: jobsByDate,
    trend
  };
};
const SearchComponent = ({ jobs, searchCriteria, onSearchUpdate, currentResults }) => {
  const [searchType, setSearchType] = useState(searchCriteria.searchType);
  const [searchTerm, setSearchTerm] = useState(searchCriteria.searchTerm);
  const [location, setLocation] = useState(searchCriteria.location);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const searchRef = useRef(null);
  const locationRef = useRef(null);
  const suggestedKeywords = [
    // Công nghệ
    { text: 'IT', icon: '💻' },
    { text: 'Software', icon: '⌨️' },
    { text: 'Data Analytics', icon: '📊' },
    { text: 'AI Engineer', icon: '🤖' },
   
    
    // Kinh doanh & Tài chính
    { text: 'Kinh doanh', icon: '📈' },
    { text: 'Tài chính', icon: '💰' },
 
    { text: 'Bảo hiểm', icon: '🏦' },
    { text: 'Đầu tư', icon: '💎' },
   
    { text: 'Content Creator', icon: '✍️' },
    
    // Marketing & Truyền thông
    { text: 'Marketing', icon: '📱' },
    { text: 'Digital Marketing', icon: '🌐' },
    { text: 'Kỹ sư', icon: '⚡' },
    
    { text: 'Kế toán', icon: '📑' },
    
    { text: 'Quảng cáo', icon: '📣' },
    
    // Sản xuất & Công nghiệp
   
    { text: 'Cơ khí', icon: '🔧' },
   
    { text: 'Kiến trúc', icon: '🏛️' },
    
    // Y tế & Chăm sóc sức khỏe
    { text: 'Y tế', icon: '⚕️' },
    { text: 'Dược phẩm', icon: '💊' },
    { text: 'Điều dưỡng', icon: '🏥' },
    
    // Bán lẻ & Dịch vụ
    { text: 'Bán hàng', icon: '🛍️' },
  
    { text: 'F&B', icon: '🍽️' },
    { text: 'Du lịch', icon: '✈️' },
    { text: 'Khách sạn', icon: '🏨' },
    
    // Giáo dục & Đào tạo
  
    { text: 'Giảng viên', icon: '👨‍🏫' },
    { text: 'Tiếng Anh', icon: '🗣️' },
    { text: 'Game', icon: '🎮' },
    // Nhân sự & Hành chính
    { text: 'Nhân sự', icon: '👥' },
    { text: 'Admin', icon: '📋' },
   
    { text: 'Pháp lý', icon: '⚖️' },
    
    // Logistics & Vận tải
    { text: 'Logistics', icon: '🚛' },
    { text: 'Supply Chain', icon: '📦' },
  
    
    // Nghệ thuật & Thiết kế
  
   
    
    
    // Môi trường & Năng lượng
   
   
    { text: 'Green Tech', icon: '♻️' }
];
  const jobsAnalytics = useMemo(() => {
    return getLastSevenDaysJobs(currentResults);
  }, [currentResults]);
  // Tạo locationData từ jobs
  const locationData = useMemo(() => {
    const data = jobs.reduce((acc, job) => {
      if (job.province) {
        // Chuẩn hóa tên tỉnh/thành phố
        const normalizedProvince = job.province
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/\s+/g, ' '); // Xử lý dấu và khoảng trắng

        console.log('Original province:', job.province);
        console.log('Normalized province:', normalizedProvince);

        if (!acc[job.province]) {  // Sử dụng tên gốc để hiển thị
          acc[job.province] = {};
        }
        if (job.city) {
          const normalizedCity = job.city.trim();
          if (!acc[job.province][normalizedCity]) {
            acc[job.province][normalizedCity] = new Set();
          }
          if (job.ward) {
            acc[job.province][normalizedCity].add(job.ward.trim());
          }
        }
      }
      return acc;
    }, {});
    console.log('Final location data:', data);
    return data;
  }, [jobs]);

  // Cập nhật provinces
  useEffect(() => {
    const uniqueProvinces = Object.keys(locationData);
    setProvinces(uniqueProvinces.sort());
  }, [locationData]);
  // Cập nhật cities khi province thay đổi
  useEffect(() => {
    if (location.province && locationData[location.province]) {
      setCities(Object.keys(locationData[location.province]).sort());
    } else {
      setCities([]);
    }
  }, [location.province, locationData]);

  // Cập nhật wards khi city thay đổi
  useEffect(() => {
    if (location.province && location.city && locationData[location.province]?.[location.city]) {
      setWards([...locationData[location.province][location.city]].sort());
    } else {
      setWards([]);
    }
  }, [location.city, location.province, locationData]);

  const handleSearch = useMemo(() => 
    debounce((term) => {
      if (!term?.trim()) {
        setSuggestions([]);
        return;
      }

      const normalizedTerm = term.toLowerCase().trim();
      const searchResults = jobs.filter(job => {
        const matchFields = {
          job: [job.jobType, job.title],
          company: [job.companyName, job.industry],
          all: [job.jobType, job.title, job.companyName, job.industry]
        };

        const fieldsToSearch = matchFields[searchType] || matchFields.all;
        return fieldsToSearch.some(field => {
          if (!field) return false;
          const normalizedField = field.toLowerCase();
          
          // Kiểm tra từng từ trong chuỗi tìm kiếm
          const searchWords = normalizedTerm.split(/\s+/);
          return searchWords.every(word => {
            // Cho phép kết quả gần đúng bằng cách kiểm tra từng phần của từ
            return normalizedField.split(/\s+/).some(fieldWord => 
              fieldWord.includes(word) || word.includes(fieldWord)
            );
          });
        });
      });
  
      // Sắp xếp kết quả theo độ phù hợp
      const sortedResults = searchResults.sort((a, b) => {
        const aFields = searchType === 'job' ? [a.jobType, a.title] :
                       searchType === 'company' ? [a.companyName, a.industry] :
                       [a.jobType, a.title, a.companyName, a.industry];
        const bFields = searchType === 'job' ? [b.jobType, b.title] :
                       searchType === 'company' ? [b.companyName, b.industry] :
                       [b.jobType, b.title, b.companyName, b.industry];
        
        const aMatch = aFields.find(field => field?.toLowerCase().includes(normalizedTerm));
        const bMatch = bFields.find(field => field?.toLowerCase().includes(normalizedTerm));
        
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
  
      setSuggestions(sortedResults.slice(0, 5));
      setShowSuggestions(true);
    }, 300),
    [jobs, searchType]
  );
  //const jobsAnalytics = useMemo(() => getLastSevenDaysJobs(jobs), [jobs]);
  return (
    <div className="w-full mx-auto space-y-9 "
      
      style={{
        backgroundImage: "url('https://img6.thuthuatphanmem.vn/uploads/2022/02/09/anh-ho-chi-minh-city-dep_031026988.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '70vh',
        borderRadius: '20px'
      }}
    >
     
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-7/8 mx-auto bg-white/95 backdrop-blur-sm shadow-2xl hover:shadow-xl transition-shadow duration-300 bg-green-50">
          <CardContent className="p-8">
            {/* Search Type Selection */}
            <div className="flex gap-8 mb-8">
              {['job', 'company', 'all'].map((type) => (
                <motion.label
                  key={type}
                  className="flex items-center space-x-3 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="radio"
                    checked={searchType === type}
                    onChange={() => setSearchType(type)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className=" text-lg  text-blue-600 font-bold">
                    {type === 'job' ? 'Tìm việc làm' : 
                     type === 'company' ? 'Tìm công ty' : 'Tất cả'}
                  </span>
                </motion.label>
              ))}
            </div>

            {/* Search Inputs */}
            <div className="flex gap-6">
              {/* Job/Company Search */}
              <div className="relative flex-1">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="flex items-center bg-white border-2 border-gray-300 rounded-2xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
                >
                  <SearchIcon className="w-6 h-6 text-gray-400 ml-5" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder={
                      searchType === 'job' ? "Nhập tên việc làm..." :
                      searchType === 'company' ? "Nhập tên công ty..." :
                      "Nhập tên việc làm hoặc công ty..."
                    }
                    className="w-full px-5 py-4 text-lg focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSuggestions([]);
                      }}
                      className="px-4 hover:text-gray-700 text-gray-400"
                    >
                      ✕
                    </button>
                  )}
                </motion.div>
              
                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                  >
                    {suggestions.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        className="flex items-start gap-4 p-4 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSearchTerm(item.title || item.companyName);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {searchType !== 'company' && (
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-blue-500" />
                                <span className="text-lg">{item.title || 'Không có tiêu đề'}</span>
                              </div>
                            )}
                          </div>
                          {searchType !== 'job' && (
                            <div className="flex items-center gap-2 text-gray-600 mt-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span className="text-base">{item.companyName}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Location Search */}
              <div className="relative w-80">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center bg-white border-2 border-gray-300 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-gray-400 transition-all duration-200"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  ref={locationRef}
                >
                  <MapPin className="w-6 h-6 text-gray-400 ml-5" />
                  <div className="flex-1 px-5 py-4 text-lg">
                    {location.ward || location.city || location.province || "Chọn địa điểm"}
                  </div>
                </motion.div>

                {/* Location Dropdown */}
                {showLocationDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
                  >
                    {!location.province ? (
                      provinces.map((province, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          className="p-4 cursor-pointer text-base font-medium"
                          onClick={() => {
                            setLocation({ province, city: '', ward: '' });
                            setShowLocationDropdown(true);
                          }}
                        >
                          {province}
                        </motion.div>
                      ))
                    ) : !location.city ? (
                      <>
                        <motion.div
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          className="p-4 border-b text-blue-600 cursor-pointer font-medium"
                          onClick={() => setLocation({ ...location, province: '' })}
                        >
                          ← Quay lại
                        </motion.div>
                        {cities.map((city, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            className="p-4 cursor-pointer text-base"
                            onClick={() => {
                              setLocation({ ...location, city });
                              setShowLocationDropdown(true);
                            }}
                          >
                            {city}
                          </motion.div>
                        ))}
                      </>
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          className="p-4 border-b text-blue-600 cursor-pointer font-medium"
                          onClick={() => setLocation({ ...location, city: '' })}
                        >
                          ← Quay lại
                        </motion.div>
                        {wards.map((ward, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            className="p-4 cursor-pointer text-base"
                            onClick={() => {
                              setLocation({ ...location, ward });
                              setShowLocationDropdown(false);
                              onSearchUpdate({
                                ...searchCriteria,
                                location: { ...location, ward }
                              });
                            }}
                          >
                            {ward}
                          </motion.div>
                        ))}
                      </>
                    )}
                  </motion.div>
                )}
              </div>

             

              {/* Existing Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-blue-600 text-white text-lg font-medium rounded-2xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                onClick={() => {
                  onSearchUpdate({
                    searchType,
                    searchTerm,
                    location
                  });
                  setShowSuggestions(false);
                }}
              >
                Tìm kiếm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 bg-gray-200 text-gray-700 text-lg font-medium rounded-2xl hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setLocation({ province: '', city: '', ward: '' });
                  setSearchType('all');
                  setSuggestions([]);
                  setShowSuggestions(false);
                  setShowLocationDropdown(false);
                  onSearchUpdate({
                    searchType: 'all',
                    searchTerm: '',
                    location: { province: '', city: '', ward: '' }
                  });
                }}
              >
                Xóa tất cả
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="flex gap-6 justify-between w-full">

      <div className="w-1/3">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-3 mb-4 w-48">
    <h3 className="text-lg font-semibold">Từ khóa phổ biến</h3>
  </div>
            <div className="flex flex-wrap gap-3">
              {suggestedKeywords.map((keyword, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 flex items-center gap-2"
                  onClick={() => {
                    setSearchTerm(keyword.text);
                    onSearchUpdate({
                      searchType: 'all',
                      searchTerm: keyword.text,
                      location: searchCriteria.location
                    });
                  }}
                >
                  <span>{keyword.icon}</span>
                  <span>{keyword.text}</span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Cards */}
      <div className="w-2/3 grid grid-cols-3 gap-4  ">
        {[
          { icon: Briefcase, color: 'blue', label: 'Tổng số việc làm', value: currentResults.length },
          { icon: Calendar, color: 'green', label: 'Việc làm mới hôm nay', value: currentResults.filter(job => {
            const today = new Date().toISOString().split('T')[0];
            return job.postedDate?.split('T')[0] === today;
          }).length },
          { icon: Building, color: 'purple', label: 'Công ty đang tuyển', value: new Set(currentResults.map(job => job.companyId)).size }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{stat.label}</div>
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      <div className="w-full mx-auto flex flex-col">
          <JobTrendChart 
            data={jobsAnalytics.data} 
            trend={jobsAnalytics.trend} 
          />
     </div>
        </div>
      
    </div>
    </div>
  
  );
};

export default SearchComponent;