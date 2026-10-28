import api from './api';

export const applicationService = {
  applyForJob: async (jobId, coverLetter) => {
    const response = await api.post(`/jobs/${jobId}/applications`, { coverLetter });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/me');
    return response.data;
  },

  getJobApplications: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status, notes) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status, notes });
    return response.data;
  },

  withdrawApplication: async (applicationId) => {
    const response = await api.post(`/applications/${applicationId}/withdraw`);
    return response.data;
  },
};
