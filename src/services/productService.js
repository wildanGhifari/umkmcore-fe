import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_URL = `${API_BASE_URL}/products`;

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

const getProducts = async (page = 1, limit = 20, search = '', category = '', activeOnly = true) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) query.append('search', search);
  if (category) query.append('category', category);
  if (activeOnly !== null) query.append('activeOnly', activeOnly.toString());

  const response = await fetch(`${API_URL}?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
};

const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create product');
  }
  return await response.json();
};

const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return await response.json();
};

const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update product');
  }
  return await response.json();
};

const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete product');
  }
  return { success: true };
};

const getProductBOM = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}/materials`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch product BOM');
  }
  return await response.json();
};

const addMaterialToBOM = async (productId, materialId, quantity, unit, notes = '') => {
  const response = await fetch(`${API_URL}/${productId}/materials`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ materialId, quantity, unit, notes }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add material to BOM');
  }
  return await response.json();
};

const updateBOMEntry = async (bomId, quantity, notes) => {
  const response = await fetch(`${API_BASE_URL}/bom/${bomId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity, notes }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update BOM entry');
  }
  return await response.json();
};

const removeMaterialFromBOM = async (bomId) => {
  const response = await fetch(`${API_BASE_URL}/bom/${bomId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove material from BOM');
  }
  return { success: true };
};

const replaceEntireBOM = async (productId, materials) => {
  // materials: [{ materialId, quantity, unit }]
  const response = await fetch(`${API_URL}/${productId}/materials`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ materials }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to replace BOM');
  }
  return await response.json();
};

const calculateProductCost = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}/cost`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to calculate product cost');
  }
  return await response.json();
};

const productService = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBOM,
  addMaterialToBOM,
  updateBOMEntry,
  removeMaterialFromBOM,
  replaceEntireBOM,
  calculateProductCost,
};

export default productService;
