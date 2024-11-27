import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationSearch = ({ onLocationChange, initialLocation }) => {
  const [provinces, setProvinces] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || {
    province: '',
    provinceId: null,
    city: '',
    cityId: null,
    ward: '',
    wardId: null
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentView, setCurrentView] = useState('provinces');
  const [currentOptions, setCurrentOptions] = useState([]);
  const locationRef = useRef(null);

  // Fetch provinces data
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/provinces'); // Update with your actual API endpoint
        const data = await response.json();
        setProvinces(data);
        setCurrentOptions(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (item, level) => {
    let newLocation = { ...selectedLocation };
    
    switch (level) {
      case 'province':
        newLocation = {
          province: item.name,
          provinceId: item.id,
          city: '',
          cityId: null,
          ward: '',
          wardId: null
        };
        setCurrentOptions(item.cities);
        setCurrentView('cities');
        break;
      
      case 'city':
        newLocation = {
          ...selectedLocation,
          city: item.name,
          cityId: item.id,
          ward: '',
          wardId: null
        };
        setCurrentOptions(item.wards);
        setCurrentView('wards');
        break;
      
      case 'ward':
        newLocation = {
          ...selectedLocation,
          ward: item.name,
          wardId: item.id
        };
        setShowDropdown(false);
        break;
    }

    setSelectedLocation(newLocation);
    onLocationChange(newLocation);
  };

  const goBack = () => {
    if (currentView === 'wards') {
      const province = provinces.find(p => p.id === selectedLocation.provinceId);
      setCurrentOptions(province.cities);
      setCurrentView('cities');
    } else if (currentView === 'cities') {
      setCurrentOptions(provinces);
      setCurrentView('provinces');
      setSelectedLocation({
        ...selectedLocation,
        city: '',
        cityId: null,
        ward: '',
        wardId: null
      });
    }
  };

  const getDisplayText = () => {
    if (selectedLocation.ward) return selectedLocation.ward;
    if (selectedLocation.city) return selectedLocation.city;
    if (selectedLocation.province) return selectedLocation.province;
    return "Chọn địa điểm";
  };

  return (
    <div className="relative w-80" ref={locationRef}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center bg-white border-2 border-gray-300 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-gray-400 transition-all duration-200"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <MapPin className="w-6 h-6 text-gray-400 ml-5" />
        <div className="flex-1 px-5 py-4 text-lg">
          {getDisplayText()}
        </div>
      </motion.div>

      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {currentView !== 'provinces' && (
            <motion.div
              whileHover={{ backgroundColor: "#f3f4f6" }}
              className="p-4 border-b text-blue-600 cursor-pointer font-medium"
              onClick={goBack}
            >
              ← Quay lại
            </motion.div>
          )}

          {currentOptions.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ backgroundColor: "#f3f4f6" }}
              className="p-4 cursor-pointer text-base hover:bg-gray-50"
              onClick={() => handleLocationSelect(item, currentView.slice(0, -1))}
            >
              {item.name}
              {item.jobPostings?.length > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  ({item.jobPostings.length} việc làm)
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LocationSearch;