import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { User, FileText, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const JobApplications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getJobApplications(id);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus, '');
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Error updating status');
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
      <button className="flex items-center text-royal-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600">Applications will appear here once candidates start applying</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-navy-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{app.candidate?.name}</h3>
                    <p className="text-gray-600 text-sm">{app.candidate?.email}</p>
                    {app.coverLetter && (
                      <p className="text-gray-700 mt-2 text-sm">{app.coverLetter}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-royal-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button className="btn btn-secondary text-sm">
                    View Resume
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
