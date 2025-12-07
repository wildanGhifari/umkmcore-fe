// src/services/authService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_URL = `${API_BASE_URL}/auth`;

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;
  
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    // If parsing fails, we assume it's not JSON
    data = {};
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || response.statusText || 'Request failed';
    throw new Error(errorMessage);
  }

  return data;
};

const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const responseData = await handleResponse(response);
  
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
  const response = await fetch(`${API_URL}/register-company`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData),
  });

  return handleResponse(response);
};

const checkUsername = async (username) => {
  const response = await fetch(`${API_URL}/check-username/${username}`);
  return handleResponse(response);
};

const checkCompanyCode = async (code) => {
  const response = await fetch(`${API_URL}/check-company-code/${code}`);
  return handleResponse(response);
};

const suggestCompanyCode = async (companyName) => {
  const response = await fetch(`${API_URL}/suggest-company-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyName }),
  });
  return handleResponse(response);
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
