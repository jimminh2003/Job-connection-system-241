import { useState, useEffect, useCallback, useMemo } from 'react';
import "./Search.css";

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import './Spinner.css'; 


import JobList from './JobList';

import TokenManager from '../utils/tokenManager';
import AppNavbar from '../Jsx/AppNavbar';
import CompanyNavbar from '../Jsx/CompanyNavbar';
import Navbar from '../Jsx/navbar';
import Footer from '../Jsx/Footer';
import { set } from 'react-hook-form';

const AllJob = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Location States
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  
  
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [sortByTime, setSortByTime] = useState('desc');
 
  const [searchTitle, setSearchTitle] = useState('');
  const [schedule, setSchedule] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [yoe, setYoe] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [allowance, setAllowance] = useState('');
  const [minOfApplicants, setMinOfApplicants] = useState('');
  // Skills State
  const [jobTypeSkills, setJobTypeSkills] = useState([]); 
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  // Pagination
  const [localPage, setLocalPage] = useState(() => {
    const pageFromUrl = searchParams.get('page');
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    maxPageItems: 9,
    totalPages: 0,
    totalItems: 0
  });

  const token = TokenManager.getToken();
  const role = token?.role;
  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/jobtypes');
        setJobTypes(response.data);
      } catch (error) {
        console.error('Error fetching job types:', error);
      }
    };
    fetchJobTypes();
  }, []);
  useEffect(() => {
    if (selectedJobType) {
      const selectedType = jobTypes.find(type => type.name === selectedJobType);
      if (selectedType && selectedType.skills) {
        setJobTypeSkills(selectedType.skills);
      }
    } else {
      // Nếu không có job type được chọn, hiển thị tất cả các kỹ năng
      setJobTypeSkills(skills);
    }
  }, [selectedJobType, jobTypes, skills]);
  useEffect(() => {
    fetch("http://localhost:8080/public/locations")
      .then((response) => response.json())
      .then((data) => setLocations(data));
  }, []);

  // Fetch Skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token?.value && { Authorization: `Bearer ${token.value}` })
        };
  
        const response = await axios.get('http://localhost:8080/public/skills', {
          headers,
          withCredentials: true
        });
  
        setSkills(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills([]);
      }
    };
  
    fetchSkills();
  }, []);

  useEffect(() => {
    const province = locations.find((prov) => prov.name === selectedProvince);
    setCities(province ? province.cities : []);
    if (!province) {
      setSelectedCity("");
      setWards([]);
    }
  }, [selectedProvince, locations]);

  useEffect(() => {
    const city = cities.find((city) => city.name === selectedCity);
    setWards(city ? city.wards : []);
    if (!city) {
      setSelectedWard("");
    }
  }, [selectedCity, cities]);

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {       
        const params = { 
          page: localPage,
          limit: 9 
        };      
        const hasActiveFilters = ['title', 'schedule', 'level', 'yoe', 'salary', 'allowance','sortByTime','minOfApplicants',
          'companyName', 'province', 'city', 'ward', 'skills'].some(filter => {
           const value = searchParams.get(filter);
           return value?.trim();
         });
         
         ['title', 'schedule', 'level', 'yoe', 'salary', 'allowance','sortByTime',
          'companyName', 'province', 'city', 'ward', 'skills'].forEach(filter => {
           const value = searchParams.get(filter);
           if (value?.trim()) {
             params[filter] = filter === 'skills' 
             ? value.split(',').map(skill => decodeURIComponent(skill.trim())).join(',')
             : value.trim();
           }
         });

         const queryString = new URLSearchParams(params).toString();
         const response = await axios({
           method: 'GET',
           url: hasActiveFilters 
             ? `http://localhost:8080/public/jobpostings?${queryString}`
             : `http://localhost:8080/public/jobpostings?page=${localPage}&limit=9`,
           headers: {
             'Content-Type': 'application/json',
             ...(token?.value && { Authorization: `Bearer ${token.value}` })
           },
           withCredentials: true
         });
          
        if (response.data && response.data.listResult) {
          setJobs(response.data.listResult);
            
          const newTotalPages = response.data.totalPage || 0;
          const newTotalItems = response.data.totalItem || 0;
          const actualCurrentPage = response.data.currentPage || localPage;

          setPagination({
            currentPage: actualCurrentPage,  
            maxPageItems: response.data.limit || 9,
            totalPages: newTotalPages,
            totalItems: newTotalItems
          });

          if (actualCurrentPage !== localPage) {
            setLocalPage(actualCurrentPage);
            const params = new URLSearchParams(searchParams);
            params.set('page', actualCurrentPage.toString());
            setSearchParams(params);
          }
        } else {
          setJobs([]);
          setPagination(prev => ({
            ...prev,
            totalPages: 0,
            totalItems: 0
          }));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        setPagination(prev => ({
          ...prev,
          totalPages: 0,
          totalItems: 0
        }));
      }
      setLoading(false);
    };

    fetchJobs();
  }, [localPage, searchParams]);

  // Update Filter Methods
  
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    
    // Reset page to 1 when searching
    params.delete('page');
  
    // Update params with current filter values
    if (searchTitle) params.set('title', searchTitle);
    if (schedule) params.set('schedule', schedule);
    if (experienceLevel) params.set('level', experienceLevel);
    if (salaryRange) params.set('salary', salaryRange);
    if (yoe) params.set('yoe', yoe);
    if (companyName) params.set('companyName', companyName);
    if (allowance) params.set('allowance', allowance);
    if (selectedJobType) params.set('jobType', selectedJobType);
    if(minOfApplicants) params.set('minOfApplicants', minOfApplicants);
    // Location filters
    if (setSortByTime) params.set('sortByTime', sortByTime);
    if (selectedProvince) params.set('province', selectedProvince);
    if (selectedCity) params.set('city', selectedCity);
    if (selectedWard) params.set('ward', selectedWard);
    
    // Skills filter
    if (selectedSkills.length > 0) {
      params.set('skills', selectedSkills.map(skill => encodeURIComponent(skill)).join(','));
    }
  
    setSearchParams(params);
  };
  // Handle Page Change
  const handlePageChange = (direction) => {
    const newPage = direction === 'next' 
      ? Math.min(localPage + 1, pagination.totalPages)
      : Math.max(localPage - 1, 1);

    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    setLocalPage(newPage);
  };

 

  // Handle Clear All Filters
  const handleClearAllFilters = () => {
    setSearchParams({});
    
    // Reset all filter states
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedWard("");
    setSearchTitle("");
    setSchedule("");
    setExperienceLevel("");
    setSelectedJobType("");
    setMinOfApplicants("");
    setSalaryRange("");
    setYoe("");
    setCompanyName("");
    setAllowance("");
    setSelectedSkills([]);
  };

  // Render Navbar based on role
  const renderNavbar = () => {
    if (role === 'applicant') return <AppNavbar />;
    if (role === 'company') return <CompanyNavbar />;
    return <Navbar />;
  };

  
  
  return (
    <>
      {renderNavbar()}


      <div className="h-auto bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <div className="container max-w-7xl mx-auto px-4 py-8 mt-10">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto mb-6">
            {/* Main Search Bar */}



            <div className="mb-6">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Nhập tên công việc, vị trí hoặc từ khóa"
                  className="w-full p-4 pl-10 text-lg border-2 border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter Sections */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Column */}
              <div className="space-y-2">
                <div 
                  className="filter-header cursor-pointer p-2 bg-gray-50 rounded-lg"
                  onClick={() => setExpandedSection(expandedSection === 'location' ? null : 'location')}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Địa điểm</span>
                    {expandedSection === 'location' ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                  </div>
                </div>
                
                {expandedSection === 'location' && (
                  <div className="p-2 space-y-2 border-blue-200 bg-blue-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition duration-200 rounded-lg shadow-sm">
                    <select 
                      className="w-full p-2 rounded border"
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {locations.map((prov) => (
                        <option key={prov.id} value={prov.name}>{prov.name}</option>
                      ))}
                    </select>
                    <select 
                    className="w-full p-2 rounded border"
                    onChange={(e) => setSelectedCity(e.target.value)} 
                    value={selectedCity} 
                    disabled={!selectedProvince}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
  
                  <select 
                    className="w-full p-2 rounded border"
                    onChange={(e) => setSelectedWard(e.target.value)} 
                    value={selectedWard} 
                    disabled={!selectedCity}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                    {/* City and Ward selects remain the same */}
                  </div>
                )}
              </div>
                  
              {/* Job Type and Characteristics Column */}
              <div className="space-y-2">
            <div 
              className="filter-header cursor-pointer p-2 bg-gray-50 rounded-lg"
              onClick={() => setExpandedSection(expandedSection === 'requirements' ? null : 'requirements')}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Yêu cầu công việc</span>
                {expandedSection === 'requirements' ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </div>
            </div>
            
            {expandedSection === 'requirements' && (
              <div className="p-2 space-y-2 bg-white rounded-lg">
                <select 
                  className="w-full p-2 rounded border"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="">Cấp độ</option>
                  <option value="INTERN">Thực tập sinh</option>
                  <option value="FRESHER">Nhân viên mới</option>
                  <option value="JUNIOR">Nhân viên cơ bản</option>
                  <option value="SENIOR">Nhân viên dày dạn kinh nghiệm</option>
                  <option value="LEAD">Trưởng nhóm</option>
                  <option value="MANAGER">Quản lý</option>
                  <option value="DIRECTOR">Giám đốc</option>
                </select>

                <input 
                  type="number"
                  placeholder="Số năm kinh nghiệm"
                  className="w-full p-2 rounded border"
                  value={yoe}
                  min="0"
                  onChange={(e) => setYoe(Math.max(0, Number(e.target.value)).toString())}
                />

                <input 
                  type="number"
                  placeholder="Số lượng đơn tối thiểu"
                  className="w-full p-2 rounded border"
                  value={minOfApplicants}
                  min="0"
                  onChange={(e) => setMinOfApplicants(Math.max(0, Number(e.target.value)).toString())}
                />
              </div>
            )}
          </div>

              {/* Company and Salary Column */}
              <div className="space-y-2">
            <div 
              className="filter-header cursor-pointer p-2 bg-gray-50 rounded-lg"
              onClick={() => setExpandedSection(expandedSection === 'compensation' ? null : 'compensation')}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Chế độ & Đãi ngộ</span>
                {expandedSection === 'compensation' ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </div>
            </div>
            
            {expandedSection === 'compensation' && (
              <div className="p-2 space-y-2 bg-white rounded-lg">
                <select 
                  className="w-full p-2 rounded border"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                >
                  <option value="">Hình thức làm việc</option>
                  <option value="FULLTIME">Toàn thời gian</option>
                  <option value="PARTTIME">Bán thời gian</option>
                  <option value="INTERNSHIP">Thực tập sinh</option>
                  <option value="FREELANCE">Làm việc tự do</option>
                  <option value="CONTRACT">Theo hợp đồng</option>
                </select>

                <input 
                  type="number"
                  placeholder="Mức lương (Triệu VNĐ)"
                  className="w-full p-2 rounded border"
                  value={salaryRange}
                  min="0"
                  onChange={(e) => setSalaryRange(Math.max(0, Number(e.target.value)).toString())}
                />

                <input 
                  type="number"
                  placeholder="Phụ cấp (Triệu VNĐ)"
                  className="w-full p-2 rounded border"
                  value={allowance}
                  min="0"
                  onChange={(e) => setAllowance(Math.max(0, Number(e.target.value)).toString())}
                />
              </div>
            )}
          </div>




          <div className="space-y-2">
            <div 
              className="filter-header cursor-pointer p-2 bg-gray-50 rounded-lg"
              onClick={() => setExpandedSection(expandedSection === 'sort' ? null : 'sort')}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Sắp xếp</span>
                {expandedSection === 'sort' ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </div>
            </div>
              {/* Skills Column */}

             
              {expandedSection === 'sort' && (
              <div className="p-2 space-y-2 bg-white rounded-lg">
                <select 
                  className="w-full p-2 rounded border"
                  value={sortByTime}
                  onChange={(e) => setSortByTime(e.target.value)}
                >
                  <option value="desc">Mới nhất trước</option>
                  <option value="asc">Cũ nhất trước</option>
                </select>
              </div>
            )}
          </div>
        </div>

      </div>





            {/* Search and Reset Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <button 
                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                onClick={handleSearch}
              >
                Tìm Kiếm
              </button>
              <button 
                className="px-8 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition duration-300"
                onClick={handleClearAllFilters}
              >
                Đặt Lại
              </button>
            </div>
          </div>
        </div>


          <div className="flex flex-col md:flex-row gap-6">






        {/* Left Sidebar */}
        <div className="w-full md:w-64 space-y-4 mx-auto mr-3">
          {/* Job Type Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium mb-3">Loại công việc</h3>
            <select 
              className="w-full p-2 rounded border"
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
            >
              <option value="">Tất cả loại công việc</option>
              {jobTypes.map((type) => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>




          {/* Skills Section */}
          <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-medium mb-3">Kỹ năng</h3>
      <input
        type="text"
        placeholder="Tìm kiếm kỹ năng..."
        value={skillSearchTerm}
        onChange={(e) => setSkillSearchTerm(e.target.value)}
        className="w-full p-2 rounded border mb-3"
      />
      <div className="max-h-60 overflow-y-auto space-y-2">
        {skills
          .filter(skill => skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()))
          .map((skill) => (
            <div key={skill.id} className="flex items-center">
              <input
                type="checkbox"
                id={`skill-${skill.id}`}
                checked={selectedSkills.includes(skill.name)}
                onChange={() => {
                  setSelectedSkills(prev => 
                    prev.includes(skill.name)
                      ? prev.filter(s => s !== skill.name)
                      : [...prev, skill.name]
                  );
                }}
                className="mr-2"
              />
              <label htmlFor={`skill-${skill.id}`} className="text-sm">{skill.name}</label>
            </div>
          ))}
      </div>
    </div>
  </div>

  {/* Job List Section */}
  <div className="w-full md:w-3/4">
    <JobList
      jobs={jobs}
      loading={loading}
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  



      
          </div>
      </div>
      <Footer />
    </>
  );
}


  

 export default AllJob;