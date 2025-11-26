// src/services/salesOrderService.js
import authService from './authService';

const API_URL = 'http://72.60.79.179/api/v1/sales-orders';

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
