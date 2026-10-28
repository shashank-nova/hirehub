import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { Building2, Globe, MapPin, Users } from 'lucide-react';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await companyService.getCompany();
      setCompany(response.data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
        <p className="mt-4 text-gray-600">Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="btn btn-primary"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {company ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-navy-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-12 w-12 text-navy-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
              <p className="text-gray-600">{company.industry}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-400" />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-royal-600 hover:underline"
                >
                  {company.website || 'Not provided'}
                </a>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{company.location || 'Not provided'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{company.size || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-gray-900">{company.description || 'No description provided'}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No company profile yet</h3>
          <p className="text-gray-600 mb-4">Create your company profile to start posting jobs</p>
          <button className="btn btn-primary">Create Profile</button>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
