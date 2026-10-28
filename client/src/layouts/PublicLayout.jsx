import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Briefcase, User, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-royal-400" />
                <span className="text-xl font-bold">HireHub</span>
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-royal-400 transition-colors">Home</Link>
              <Link to="/jobs" className="hover:text-royal-400 transition-colors">Browse Jobs</Link>
              <Link to="/about" className="hover:text-royal-400 transition-colors">About</Link>
              <Link to="/contact" className="hover:text-royal-400 transition-colors">Contact</Link>

              {user ? (
                <Link
                  to={`/${user.role}/dashboard`}
                  className="flex items-center space-x-2 bg-royal-600 hover:bg-royal-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hover:text-royal-400 transition-colors">Login</Link>
                  <Link
                    to="/register"
                    className="bg-royal-600 hover:bg-royal-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md hover:bg-navy-800"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md hover:bg-navy-700">Home</Link>
              <Link to="/jobs" className="block px-3 py-2 rounded-md hover:bg-navy-700">Browse Jobs</Link>
              <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-navy-700">About</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-navy-700">Contact</Link>
              {user ? (
                <Link to={`/${user.role}/dashboard`} className="block px-3 py-2 rounded-md hover:bg-navy-700">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-navy-700">Login</Link>
                  <Link to="/register" className="block px-3 py-2 rounded-md hover:bg-navy-700">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6 text-royal-400" />
                <span className="text-lg font-bold">HireHub</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting talent with opportunity. Your next career move starts here.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/register" className="hover:text-white">Post a Job</Link></li>
                <li><Link to="/about" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/contact" className="hover:text-white">Employer Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 HireHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
