// src/services/reportService.js
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_URL = `${API_BASE_URL}/reports`;

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

const getReport = async (reportName, params) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/${reportName}?${query}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to fetch ${reportName} report`);
  }
  return await response.json();
};

const reportService = {
  getStockReport: (params) => getReport('stock', params),
  getLowStockReport: (params) => getReport('low-stock', params),
  getStockMovementReport: (params) => getReport('stock-movement', params),
  getMaterialUsageReport: (params) => getReport('material-usage', params),
  getProductProfitReport: (params) => getReport('product-profit', params),
  getForecastReport: (params) => getReport('forecast', params),
};

export default reportService;
