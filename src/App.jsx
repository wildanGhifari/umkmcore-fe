import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, GlobalStyles, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import DashboardPage from './components/DashboardPage';
import MaterialsPage from './components/MaterialsPage';
import MaterialDetailPage from './components/MaterialDetailPage';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetail from './components/ProductDetail';
import EditProduct from './components/EditProduct';
import UserManagementPage from './components/UserManagementPage';
import CategoryManagement from './components/CategoryManagement';
import ReportsPage from './components/ReportsPage';
import POSPage from './components/POSPage';
import Layout from './components/Layout';
import StockReport from './components/reports/StockReport';
import LowStockReport from './components/reports/LowStockReport';
import StockMovementReport from './components/reports/StockMovementReport';
import MaterialUsageReport from './components/reports/MaterialUsageReport';
import ProductProfitReport from './components/reports/ProductProfitReport';
import ForecastReport from './components/reports/ForecastReport';
import StoreManagementPage from './components/StoreManagementPage';
import InventoryReportPage from './components/reports/InventoryReportPage';
import RevenueReportPage from './components/reports/RevenueReportPage';
// Money Tracker Pages
import CashInPage from './components/money/CashInPage';
import CashOutPage from './components/money/CashOutPage';
import BalancePage from './components/money/BalancePage';
// Stock Alerts
import LowStockAlertsPage from './components/stock/LowStockAlertsPage';
// Simplified Reports
import DailySalesReport from './components/reports/DailySalesReport';
import StockLevelsReport from './components/reports/StockLevelsReport';
import BestSellersReport from './components/reports/BestSellersReport';
// Settings Pages
import BusinessInfoPage from './components/settings/BusinessInfoPage';
import NotificationsPage from './components/settings/NotificationsPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: {
            backgroundColor: theme.palette.background.default,
            overscrollBehavior: 'none',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials"
          element={
            <ProtectedRoute>
              <MaterialsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials/:id"
          element={
            <ProtectedRoute>
              <MaterialDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <POSPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/stock"
          element={
            <ProtectedRoute>
              <StockReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/low-stock"
          element={
            <ProtectedRoute>
              <LowStockReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/stock-movement"
          element={
            <ProtectedRoute>
              <StockMovementReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/material-usage"
          element={
            <ProtectedRoute>
              <MaterialUsageReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/product-profit"
          element={
            <ProtectedRoute>
              <ProductProfitReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/forecast"
          element={
            <ProtectedRoute>
              <ForecastReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores"
          element={
            <ProtectedRoute>
              <StoreManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/inventory"
          element={
            <ProtectedRoute>
              <InventoryReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/revenue"
          element={
            <ProtectedRoute>
              <RevenueReportPage />
            </ProtectedRoute>
          }
        />
        {/* Money Tracker Routes */}
        <Route
          path="/money/cash-in"
          element={
            <ProtectedRoute>
              <CashInPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/money/cash-out"
          element={
            <ProtectedRoute>
              <CashOutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/money/balance"
          element={
            <ProtectedRoute>
              <BalancePage />
            </ProtectedRoute>
          }
        />
        {/* Stock Alerts Route */}
        <Route
          path="/stock/alerts"
          element={
            <ProtectedRoute>
              <LowStockAlertsPage />
            </ProtectedRoute>
          }
        />
        {/* Simplified Report Routes */}
        <Route
          path="/reports/daily-sales"
          element={
            <ProtectedRoute>
              <DailySalesReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/stock-levels"
          element={
            <ProtectedRoute>
              <StockLevelsReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/best-sellers"
          element={
            <ProtectedRoute>
              <BestSellersReport />
            </ProtectedRoute>
          }
        />
        {/* Settings Routes */}
        <Route
          path="/settings/business"
          element={
            <ProtectedRoute>
              <BusinessInfoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        {/* Roles Page - Placeholder */}
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <div style={{ padding: '24px' }}>
                <h1>Roles Management</h1>
                <p>This page is coming soon.</p>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
