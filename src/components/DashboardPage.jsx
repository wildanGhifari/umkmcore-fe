// src/components/DashboardPage.jsx
import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import reportService from '../services/reportService';
import materialService from '../services/materialService';
import productService from '../services/productService';
import salesOrderService from '../services/salesOrderService';
import userService from '../services/userService';

function DashboardPage() {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: stockReport, isLoading: stockLoading } = useQuery({
    queryKey: ['stockReport'],
    queryFn: () => reportService.getStockReport({}),
  });

  const { data: lowStockReport, isLoading: lowStockLoading } = useQuery({
    queryKey: ['lowStockReport'],
    queryFn: () => reportService.getLowStockReport({}),
  });

  const { data: materialsData } = useQuery({
    queryKey: ['materials', 1, 10],
    queryFn: () => materialService.getMaterials(1, 10),
  });

  const { data: productsData } = useQuery({
    queryKey: ['products', 1, 10],
    queryFn: () => productService.getProducts(1, 10),
  });

  const { data: salesData } = useQuery({
    queryKey: ['salesOrders', 1, 10],
    queryFn: () => salesOrderService.getSalesOrders(1, 10),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', 1, 10],
    queryFn: () => userService.getUsers(1, 10),
    enabled: user?.role === 'admin' || user?.role === 'manager',
  });

  const isLoading = stockLoading || lowStockLoading;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const stockSummary = stockReport?.data?.summary || {};
  const lowStockItems = lowStockReport?.data?.materials || [];
  const totalMaterials = materialsData?.pagination?.total || 0;
  const totalProducts = productsData?.pagination?.total || 0;
  const totalSales = salesData?.pagination?.total || 0;
  const totalUsers = usersData?.pagination?.total || 0;

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: `${color}.main`, fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.fullName || user?.username}! Here's what's happening today.
      </Typography>

      <Grid container spacing={3}>
        {/* Inventory Overview */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Materials"
            value={totalMaterials}
            icon={InventoryIcon}
            color="primary"
            subtitle={`Stock Value: Rp ${(stockSummary.totalValue || 0).toLocaleString()}`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Low Stock Items"
            value={lowStockItems.length}
            icon={WarningIcon}
            color="warning"
            subtitle={`Out of Stock: ${stockSummary.outOfStockCount || 0}`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={ShoppingCartIcon}
            color="success"
            subtitle="Active products"
          />
        </Grid>

        {/* Sales & Performance */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Sales Orders"
            value={totalSales}
            icon={TrendingUpIcon}
            color="info"
            subtitle="All time"
          />
        </Grid>

        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={PeopleIcon}
              color="secondary"
              subtitle="Active staff members"
            />
          </Grid>
        )}

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="warning" />
                  Low Stock Alerts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  The following materials are running low and need restocking:
                </Typography>
                <Box>
                  {lowStockItems.slice(0, 5).map((material) => (
                    <Box
                      key={material.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      <Box>
                        <Typography variant="body1">{material.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {material.sku}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="body1"
                          color={material.currentStock === 0 ? 'error' : 'warning.main'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {material.currentStock} {material.unit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Min: {material.minimumStock} {material.unit}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                {lowStockItems.length > 5 && (
                  <Typography variant="body2" color="primary" sx={{ mt: 2, cursor: 'pointer' }}>
                    View all {lowStockItems.length} low stock items →
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DashboardPage;
