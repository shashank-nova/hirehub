import api from './api';

export const userService = {
  updateProfile: async (profileData) => {
    const response = await api.patch('/users/me', profileData);
    return response.data;
  },

  getCandidateProfile: async (userId) => {
    const response = await api.get(`/candidates/${userId}`);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/candidates/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadResume: async (userId) => {
    const response = await api.get(`/candidates/${userId}/resume`, {
      responseType: 'blob',
    });
    return response;
  },
};
