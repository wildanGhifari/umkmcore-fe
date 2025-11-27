// src/services/userService.js
import authService from './authService';

const API_URL = '/api/v1/users';

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

const getUsers = async (page = 1, limit = 10, search = '') => {
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
    throw new Error(errorData.message || 'Failed to fetch users');
  }
  return await response.json();
};

const createUser = async (userData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create user');
  }
  return await response.json();
};

const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user');
  }
  return await response.json();
};

const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user');
  }
  return await response.json();
};

const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete user');
  }
  return { success: true };
};

const changeUserRole = async (id, role) => {
  const response = await fetch(`${API_URL}/${id}/role`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to change user role');
  }
  return await response.json();
};

const resetUserPassword = async (id, newPassword) => {
  const response = await fetch(`${API_URL}/${id}/password`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to reset user password');
  }
  return { success: true };
};

const activateUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}/activate`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to activate user');
  }
  return { success: true };
};

const deactivateUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}/deactivate`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to deactivate user');
  }
  return { success: true };
};

const userService = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  resetUserPassword,
  activateUser,
  deactivateUser,
};

export default userService;