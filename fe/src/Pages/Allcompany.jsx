
import React, { useState, useEffect } from 'react';
import AppNavbar from '../Jsx/AppNavbar';
import CompanyNavbar from '../Jsx/CompanyNavbar';
import Navbar from '../Jsx/navbar';
import Footer from '../Jsx/Footer';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TokenManager from '../utils/tokenManager';
import placeholderImage from '../images/logo3.png';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { 
  Star, 
  Search, 
  X, 
  ChevronUp, 
  ChevronDown, 
  MapPin, 
  
  Filter as FilterIcon, 
  ArrowRight,
  Loader2
} from 'lucide-react';
const token = TokenManager.getToken();
  const role = token?.role;
  const renderNavbar = () => {
    if (role === 'applicant') return <AppNavbar />;
    if (role === 'company') return <CompanyNavbar />;
    return <Navbar />;
  };

const CompanySearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [taxCode, setTaxCode] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [minRating, setMinRating] = useState('');
  const [fields, setFields] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    location: false,
    characteristics: false
  });

  const getGridClassName = (companiesCount) => {
    if (companiesCount === 1) {
      return "flex justify-center w-full";
    }
    if (companiesCount === 2) {
      return "grid grid-cols-2 gap-8 max-w-4xl mx-auto";
    }
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
  };
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 9;

  const navigate = useNavigate();
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const calculateHeight = () => {
    switch(expandedSections) {
      case 'location': return 420;
      case 'characteristics': return 420;
      default: return 220;
  }   
  };
  // Fetch locations and fields
  useEffect(() => {
    const fetchLocationsAndFields = async () => {
      try {
        const [locationsResponse, fieldsResponse] = await Promise.all([
          axios.get('http://localhost:8080/public/locations'),
          axios.get('http://localhost:8080/public/fields')
        ]);
        setLocations(locationsResponse.data);
        setFields(fieldsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchLocationsAndFields();
  }, []);

  // Fetch companies khi trang được tải lần đầu
useEffect(() => {
  fetchCompanies();
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


  // Update wards when city changes
  useEffect(() => {
    const selectedCityObj = cities.find(city => city.name === selectedCity);
    if (selectedCityObj) {
      setWards(selectedCityObj.wards || []);
      setSelectedWard('');
    } else {
      setWards([]);
      setSelectedWard('');
    }
  }, [selectedCity, cities]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      console.log('Đang fetch!');
      const params = {};
      if (searchTitle) params.name = searchTitle;
      if (selectedProvince) params.province =selectedProvince;
      if (selectedCity) params.city = selectedCity;
      if (selectedWard) params.ward = selectedWard;
      if (selectedField) params.fields = selectedField;
      if (minRating) params.minRating = minRating;
      if (taxCode) params.taxCode = taxCode;
  
      console.log('Request Parameters:', params);
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`http://localhost:8080/public/companies?${queryString}`);
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setIsLoading(false);
    } finally {
      console.log('Đã tìm xong!');
      setIsLoading(false);
    }
  };
 
  // Update search params
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchTitle) params.set('name', searchTitle);
    if (selectedProvince) params.set('province', selectedProvince);
    if (selectedCity) params.set('city', selectedCity);
    if (selectedWard) params.set('ward', selectedWard);
    if (selectedField) params.set('fields', selectedField);
    if (minRating) params.set('minRating', minRating);
    if (taxCode) params.set('taxCode', taxCode);
    setSearchParams(params);
  };

  // Handlers
  
  const handleClearFilters = () => {
    setSearchParams({});
    
    setSearchTitle('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedWard('');
    setSelectedField('');
    setMinRating('');
    setTaxCode('');
    fetchCompanies();
  };
  const CompanyCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-t-xl"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 mb-2 w-3/4 rounded"></div>
        <div className="h-4 bg-gray-200 mb-2 w-1/2 rounded"></div>
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 mb-1 w-full rounded"></div>
        ))}
        <div className="h-10 bg-gray-200 mt-4 rounded"></div>
      </div>
    </div>
  );
  const clearSearch = () => {
    setSearchTitle('');
    const params = new URLSearchParams(searchParams);
    params.delete('name');
    setSearchParams(params);
  };
  const indexOfLastCompany = currentPage * companiesPerPage;
const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
const currentCompanies = Array.isArray(companies) 
  ? companies.slice(indexOfFirstCompany, indexOfLastCompany) 
  : [];
const totalPages = Array.isArray(companies) ? Math.ceil(companies.length / companiesPerPage) : 0;

  return (
    <>
    {renderNavbar()}
    <div className="h-auto bg-gradient-to-b from-blue-50 via-white to-blue-50 ">
    <div className="container mx-w-7xl mx-auto px-4 py-8 mt-20">
    <div className={`w-full h-[${calculateHeight()}px] rounded-xl bg-gradient-to-br from-thirdColor to-themeColor text-white shadow-2xl p-6 border-l-7 border-blue-700 transition-all duration-500 hover:shadow-3xl hover:scale-105 hover:border-purple-600 from-blue-300 via-blue-400 to-purple-170`}>
        {/* Large Search Bar */}
        <div className="mb-6 relative">
        <div className="relative shadow-lg">
        <input 
                type="text"
                placeholder="Tìm kiếm công ty"
                className="w-full p-4 pl-14 pr-36 text-lg border-0 rounded-full 
                bg-white text-gray-800 
                focus:ring-4 focus:ring-blue-200 
                transition duration-300 ease-in-out
                placeholder-gray-400
                hover:shadow-xl
                transform hover:scale-[1.01]"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center">
                <Search className="h-7 w-7 text-blue-500" />
              </div>

              {searchTitle && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <button 
                    onClick={clearSearch}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {searchTitle}
                    <span className="ml-2">×</span>
                  </button>
                </div>
              )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 opacity-70 hover:opacity-100 transition-opacity">
  <span className="text-sm text-red-500">Gợi ý:</span>
  {[
    'Công ty ABC', 
    'Tập đoàn XYZ', 
    'Tech Solutions Ltd.', 
    'Công ty TNHH Phát Triển Công Nghệ', 
    'Global Innovators Inc.',
    'Startup A',
    'Tập đoàn Bảo Việt',
   
  ].map(tag => (
    <button
      key={tag}
      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs 
      hover:bg-blue-100 hover:text-blue-800 transition duration-300"
      onClick={() => setSearchTitle(tag)}
    >
      {tag}
    </button>

    ))}
  </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-4">
          {/* Location Filters */}
          <div className="space-y-2">
                <div 
                  className="filter-header cursor-pointer p-2 bg-gray-50 rounded-lg"
                  // onClick={() => setExpandedSection(expandedSection === 'location' ? null : 'location')}
                  onClick={() => toggleSection('location')}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 mx-auto">Địa điểm</span>
                    {expandedSections.location ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                  </div>
                </div>
                
                {expandedSections.location && (
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
                    <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
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
                  <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
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
              {/* Characteristics Filters */}
           
              <div className="space-y-2">
            <div 
              className="filter-header cursor-pointer p-2 bg-gray-50 rounded-lg"
              onClick={() => toggleSection('characteristics')}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 mx-auto">Yêu cầu</span>
                {expandedSections.characteristics? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </div>
            </div>
            
          {/* Field Filter */}
          {expandedSections.characteristics && (
            <div className="p-2 space-y-2 bg-white rounded-lg">
             <select
          
             value={selectedField}
             onChange={(e) => setSelectedField(e.target.value)}
             className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-300"
           >
             <option value="">Chọn Lĩnh Vực</option>
             {fields.map(fields => (
               <option key={fields.id} value={fields.name}>{fields.name}</option>
             ))}
           </select>
           <label className="block text-sm font-medium text-gray-700">Rating</label>
           <input 
                type="number" 
                placeholder="Đánh giá tối thiểu" 
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                min="0" 
                max="5" 
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-700"
              />
              <label className="block text-sm font-medium text-gray-700">Taxcode</label>
              <input
  type="text" // Thay đổi từ "number" thành "text" để chấp nhận cả chữ và số
  placeholder="Taxcode"
  value={taxCode}
  onChange={(e) => {
    const value = e.target.value;
    // Kiểm tra xem đầu vào chỉ chứa chữ và số
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setTaxCode(value);
    }
  }}
  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-700"
/>
              </div>
          )}
      
         </div>
         </div>
          

            {/* Search and Clear Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <button 
               onClick={() => {
                fetchCompanies();
                updateSearchParams();
              }}
                disabled={isLoading}
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition flex-2 flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 animate-spin" /> Đang tìm...</>
                ) : (
                  <><Search className="mr-2" /> Tìm kiếm</>
                )}
              </button>
              <button 
                onClick={handleClearFilters}
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full 
    hover:from-gray-500 hover:to-gray-600 shadow-lg 
    transform transition-transform duration-300 hover:scale-105 focus:outline-none 
    focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50  mx-auto"
              >
                Đặt Lại
              </button>
            </div>
          </div>
         
          {/* Loading or Results Count */}
          
          <div className="flex items-center justify-center bg-blue-50 rounded-lg p-4 text-center">
            <div>
              <p className="text-blue-700 font-semibold">
                {isLoading 
                  ? "Đang tìm kiếm..." 
                  : `Tìm thấy ${companies.length} công ty`}
              </p>
            </div>
          </div>
        </div>
      


        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <CompanyCardSkeleton key={index} />
            ))}
          </div>
        ) : currentCompanies.length > 0 ? (
  <>


{currentCompanies.length > 0 ? (
        <div className={getGridClassName()}>
          {currentCompanies.map((company) => (
            <CompanyCard 
              key={company.id}
              company={company}
              navigate={navigate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">
          Không tìm thấy công ty nào phù hợp
        </div>
      )}
    {/* Companies Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {currentCompanies.map((company) => (
    <div
      key={company.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
    >
      {/* Company Image */}
      <div className="relative">
      <img
        src={placeholderImage}
        alt={company.name}
        className="w-full h-48 object-cover rounded-lg"
      />
       {company.fields && Array.isArray(company.fields) && (
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {[...new Set(company.fields)]
            .filter(field => field)
            .map((field, index) => (
              <span
                key={`${field}-${index}`}
                className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                {field}
            </span>
          ))}
        </div>
      )}
      </div>
     
    
      {/* Company Information */}
      <div className="p-6 space-y-4">
        {/* Company Name */}
        <h2 className="text-lg font-bold text-gray-800 truncate">{company.name}</h2>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <StarRating rating={company.rating || 0} />
          
        </div>

        {/* Address */}
        <p className="text-sm text-gray-600 flex items-center">
          <MapPin className="w-4 h-4 text-blue-500 mr-2" />
          {company.fullAddress || "Địa chỉ không xác định"}
        </p>

        {/* Tax Code */}
        <p className="text-sm text-gray-600">
          <i className="mr-2">💼</i>
          Mã số thuế: <span className="font-medium">{company.taxCode || "Không có"}</span>
        </p>

        {/* Contact Information */}
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <i className="mr-2">📧</i>
            Emails: <span className="font-medium">{company.emails?.join(", ") || "Không có"}</span>
          </p>
          <p className="text-gray-600">
            <i className="mr-2">📞</i>
            Số điện thoại: <span className="font-medium">{company.phoneNumbers?.join(", ") || "Không có"}</span>
          </p>
        </div>

        {/* Followers */}
        <p className="text-sm text-gray-600 flex items-center">
          <i className="mr-2">👥</i>
          Người theo dõi: <span className="font-medium">{company.numberOfFollowers || 0}</span>
        </p>
            <button 
              onClick={() => navigate(`/allcompany/${company.id}`)}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
            >
              Xem Chi Tiết <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
) : (
  <div className="text-center text-gray-600 py-8">
    Không tìm thấy công ty nào phù hợp
  </div>
)}



        {/* Pagination */}
        {companies.length > companiesPerPage && (
          <div className="flex justify-center mt-8 space-x-4 items-center">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600"
            >
              Trước
            </button>
            <span className="text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600"
            >
              Tiếp
            </button>
          </div>
        )}
      </div>
  
    <Footer/>
    </>
  );
  
};

// StarRating component remains the same as in the original code

const CompanyCard = ({ company, navigate }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-10 w-96 p-4 bg-white border border-gray-200 rounded-lg shadow-xl left-full ml-4 top-0">
          <h3 className="font-bold text-lg mb-2">Công việc đang tuyển:</h3>
          <div className="space-y-3">
            {company.jobPostings?.map(job => (
              <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-blue-600">{job.title}</h4>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <span className="text-gray-600">Mức lương: </span>
                    <span className="font-medium">{job.minSalary} - {job.maxSalary} triệu</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cấp bậc: </span>
                    <span className="font-medium">{job.level}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Loại: </span>
                    <span className="font-medium">{job.jobType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ứng viên: </span>
                    <span className="font-medium">{job.numberOfApplicants}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Card Content */}
      <div className="relative">
        <img
          src={company.image || placeholderImage}
          alt={company.name}
          className="w-full h-48 object-cover"
        />
        {company.fields && Array.isArray(company.fields) && (
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {[...new Set(company.fields)].map((field, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">{company.name}</h2>
        
        <div className="flex items-center space-x-2">
          <StarRating rating={company.rating || 0} />
        </div>

        <p className="text-sm text-gray-600 flex items-center">
          <MapPin className="w-4 h-4 text-blue-500 mr-2" />
          {company.fullAddress || "Địa chỉ không xác định"}
        </p>

        <p className="text-sm text-gray-600">
          <i className="mr-2">💼</i>
          Mã số thuế: <span className="font-medium">{company.taxCode || "Không có"}</span>
        </p>

        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <i className="mr-2">📧</i>
            Emails: <span className="font-medium">{company.emails?.join(", ") || "Không có"}</span>
          </p>
          <p className="text-gray-600">
            <i className="mr-2">📞</i>
            Số điện thoại: <span className="font-medium">{company.phoneNumbers?.join(", ") || "Không có"}</span>
          </p>
        </div>

        <p className="text-sm text-gray-600 flex items-center">
          <i className="mr-2">👥</i>
          Người theo dõi: <span className="font-medium">{company.numberOfFollowers || 0}</span>
        </p>

        <button 
          onClick={() => navigate(`/allcompany/${company.id}`)}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
        >
          Xem Chi Tiết <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};



// Star Rating Component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const partialStarPercentage = (rating - fullStars) * 100;

  return (
    <>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="relative">
          <Star 
            className={`w-5 h-5 ${index < fullStars ? 'text-yellow-500' : 'text-gray-300'}`} 
            fill={index < fullStars ? 'currentColor' : 'none'}
          />
          {index === fullStars && partialStarPercentage > 0 && (
            <div 
              className="absolute top-0 left-0 overflow-hidden" 
              style={{ width: `${partialStarPercentage}%` }}
            >
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
            </div>
          )}
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        ({rating.toFixed(1)})
      </span>
    </>
  );
};

export default CompanySearch;
