import authService from './authService';

const API_URL = '/api/v1/materials';

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

const getMaterials = async (page = 1, limit = 10, search = '', category = '', stockStatus = '') => {
  const offset = (page - 1) * limit;
  const queryParams = {
    offset: offset.toString(),
    limit: limit.toString(),
  };

  if (search) {
    queryParams.search = search;
  }
  if (category) {
    queryParams.category = category;
  }
  if (stockStatus === 'Low' || stockStatus === 'Out of Stock') {
    queryParams.lowStockOnly = 'true';
  }

  const query = new URLSearchParams(queryParams).toString();

  const response = await fetch(`${API_URL}?${query}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch materials');
  }
  return await response.json();
};

const createMaterial = async (materialData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(materialData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create material');
  }
  return await response.json();
};

const getMaterialById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch material');
  }
  return await response.json();
};

const updateMaterial = async (id, materialData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(materialData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update material');
  }
  return await response.json();
};

const deleteMaterial = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete material');
  }
  return { success: true };
};

const createStockTransaction = async (transactionData) => {
  const response = await fetch('/api/v1/stock-transactions', { // Using direct URL as API_URL is for /materials
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create stock transaction');
  }
  return await response.json();
};

const materialService = {
  getMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  createStockTransaction,
};

export default materialService;