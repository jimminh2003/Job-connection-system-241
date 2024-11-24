
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyCard from './CompanyCard';
import Navbar from '../Jsx/navbar';
import Footer from '../Jsx/Footer';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchCompanies = async () => {
        try {
          const response = await fetch('/companies');
          const data = await response.json();
          setCompanies(data);
        } catch (error) {
          console.error('Error fetching companies:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCompanies();
    }, []);
  
    return (
      <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Companies</h1>
          <div className="flex gap-4">
            {/* Add filter/search components here */}
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={() => navigate(`/allcompany/${company.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
      </>
    );
  };
  
  export default CompanyList;