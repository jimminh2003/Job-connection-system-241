
import React, { useState, useEffect } from 'react';
import AppNavbar from '../Jsx/AppNavbar';
import CompanyNavbar from '../Jsx/CompanyNavbar';
import Navbar from '../Jsx/navbar';
import Footer from '../Jsx/Footer';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TokenManager from '../utils/tokenManager';
import placeholderImage from '../images/logo3.png';
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

  // Location state
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);

  // Cascading location selection
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Other filter states
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [minRating, setMinRating] = useState('');
  const [fields, setFields] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 9;

  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    location: false,
    requirements: false,
    rating: false
  });
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

  // Update cities when province changes
  useEffect(() => {
    const selectedProvinceObj = locations.find(loc => loc.name === selectedProvince);
    if (selectedProvinceObj) {
      setCities(selectedProvinceObj.cities || []);
      setSelectedCity('');
      setSelectedWard('');
      setWards([]);
    } else {
      setCities([]);
      setSelectedCity('');
      setSelectedWard('');
      setWards([]);
    }
  }, [selectedProvince, locations]);

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

  // Fetch companies with dynamic filtering
  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      console.log('Đang fetch!');
      const params = {};
      if (searchTitle) params.name = searchTitle;
      if (selectedProvince) params.province = encodeURIComponent(selectedProvince);
      if (selectedCity) params.city = encodeURIComponent(selectedCity);
      if (selectedWard) params.ward = encodeURIComponent(selectedWard);
      if (selectedField) params.field = encodeURIComponent(selectedField);
      if (minRating) params.minRating = minRating;
  
      console.log('Request Parameters:', params);
  
      const response = await axios.get('http://localhost:8080/public/companies', { params });
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
    if (selectedField) params.set('field', selectedField);
    if (minRating) params.set('minRating', minRating);
    setSearchParams(params);
  };

  // Handlers
  const handleSearch = () => {
    fetchCompanies();
    updateSearchParams();
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedWard('');
    setSelectedField('');
    setMinRating('');
    setSearchParams({});
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
  // Pagination logic
  const indexOfLastCompany = currentPage * companiesPerPage;
const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
const currentCompanies = Array.isArray(companies) 
  ? companies.slice(indexOfFirstCompany, indexOfLastCompany) 
  : [];
const totalPages = Array.isArray(companies) ? Math.ceil(companies.length / companiesPerPage) : 0;
  return (
    <>
    {renderNavbar()}
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen  mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Large Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tên công ty"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full p-4 pl-12 border-2 border-blue-300 rounded-xl text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-4 text-blue-500 w-6 h-6" />
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Location Filters */}
          <div className="space-y-4">
            <select 
              value={selectedProvince} 
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Chọn Tỉnh/Thành Phố</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedProvince}
              className="w-full p-3 border rounded-lg bg-white disabled:bg-gray-200 focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Chọn Quận/Huyện</option>
              {cities.map(city => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </select>

            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedCity}
              className="w-full p-3 border rounded-lg bg-white disabled:bg-gray-200 focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map(ward => (
                <option key={ward.id} value={ward.name}>{ward.name}</option>
              ))}
            </select>
          </div>

          {/* Field Filter */}
          <div className="space-y-4">
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Chọn Lĩnh Vực</option>
              {fields.map(field => (
                <option key={field.id} value={field.name}>{field.name}</option>
              ))}
            </select>

            {/* Rating Filter */}
            <div className="relative">
              <input 
                type="number" 
                placeholder="Đánh giá tối thiểu" 
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                min="0" 
                max="5" 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
              <Star className="absolute right-4 top-4 text-yellow-500" />
            </div>






            {/* Search and Clear Buttons */}
            <div className="flex space-x-2">
              <button 
               onClick={() => {
                fetchCompanies();
                updateSearchParams();
              }}
                disabled={isLoading}
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition flex-1 flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 animate-spin" /> Đang tìm...</>
                ) : (
                  <><Search className="mr-2" /> Tìm kiếm</>
                )}
              </button>
              <button 
                onClick={handleClearFilters}
                className="bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition"
              >
                <X className="w-5 h-5" />
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
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {company.fields?.[0] || "Unknown Field"}
        </span>
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
    </div>
    <Footer/>
    </>
  );
  
};

// StarRating component remains the same as in the original code



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
// import React, { useState, useMemo, useEffect } from 'react';
// import { Star, ArrowRight, Search, X, Filter, Sliders } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { TokenManager } from "../utils/tokenManager";
// import AppNavbar from '../Jsx/AppNavbar';
// import CompanyNavbar from '../Jsx/CompanyNavbar';
// import Navbar from '../Jsx/navbar';
// import Footer from '../Jsx/Footer';
// import placeholderImage from '../images/logo1.png';

// const token = TokenManager.getToken();
// const role = token?.role;

// const renderNavbar = () => {
//   if (role === 'applicant') return <AppNavbar/>;
//   if (role === 'company') return <CompanyNavbar />;
//   return <Navbar />;
// };

// const RangeSlider = ({ min, max, onChange }) => {
//   const [minValue, setMinValue] = useState(min);
//   const [maxValue, setMaxValue] = useState(max);

//   const handleMinChange = (e) => {
//     const value = Math.min(Number(e.target.value), maxValue - 0.1);
//     setMinValue(value);
//     onChange([value, maxValue]);
//   };

//   const handleMaxChange = (e) => {
//     const value = Math.max(Number(e.target.value), minValue + 0.1);
//     setMaxValue(value);
//     onChange([minValue, value]);
//   };

//   return (
//     <div className="w-full px-4 py-2">
//       <div className="flex justify-between text-sm text-gray-600 mb-2">
//         <span>{minValue} sao</span>
//         <span>{maxValue} sao</span>
//       </div>
//       <div className="relative w-full">
//         <input
//           type="range"
//           min={0}
//           max={5}
//           step={0.1}
//           value={minValue}
//           onChange={handleMinChange}
//           className="absolute w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer"
//         />
//         <input
//           type="range"
//           min={0}
//           max={5}
//           step={0.1}
//           value={maxValue}
//           onChange={handleMaxChange}
//           className="absolute w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer"
//         />
//       </div>
//     </div>
//   );
// };

// const StarRating = ({ rating }) => {
//   const safeRating = rating && !isNaN(rating) ? rating : 0;

//   const fullStars = Math.floor(safeRating);
//   const partialStarPercentage = (safeRating - fullStars) * 100;

//   return (
//     <div className="flex items-center">
//       {[...Array(5)].map((_, index) => (
//         <div key={index} className="relative">
//           <Star 
//             className={`w-6 h-6 ${index < fullStars ? 'text-yellow-500' : 'text-gray-300'}`} 
//             fill={index < fullStars ? 'currentColor' : 'none'}
//           />
//           {index === fullStars && partialStarPercentage > 0 && (
//             <div 
//               className="absolute top-0 left-0 overflow-hidden" 
//               style={{ width: `${partialStarPercentage}%` }}
//             >
//               <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
//             </div>
//           )}
//         </div>
//       ))}
//       <span className="ml-2 text-sm text-gray-600">
//         ({safeRating.toFixed(1)})
//       </span>
//     </div>
//   );
// };

// // Component tìm kiếm và lọc
// const CompanySearch = () => {
//   const [companies, setCompanies] = useState([]);
// const [isLoading, setIsLoading] = useState(false);
// const [searchTerm, setSearchTerm] = useState('');
// const [searchType, setSearchType] = useState('name'); 
// const [ratingRange, setRatingRange] = useState([0, 5]);
// const [isRatingFilterOpen, setIsRatingFilterOpen] = useState(false);
// const [currentPage, setCurrentPage] = useState(1);
// const [searchFields, setSearchFields] = useState(['name', 'address']); // Add this line
// const companiesPerPage = 9;
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       setIsLoading(true);
//       try {
//         // Detailed logging for network debugging
//         console.log('Attempting to fetch companies with:', {
//           url: 'http://localhost:8080/public/companies',
//           token: TokenManager.getToken()?.value ? 'Token present' : 'No token'
//         });
  
//         const headers = {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         };
  
//         const token = TokenManager.getToken();
//         if (token?.value) {
//           headers['Authorization'] = `Bearer ${token.value}`;
//         }
  
//         // Add timeout to fetch
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 100000); // 10 second timeout
  
//         try {
//           const response = await fetch('http://localhost:8080/public/companies', {
//             method: 'GET',
//             headers,
//             credentials: 'include',
//             signal: controller.signal
//           });
  
//           clearTimeout(timeoutId);
  
//           // Detailed response logging
//           console.log('Response status:', response.status);
//           console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
//           if (!response.ok) {
//             const errorText = await response.text();
//             console.error('Error response body:', errorText);
//             throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//           }
  
//           const data = await response.json();
//           console.log('Fetched companies:', data);
  
//           const processedCompanies = (data || []).map(company => ({
//             ...company,
//             addresses: company.addresses || [],
//             phoneNumbers: company.phoneNumbers || [],
//             emails: company.emails || [],
//             rating: company.rating || 0,
//             image: company.image || placeholderImage
//           }));
          
//           setCompanies(processedCompanies);
//         } catch (fetchError) {
//           clearTimeout(timeoutId);
//           throw fetchError;
//         }
//       } catch (error) {
//         console.error('Detailed Network Error:', {
//           message: error.message,
//           name: error.name,
//           stack: error.stack,
//           // Thêm các chi tiết khác nếu có
//         });
      
//         // Thêm log chi tiết hơn
//         if (error.response) {
//           // Lỗi từ phía server
//           console.error('Server Error:', error.response.data);
//           console.error('Status Code:', error.response.status);
//         } else if (error.request) {
//           // Lỗi không nhận được response
//           console.error('No Response Received:', error.request);
//         }
      
//         // Thông báo cụ thể hơn
//         alert('Không thể tải danh sách công ty. Vui lòng kiểm tra kết nối và thử lại.');
      
//         setCompanies([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchCompanies();
//   }, []);
//   const filteredCompanies = useMemo(() => {
//     return companies.filter(company => {
//       // Logic tìm kiếm theo loại
//       const matchesSearchTerm = () => {
//         switch (searchType) {
//           case 'name':
//             return company.name.toLowerCase().includes(searchTerm.toLowerCase());
//           case 'address':
//             return company.addresses && company.addresses[0] 
//               ? company.addresses[0].toLowerCase().includes(searchTerm.toLowerCase()) 
//               : false;
//           case 'both':
//             return (
//               company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               (company.addresses && company.addresses[0] 
//                 ? company.addresses[0].toLowerCase().includes(searchTerm.toLowerCase()) 
//                 : false)
//             );
//           default:
//             return true;
//         }
//       };
//       // Kiểm tra rating trong phạm vi
//       const matchesRating = 
//         company.rating >= ratingRange[0] && 
//         company.rating <= ratingRange[1];

//       return matchesSearchTerm() && matchesRating;
//     });
//   }, [companies, searchTerm, searchType, ratingRange]);

//   const clearAllFilters = () => {
//     setSearchTerm('');
//     setSearchFields(['name', 'address']);
//     setRatingRange([0, 5]);
//     setIsRatingFilterOpen(false);
//   };

//   // Tính toán các công ty trên trang hiện tại
//   const indexOfLastCompany = currentPage * companiesPerPage;
//   const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
//   const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

//   // Tính toán số trang
//   const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

//   // Hàm xử lý chuyển đến trang chi tiết
//   const handleCompanyDetail = (companyId) => {
//     if (companyId) {
//       navigate(`/allcompany/${companyId}`);
//     } else {
//       console.error('Invalid company ID');
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   const ContactInfo = ({ phoneNumbers, emails }) => {
//     const [showMore, setShowMore] = useState(false);
  
//     const displayPhones = showMore ? phoneNumbers : phoneNumbers.slice(0, 1);
//     const displayEmails = showMore ? emails : emails.slice(0, 1);
  
//     return (
//       <div className="mt-2 space-y-1">
//         {displayPhones.map((phone, index) => (
//           <a 
//             key={`phone-${index}`} 
//             href={`tel:${phone}`} 
//             className="block text-blue-600 hover:underline"
//           >
//             📞 {phone}
//           </a>
//         ))}
//         {displayEmails.map((email, index) => (
//           <a 
//             key={`email-${index}`} 
//             href={`mailto:${email}`} 
//             className="block text-green-600 hover:underline"
//           >
//             ✉️ {email}
//           </a>
//         ))}
//         {(phoneNumbers.length > 1 || emails.length > 1) && !showMore && (
//           <button 
//             onClick={() => setShowMore(true)} 
//             className="text-sm text-blue-500 hover:text-blue-700"
//           >
//             Xem thêm thông tin liên hệ
//           </button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {renderNavbar()}
//       <div className="container mx-auto px-4 py-8 bg-gray-50 mt-10">
//         {/* Thanh tìm kiếm nâng cấp */}
//         <div className="mb-8 bg-white rounded-xl shadow-md p-6">
//           {/* Hiển thị các trường đang tìm kiếm */}
//           <div className="flex mb-4 items-center space-x-2">
//             {searchFields.map(field => (
//               <span 
//                 key={field} 
//                 className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
//               >
//                 {field === 'name' ? 'Tên Công Ty' : field === 'address' ? 'Địa Chỉ' : 'Đánh Giá'}
//                 <X 
//                   className="ml-2 cursor-pointer" 
//                   size={16} 
//                   onClick={() => setSearchFields(prev => prev.filter(f => f !== field))} 
//                 />
//               </span>
//             ))}
//             {searchFields.length === 0 && (
//               <span className="text-gray-500">Chọn trường tìm kiếm</span>
//             )}
//           </div>

//           {/* Thanh tìm kiếm chính */}
//           <div className="flex items-center space-x-4">
//             <div className="relative flex-grow">
//               <input 
//                 type="text" 
//                 placeholder="Tìm kiếm công ty..." 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              
//               {/* Menu chọn loại tìm kiếm */}
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
//                 <button 
//                   onClick={() => setSearchType('name')}
//                   className={`px-2 py-1 rounded-full text-xs transition-all ${
//                     searchType === 'name' 
//                       ? 'bg-blue-500 text-white' 
//                       : 'bg-gray-200 text-gray-700'
//                   }`}
//                 >
//                   Tên
//                 </button>
//                 <button 
//                   onClick={() => setSearchType('address')}
//                   className={`px-2 py-1 rounded-full text-xs transition-all ${
//                     searchType === 'address' 
//                       ? 'bg-blue-500 text-white' 
//                       : 'bg-gray-200 text-gray-700'
//                   }`}
//                 >
//                   Địa chỉ
//                 </button>
//                 <button 
//                   onClick={() => setSearchType('both')}
//                   className={`px-2 py-1 rounded-full text-xs transition-all ${
//                     searchType === 'both' 
//                       ? 'bg-blue-500 text-white' 
//                       : 'bg-gray-200 text-gray-700'
//                   }`}
//                 >
//                   Cả 2
//                 </button>
//               </div>
//             </div>
//             {/* Nút lọc Rating */}
//             <div className="relative">
//               <button 
//                 onClick={() => setIsRatingFilterOpen(!isRatingFilterOpen)} 
//                 className="px-3 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center"
//               >
//                 <Sliders size={20} className="mr-2" />
//                 Đánh giá
//               </button>
//             </div>
       
//             {/* Nút xóa tất cả */}
//             <button 
//               onClick={clearAllFilters} 
//               className="px-3 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {currentCompanies.length === 0 && (
//           <div className="text-center py-16 bg-white rounded-xl shadow-md">
//             <Search className="mx-auto w-16 h-16 text-gray-300 mb-4" />
//             <h3 className="text-xl text-gray-600">
//               Không tìm thấy công ty phù hợp
//             </h3>
//             <p className="text-gray-500 mt-2">
//               Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
//             </p>
//             <button 
//               onClick={clearAllFilters} 
//               className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//             >
//               Đặt lại bộ lọc
//             </button>
//           </div>
//         )}

//         {isRatingFilterOpen && (
//           <div className="mt-4 bg-gray-100 rounded-lg p-4">
//             <RangeSlider 
//               min={0} 
//               max={5} 
//               onChange={(range) => setRatingRange(range)} 
//             />
//             <div className="text-center text-sm text-gray-600 mt-2">
//               Hiển thị các công ty từ {ratingRange[0]} đến {ratingRange[1]} sao
//             </div>
//           </div>
//         )}
        
      
//         {/* Danh sách công ty với hiệu ứng hover nâng cao */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentCompanies.map(company => (
//             <div 
//               key={company.id} 
//               className="bg-white rounded-xl shadow-lg 
//                 transition-all duration-300 ease-in-out 
//                 transform hover:-translate-y-2 hover:shadow-2xl 
//                 border border-transparent hover:border-blue-200 
//                 group cursor-pointer"
//               onClick={() => handleCompanyDetail(company.id)}
//             >
//               {/* Hình ảnh với hiệu ứng zoom */}
//               <div className="relative h-48 overflow-hidden rounded-t-xl">
//                 <img 
//                 src={company.image || placeholderImage} 
//                 alt={company.name}
//                 onError={(e) => { e.target.src = placeholderImage }}
//                 className="w-full h-full object-cover 
//                   transition-transform duration-300 
//                   group-hover:scale-110"
//               />
//               </div>

//               {/* Thông tin công ty */}
//               <div className="p-6">
//               <h2 className="text-xl font-bold mb-2 text-gray-900 
//               group-hover:text-blue-700 transition-colors duration-300 tracking-tight">
//               {company.name}
//             </h2>
//                      <StarRating rating={company.rating} />

//                 <div className="mt-4 space-y-2">
//                   <p className="text-gray-600 truncate">
//                     <span className="font-semibold text-blue-600">Địa chỉ: </span>
//                     {company.addresses[0]}
//                   </p>
//                   <p className="text-gray-600">
//                     <span className="font-semibold text-blue-600">Lĩnh vực: </span>
//                     {company.fields}
//                   </p>
//                   <p className="text-gray-600 truncate">
//                       <span className="font-semibold text-blue-600">Địa chỉ: </span>
//                       {company.addresses && company.addresses[0] && company.addresses[0] !== 'null' 
//                         ? company.addresses[0] 
//                         : company.fullAddress 
//                         ? company.fullAddress
//                         : 'Địa chỉ chưa cập nhật'}
//                     </p>
//                   {company.phoneNumbers && company.phoneNumbers.length > 0 && (
//                       <ContactInfo 
//                         phoneNumbers={company.phoneNumbers} 
//                         emails={company.emails || []} 
//                       />
//                     )}
//                   <div className="flex justify-between items-center mt-4">
//                     <span className="text-sm font-semibold text-green-600">
//                       Đang tuyển: {company.recruitQuantity || 'Chưa xác định'}
//                     </span>
//                     <ArrowRight className="text-blue-500 group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//       {/* Phân trang */}
//       {filteredCompanies.length > companiesPerPage && (
//         <div className="mt-8 flex justify-center space-x-4">
//           <button 
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
//           >
//             Trước
//           </button>
          
//           <span className="px-4 py-2 bg-gray-200 rounded-lg">
//             Trang {currentPage} / {totalPages}
//           </span>
          
//           <button 
//             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
//           >
//             Tiếp
//           </button>
//         </div>
//       )}
   
//     </div>
//     <Footer/>
//   </>
//     ); // Close the JSX fragment here
// };

// export default CompanySearch;