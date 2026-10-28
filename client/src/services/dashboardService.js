import api from './api';

export const dashboardService = {
  getCandidateDashboard: async () => {
    const response = await api.get('/dashboard/candidate');
    return response.data;
  },

  getRecruiterDashboard: async () => {
    const response = await api.get('/dashboard/recruiter');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },
};
