import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { ArrowLeft } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    skills: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        salaryRange: {
          min: parseInt(formData.salaryMin) || null,
          max: parseInt(formData.salaryMax) || null,
          currency: 'USD',
          period: 'yearly',
        },
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      };
      delete jobData.salaryMin;
      delete jobData.salaryMax;

      await jobService.createJob(jobData);
      navigate('/recruiter/jobs/manage');
    } catch (error) {
      console.error('Error creating job:', error);
      alert(error.response?.data?.message || 'Error creating job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/recruiter/jobs/manage')}
        className="flex items-center text-royal-600 hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Job</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              className="input"
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type *
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="input"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level *
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="input"
            >
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Salary (USD/year)
            </label>
            <input
              id="salaryMin"
              name="salaryMin"
              type="number"
              value={formData.salaryMin}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 80000"
            />
          </div>

          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Salary (USD/year)
            </label>
            <input
              id="salaryMax"
              name="salaryMax"
              type="number"
              value={formData.salaryMax}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 120000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma-separated)
          </label>
          <input
            id="skills"
            name="skills"
            type="text"
            value={formData.skills}
            onChange={handleChange}
            className="input"
            placeholder="e.g., JavaScript, React, Node.js, MongoDB"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            required
            value={formData.description}
            onChange={handleChange}
            className="input"
            placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
            Requirements *
          </label>
          <textarea
            id="requirements"
            name="requirements"
            rows="4"
            required
            value={formData.requirements}
            onChange={handleChange}
            className="input"
            placeholder="List the required qualifications, experience, and skills..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/recruiter/jobs/manage')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
