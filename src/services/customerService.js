import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_URL = `${API_BASE_URL}/customers`;

const getAuthHeaders = () => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

const getCustomers = async (page = 1, limit = 10, search = '') => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    query.append('search', search);
  }

  const response = await fetch(`${API_URL}?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch customers');
  }
  return await response.json();
};

const customerService = {
  getCustomers,
};

export default customerService;
