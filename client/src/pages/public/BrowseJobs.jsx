import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { MapPin, DollarSign, Clock, Building2, Search, Filter } from 'lucide-react';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    employmentType: '',
    experienceLevel: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        ...filters,
      };
      const response = await jobService.getJobs(params);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Jobs</h1>

        {/* Search and filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, skills, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500"
              />
            </div>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500"
            >
              <option value="">All Locations</option>
              <option value="San Francisco">San Francisco</option>
              <option value="New York">New York</option>
              <option value="Remote">Remote</option>
            </select>
            <select
              value={filters.employmentType}
              onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500"
            >
              <option value="">All Levels</option>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-navy-600" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/jobs/${job._id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-royal-600 transition-colors">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mt-1">{job.company?.name}</p>
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.employmentType}
                        </span>
                        {job.salaryRange?.min && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}/{job.salaryRange.period}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills?.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-royal-100 text-royal-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="btn btn-primary text-center"
                  >
                    View Details
                  </Link>
                  <span className="text-xs text-gray-500 text-center">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
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

export default BrowseJobs;
