import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Users, Briefcase, FileText, Building2, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getAdminDashboard();
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.totalUsers || 0}
              </p>
            </div>
            <Users className="h-12 w-12 text-royal-600" />
          </div>
        </div>

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
              <p className="text-gray-600 text-sm">Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.totalApplications || 0}
              </p>
            </div>
            <FileText className="h-12 w-12 text-royal-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Companies</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.stats?.totalCompanies || 0}
              </p>
            </div>
            <Building2 className="h-12 w-12 text-royal-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Distribution by Role</h2>
          <div className="space-y-3">
            {Object.entries(stats?.stats?.userByRole || {}).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="capitalize text-gray-700">{role}</span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Status Distribution</h2>
          <div className="space-y-3">
            {Object.entries(stats?.stats?.jobByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize text-gray-700">{status}</span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
