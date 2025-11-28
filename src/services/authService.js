// src/services/authService.js
const API_URL = '/api/v1/auth';

const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const responseData = await response.json();
  // Backend returns: { success: true, data: { user, token } }
  const { data } = responseData;
  if (data && data.token) {
    // Store the flat structure: { ...user, token }
    const userWithToken = { ...data.user, token: data.token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    return userWithToken;
  }
  throw new Error('Invalid login response format');
};

const register = async (storeName, storeCode, fullName, username, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ storeName, storeCode, fullName, username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default authService;
