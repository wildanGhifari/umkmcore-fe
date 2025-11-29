// src/services/categoryService.js
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/categories`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Get all categories with optional filtering
 * @param {Object} params - Query parameters
 * @param {string} params.type - Filter by type (material/product)
 * @param {string} params.search - Search by name
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Categories response with pagination
 */
const getCategories = async ({ type, search, page = 1, limit = 50 } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(type && { type }),
    ...(search && { search }),
  });

  const response = await fetch(`${API_URL}?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch categories');
  }

  return await response.json();
};

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object>} Category data
 */
const getCategoryById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch category');
  }

  return await response.json();
};

/**
 * Create new category
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.name - Category name
 * @param {string} categoryData.type - Category type (material/product)
 * @param {string} categoryData.description - Category description
 * @param {boolean} categoryData.isActive - Active status
 * @returns {Promise<Object>} Created category
 */
const createCategory = async (categoryData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create category');
  }

  return await response.json();
};

/**
 * Update category
 * @param {number} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
const updateCategory = async (id, categoryData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update category');
  }

  return await response.json();
};

/**
 * Delete category
 * @param {number} id - Category ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete category');
  }

  return await response.json();
};

const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
