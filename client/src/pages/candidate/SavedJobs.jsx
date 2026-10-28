import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Bookmark, Building2 } from 'lucide-react';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - would connect to API in production
    setSavedJobs([]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
        <p className="mt-4 text-gray-600">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-600 mb-4">Save jobs you're interested in to view them later</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {savedJobs.map((savedJob) => (
            <div key={savedJob._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-navy-600" />
                </div>
                <div className="flex-1">
                  <Link to={`/jobs/${savedJob.job._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-royal-600">
                      {savedJob.job.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600">{savedJob.job.company?.name}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {savedJob.job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {savedJob.job.employmentType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
