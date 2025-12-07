// src/components/DashboardPage.jsx
import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Button,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import reportService from '../services/reportService';
import materialService from '../services/materialService';
import productService from '../services/productService';
import salesOrderService from '../services/salesOrderService';
import AbstractIconContainer from './AbstractIconContainer';
import { useTheme } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

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
    queryKey: ['materials', 1, 1], // Lightweight fetch for count
    queryFn: () => materialService.getMaterials(1, 1),
  });

  const { data: productsData } = useQuery({
    queryKey: ['products', 1, 1], // Lightweight fetch for count
    queryFn: () => productService.getProducts(1, 1),
  });

  const { data: salesData } = useQuery({
    queryKey: ['salesOrders', 1, 10], // Fetch recent sales
    queryFn: () => salesOrderService.getSalesOrders(1, 10),
  });

  const isLoading = stockLoading || lowStockLoading;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const stockSummary = stockReport?.data?.summary || {};
  const lowStockItems = lowStockReport?.data?.materials || [];
  const totalMaterials = materialsData?.pagination?.total || 0;
  const totalProducts = productsData?.pagination?.total || 0;
  const totalSalesCount = salesData?.pagination?.total || 0;
  const recentSales = salesData?.data || [];

  // Mock data for charts (until APIs are fully ready for historical data)
  const salesTrendData = [
    { day: 'Mon', sales: 400000 },
    { day: 'Tue', sales: 300000 },
    { day: 'Wed', sales: 550000 },
    { day: 'Thu', sales: 450000 },
    { day: 'Fri', sales: 700000 },
    { day: 'Sat', sales: 900000 },
    { day: 'Sun', sales: 650000 },
  ];

  const stockStatusData = [
    { name: 'In Stock', value: totalMaterials - lowStockItems.length, color: theme.palette.success.main },
    { name: 'Low Stock', value: lowStockItems.length, color: theme.palette.warning.main },
    { name: 'Out of Stock', value: stockSummary.outOfStockCount || 0, color: theme.palette.error.main },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.surfaceContainer?.main || '#f5f5f5'} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 4,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <AbstractIconContainer
            icon={Icon}
            bgColor={theme.palette[color].container || theme.palette[color].light}
            iconColor={theme.palette[color].main}
          />
          {trend && (
            <Chip
              label={trend}
              size="small"
              color={trend.includes('+') ? 'success' : 'error'}
              variant="soft"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
        <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
          {value}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of your store's performance today.
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={() => navigate('/pos')}
            size="large"
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Open POS
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={ShoppingCartIcon}
            color="primary"
            subtitle="Active items in catalog"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Materials"
            value={totalMaterials}
            icon={InventoryIcon}
            color="secondary"
            subtitle={`Valued at Rp ${(stockSummary.totalValue || 0).toLocaleString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={lowStockItems.length}
            icon={WarningIcon}
            color="warning"
            subtitle="Requires attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={totalSalesCount}
            icon={TrendingUpIcon}
            color="success"
            subtitle="Orders recorded"
          />
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Weekly Sales Trend
              </Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `Rp ${value / 1000}k`} />
                <Tooltip
                  cursor={{ fill: theme.palette.action.hover }}
                  formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Sales']}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[3] }}
                />
                <Bar dataKey="sales" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Stock Status
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stockStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'Items']}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[3] }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Low Stock List */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <WarningIcon color="warning" />
                <Typography variant="h6" fontWeight="bold">
                  Low Stock Alerts
                </Typography>
                <Chip label={`${lowStockItems.length} Items`} color="warning" size="small" sx={{ ml: 1, fontWeight: 'bold' }} />
              </Box>
              <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/stock/alerts')}>
                View All
              </Button>
            </Box>

            {lowStockItems.length > 0 ? (
              <Grid container spacing={2}>
                {lowStockItems.slice(0, 4).map((material) => (
                  <Grid item xs={12} sm={6} md={3} key={material.id}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            {material.name}
                          </Typography>
                          <Chip
                            label={material.currentStock === 0 ? 'Empty' : 'Low'}
                            color={material.currentStock === 0 ? 'error' : 'warning'}
                            size="small"
                            sx={{ height: 20, fontSize: '0.625rem' }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          SKU: {material.sku}
                        </Typography>
                        <Box
                          sx={{
                            bgcolor: theme.palette.background.default,
                            p: 1.5,
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Remaining
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {material.currentStock} / {material.minimumStock} {material.unit}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                All stock levels are healthy!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
