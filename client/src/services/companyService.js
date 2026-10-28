import api from './api';

export const companyService = {
  createOrUpdateCompany: async (companyData) => {
    const response = await api.post('/company', companyData);
    return response.data;
  },

  getCompany: async () => {
    const response = await api.get('/company');
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/company/${id}`);
    return response.data;
  },
};
