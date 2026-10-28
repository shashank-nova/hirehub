import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Briefcase, Bookmark, Clock, CheckCircle } from 'lucide-react';

const CandidateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getCandidateDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.totalApplications || 0}
              </p>
            </div>
            <Briefcase className="h-12 w-12 text-royal-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Saved Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.savedJobs || 0}
              </p>
            </div>
            <Bookmark className="h-12 w-12 text-royal-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Under Review</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.statusBreakdown?.['Under Review'] || 0}
              </p>
            </div>
            <Clock className="h-12 w-12 text-royal-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
        {stats?.recentApplications?.length > 0 ? (
          <div className="space-y-4">
            {stats.recentApplications.map((app) => (
              <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{app.job?.title}</p>
                  <p className="text-sm text-gray-600">{app.job?.company}</p>
                </div>
                <span className={`badge ${
                  app.status === 'Selected' ? 'bg-green-100 text-green-700' :
                  app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No applications yet</p>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
