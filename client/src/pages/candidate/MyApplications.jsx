import { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Interview':
        return 'bg-purple-100 text-purple-700';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-700';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-700';
      case 'Withdrawn':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Selected':
        return <CheckCircle className="h-5 w-5" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
        <p className="mt-4 text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-4">Start applying to jobs to track your applications here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-navy-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.job?.title}</h3>
                      <p className="text-gray-600">{app.job?.company}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <span>{app.job?.location}</span>
                        <span>•</span>
                        <span>{app.job?.employmentType}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`badge flex items-center gap-1 ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
