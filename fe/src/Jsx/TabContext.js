import React, { createContext, useState, useContext } from 'react';

// Tạo context
const TabContext = createContext();

// Tạo provider để chia sẻ state
export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Thông tin công ty'); // Giá trị mặc định

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useTab = () => useContext(TabContext);
