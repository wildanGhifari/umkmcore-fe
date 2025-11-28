// src/services/salesOrderService.js
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_URL = `${API_BASE_URL}/sales-orders`;

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

const createSalesOrder = async (orderData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create sales order');
  }
  return await response.json();
};

const salesOrderService = {
  createSalesOrder,
};

export default salesOrderService;
