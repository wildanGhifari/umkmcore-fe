import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_URL = `${API_BASE_URL}/materials`;

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

const getMaterials = async (page = 1, limit = 20, search = '', category = '', stockStatus = '') => {
  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (search) queryParams.search = search;
  if (category) queryParams.category = category;
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

// Stock Transactions

const createStockTransaction = async (transactionData) => {
  const response = await fetch(`${API_BASE_URL}/stock-transactions`, {
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

const getMaterialTransactions = async (materialId) => {
  const response = await fetch(`${API_URL}/${materialId}/transactions`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch material transactions');
  }
  return await response.json();
};

// Inventory Management

const recordStockCount = async (materialId, physicalCount, notes) => {
  const response = await fetch(`${API_BASE_URL}/inventory/stock-count`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ materialId, physicalCount, notes }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to record stock count');
  }
  return await response.json();
};

const recordDamage = async (materialId, quantity, reason, notes) => {
  const response = await fetch(`${API_BASE_URL}/inventory/damage`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ materialId, quantity, reason, notes }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to record damage');
  }
  return await response.json();
};

const getInventoryValuation = async () => {
  const response = await fetch(`${API_BASE_URL}/inventory/valuation`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch inventory valuation');
  }
  return await response.json();
};

const getStockLevels = async (lowStockOnly = false, category = '') => {
  const query = new URLSearchParams();
  if (lowStockOnly) query.append('lowStockOnly', 'true');
  if (category) query.append('category', category);

  const response = await fetch(`${API_BASE_URL}/inventory/stock-levels?${query}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch stock levels');
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
  getMaterialTransactions,
  recordStockCount,
  recordDamage,
  getInventoryValuation,
  getStockLevels,
};

export default materialService;