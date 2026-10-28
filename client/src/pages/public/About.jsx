import { Briefcase, Target, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About HireHub</h1>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          HireHub is dedicated to connecting talented individuals with meaningful career opportunities.
          We believe that the right job can transform lives, and the right candidate can transform businesses.
        </p>
        <p className="text-gray-700">
          Founded in 2024, we've grown from a small startup to a platform serving thousands of job seekers
          and employers worldwide. Our intelligent matching algorithm and user-friendly interface make the
          job search and hiring process efficient and enjoyable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Target className="h-12 w-12 text-royal-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-gray-600 text-sm">
            To be the world's most trusted platform for career growth and talent acquisition.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="h-12 w-12 text-royal-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Values</h3>
          <p className="text-gray-600 text-sm">
            Integrity, innovation, and putting people first in everything we do.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Briefcase className="h-12 w-12 text-royal-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Impact</h3>
          <p className="text-gray-600 text-sm">
            Helping thousands find their dream jobs and companies build great teams.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-700 mb-4">
          Have questions or feedback? We'd love to hear from you.
        </p>
        <p className="text-gray-600">
          Email: support@hirehub.com<br />
          Phone: (555) 123-4567<br />
          Address: 123 Career Street, San Francisco, CA 94102
        </p>
      </div>
    </div>
  );
};

export default About;
