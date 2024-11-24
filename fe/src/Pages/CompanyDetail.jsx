import { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { MapPin, Phone, Mail, Building2, Award } from 'lucide-react';
import { Button } from 'antd';


const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCompanyDetail = async () => {
        try {
            const response = await fetch(`/companies/${id}`);
          const data = await response.json();
          setCompany(data);
        } catch (error) {
            console.error('Error fetching company details:', error);
        } finally {
            setLoading(false);
        }
      };
  
      fetchCompanyDetail();
    }, [id]);
  
    if (loading) {
      return <div className="animate-pulse">Loading...</div>;
    }
  
    if (!company) {
      return <div>Company not found</div>;
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gray-800">
            <img
              src={company.image}
              alt={company.name}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70">
              <h1 className="text-3xl font-bold text-white">{company.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Award className="w-5 h-5 text-white" />
                <span className="text-white">{company.fields}</span>
              </div>
            </div>
          </div>
  
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-600">{company.description}</p>
                
                <div className="mt-6 space-y-4">
                  {company.addresses && company.addresses.map((address, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                      <span className="text-gray-600">{address}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Company Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-semibold">{company.rating}/5</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Followers</p>
                      <p className="font-semibold">{company.numberOfFollowers}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  {company.phoneNumbers && company.phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">{phone}</span>
                    </div>
                  ))}
                  
                  {company.emails && company.emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">{email}</span>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">Tax Code: {company.taxCode}</span>
                  </div>
                </div>

                {company.jobPostings && company.jobPostings.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Current Job Openings</h2>
                    <div className="space-y-4">
                    {company.jobPostings.map((job) => (
                        <div key={job.id}>
                          <div className="bg-gray-50 p-4 rounded">
                            <h3 className="font-semibold">{job.jobType}</h3>
                            <div className="text-sm text-gray-600 mt-2">
                              <p>Level: {job.level}</p>
                              <p>Schedule: {job.schedule}</p>
                              <p>Salary: ${job.minSalary}k - ${job.maxSalary}k</p>
                              <p>Location: {job.ward}, {job.city}, {job.province}</p>
                            </div>
                          </div>
                          <NavLink to={`/JobDetail/${job.id}`}>
                            <Button>View Job</Button>
                          </NavLink>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CompanyDetail;
  
  
