import { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { MapPin, Phone, Mail, Building2, Award, Users, Star } from 'lucide-react';
import Footer from '../Jsx/Footer';
import Navbar from '../Jsx/navbar';

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-red-500">
        Company not found
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full max-w-[2300px] mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02] duration-300">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            <img
              src={company.image}
              alt={company.name}
              className="w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                {company.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className="text-lg text-white font-medium">{company.fields}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="transform transition-all hover:scale-105 duration-300">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">About</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{company.description}</p>
                </div>

                <div className="space-y-4">
                  {company.addresses && company.addresses.map((address, index) => (
                    <div key={index} className="flex items-start gap-3 group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                      <MapPin className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 text-lg">{address}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <p className="text-gray-600 font-medium">Rating</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{company.rating}/5</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      <p className="text-gray-600 font-medium">Followers</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{company.numberOfFollowers}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="transform transition-all hover:scale-105 duration-300">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-purple-500 pb-2">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    {company.phoneNumbers && company.phoneNumbers.map((phone, index) => (
                      <div key={index} className="flex items-center gap-3 group hover:bg-purple-50 p-3 rounded-lg transition-all duration-300">
                        <Phone className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-700 text-lg">{phone}</span>
                      </div>
                    ))}

                    {company.emails && company.emails.map((email, index) => (
                      <div key={index} className="flex items-center gap-3 group hover:bg-purple-50 p-3 rounded-lg transition-all duration-300">
                        <Mail className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-700 text-lg">{email}</span>
                      </div>
                    ))}

                    <div className="flex items-center gap-3 group hover:bg-purple-50 p-3 rounded-lg transition-all duration-300">
                      <Building2 className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 text-lg">Tax Code: {company.taxCode}</span>
                    </div>
                  </div>
                </div>

                {company.jobPostings && company.jobPostings.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
                      Current Job Openings
                    </h2>
                    <div className="space-y-6">
                      {company.jobPostings.map((job) => (
                        <div key={job.id} className="group">
                          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{job.jobType}</h3>
                            <div className="text-base text-gray-700 space-y-2">
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Level:</span> {job.level}
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Schedule:</span> {job.schedule}
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Salary:</span> ${job.minSalary}k - ${job.maxSalary}k
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Location:</span> {job.ward}, {job.city}, {job.province}
                              </p>
                            </div>
                            <NavLink to={`/JobDetail/${job.id}`}>
                              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium 
                                transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-purple-600">
                                View Job
                              </button>
                            </NavLink>
                          </div>
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
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow"></div>
        <Footer />
      </div>
    </>
  );
};

export default CompanyDetail;