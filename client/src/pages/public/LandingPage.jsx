import { Link } from 'react-router-dom';
import { Briefcase, Users, Building2, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with top employers and discover opportunities that match your skills and ambitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="bg-royal-600 hover:bg-royal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Browse Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="bg-white text-navy-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-royal-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Active Job Listings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-royal-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50,000+</h3>
              <p className="text-gray-600">Registered Candidates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-royal-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">5,000+</h3>
              <p className="text-gray-600">Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HireHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make job searching and hiring simple, efficient, and effective for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-12 w-12 text-royal-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Our intelligent algorithm matches you with jobs that fit your skills and experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-12 w-12 text-royal-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Application</h3>
              <p className="text-gray-600">
                Apply to multiple jobs with a single click and track your applications in real-time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-12 w-12 text-royal-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-gray-600">
                Connect directly with recruiters and get updates on your application status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers who have found success on HireHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-royal-600 hover:bg-royal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Sign Up as Candidate
            </Link>
            <Link
              to="/register"
              className="bg-white text-navy-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
