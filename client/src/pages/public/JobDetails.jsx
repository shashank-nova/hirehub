import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { MapPin, DollarSign, Clock, Building2, ArrowLeft, Bookmark } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJob(id);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'candidate') {
      alert('Only candidates can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await applicationService.applyForJob(id, '');
      alert('Application submitted successfully!');
      navigate('/candidate/applications');
    } catch (error) {
      console.error('Error applying:', error);
      alert(error.response?.data?.message || 'Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
        <p className="mt-4 text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Job not found</h3>
        <Link to="/jobs" className="text-royal-600 hover:underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/jobs" className="inline-flex items-center text-royal-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="h-8 w-8 text-navy-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-lg text-gray-600">{job.company?.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <MapPin className="h-4 w-4 text-gray-600" />
            {job.location}
          </span>
          <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <Clock className="h-4 w-4 text-gray-600" />
            {job.employmentType}
          </span>
          <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <span className="text-gray-600">Experience:</span>
            {job.experienceLevel}
          </span>
          {job.salaryRange?.min && (
            <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-gray-600" />
              ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}/{job.salaryRange.period}
            </span>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-royal-100 text-royal-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {job.deadline && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Application Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleApply}
            disabled={applying || job.status !== 'open'}
            className="btn btn-primary flex-1"
          >
            {applying ? 'Submitting...' : job.status !== 'open' ? 'Closed' : 'Apply Now'}
          </button>
          <button className="btn btn-secondary">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
