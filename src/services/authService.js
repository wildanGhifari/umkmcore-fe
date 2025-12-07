// src/services/authService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_URL = `${API_BASE_URL}/auth`;

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

const register = async (registrationData) => {
  // registrationData should match the structure:
  // {
  //   company: { companyName, ... },
  //   store: { name, ... },
  //   admin: { username, password, fullName, email }
  // }
  const response = await fetch(`${API_URL}/register-company`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
};

const checkUsername = async (username) => {
  const response = await fetch(`${API_URL}/check-username/${username}`);
  if (!response.ok) {
    throw new Error('Failed to check username');
  }
  return response.json();
};

const checkCompanyCode = async (code) => {
  const response = await fetch(`${API_URL}/check-company-code/${code}`);
  if (!response.ok) {
    throw new Error('Failed to check company code');
  }
  return response.json();
};

const suggestCompanyCode = async (companyName) => {
  const response = await fetch(`${API_URL}/suggest-company-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyName }),
  });
  if (!response.ok) {
    throw new Error('Failed to suggest company code');
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
  checkUsername,
  checkCompanyCode,
  suggestCompanyCode,
  logout,
  getCurrentUser,
};

export default authService;
