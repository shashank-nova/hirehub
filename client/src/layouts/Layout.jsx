import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, Home, LogOut, Bell, User, Building2, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'candidate':
        return [
          { icon: Home, label: 'Dashboard', path: '/candidate/dashboard' },
          { icon: User, label: 'Profile', path: '/candidate/profile' },
          { icon: Briefcase, label: 'My Applications', path: '/candidate/applications' },
          { icon: Bell, label: 'Notifications', path: '/candidate/notifications' },
        ];
      case 'recruiter':
        return [
          { icon: Home, label: 'Dashboard', path: '/recruiter/dashboard' },
          { icon: Building2, label: 'Company Profile', path: '/recruiter/company' },
          { icon: Briefcase, label: 'Manage Jobs', path: '/recruiter/jobs/manage' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: User, label: 'User Management', path: '/admin/users' },
          { icon: Briefcase, label: 'Job Moderation', path: '/admin/jobs' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-navy-900 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-navy-800">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-royal-400" />
              <span className="text-xl font-bold">HireHub</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-md hover:bg-navy-800"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-navy-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-royal-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-royal-600 text-white' : 'text-gray-300 hover:bg-navy-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-navy-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <Link
                to="/jobs"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
