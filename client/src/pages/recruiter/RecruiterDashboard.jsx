import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Briefcase, Users, FileText, TrendingUp } from 'lucide-react';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getRecruiterDashboard();
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Recruiter Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.totalJobs || 0}
              </p>
            </div>
            <Briefcase className="h-12 w-12 text-royal-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Open Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.openJobs || 0}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-royal-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.totalApplications || 0}
              </p>
            </div>
            <Users className="h-12 w-12 text-royal-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Jobs</h2>
          {stats?.recentJobs?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.company?.name}</p>
                  </div>
                  <span className={`badge ${
                    job.status === 'open' ? 'bg-green-100 text-green-700' :
                    job.status === 'closed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No jobs posted yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Stats</h2>
          {stats?.jobApplicationStats?.length > 0 ? (
            <div className="space-y-3">
              {stats.jobApplicationStats.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 truncate flex-1">{job.title}</p>
                  <span className="ml-4 px-3 py-1 bg-royal-100 text-royal-700 rounded-full text-sm font-medium">
                    {job.applicationCount} applications
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No application data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
