// src/components/stock/LowStockAlertsPage.jsx
import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';

// Placeholder data - will be replaced with API
const mockLowStockData = [
  {
    id: 1,
    name: 'Arabica Coffee',
    sku: 'MAT-001',
    currentStock: 0,
    minimumStock: 10,
    unit: 'kg',
    status: 'out-of-stock',
  },
  {
    id: 2,
    name: 'UHT Milk',
    sku: 'MAT-002',
    currentStock: 5,
    minimumStock: 20,
    unit: 'liter',
    status: 'critical',
  },
  {
    id: 3,
    name: 'Sugar',
    sku: 'MAT-003',
    currentStock: 8,
    minimumStock: 15,
    unit: 'kg',
    status: 'low',
  },
  {
    id: 4,
    name: 'Paper Cup',
    sku: 'MAT-004',
    currentStock: 150,
    minimumStock: 200,
    unit: 'pcs',
    status: 'low',
  },
];

function LowStockAlertsPage() {
  const outOfStockCount = mockLowStockData.filter((item) => item.status === 'out-of-stock').length;
  const criticalCount = mockLowStockData.filter((item) => item.status === 'critical').length;
  const lowCount = mockLowStockData.filter((item) => item.status === 'low').length;

  const getStatusChip = (status) => {
    switch (status) {
      case 'out-of-stock':
        return <Chip label="Out of Stock" color="error" size="small" />;
      case 'critical':
        return <Chip label="Critical" color="warning" size="small" />;
      case 'low':
        return <Chip label="Low" color="info" size="small" />;
      default:
        return null;
    }
  };

  const getStockPercentage = (current, minimum) => {
    return (current / minimum) * 100;
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 1 }}>
        Low Stock Alerts
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Materials that need to be restocked soon
      </Typography>

      {/* Summary Alert */}
      {outOfStockCount > 0 && (
        <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
          <strong>{outOfStockCount} materials out of stock!</strong> Please restock immediately to avoid operational disruptions.
        </Alert>
      )}
      {criticalCount > 0 && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
          <strong>{criticalCount} materials at critical level!</strong> Stock almost depleted, plan restocking soon.
        </Alert>
      )}

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, borderLeft: 4, borderColor: 'error.main' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Out of Stock
            </Typography>
            <Typography variant="h4" sx={{ color: 'error.main' }}>
              {outOfStockCount}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, borderLeft: 4, borderColor: 'warning.main' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Critical Stock
            </Typography>
            <Typography variant="h4" sx={{ color: 'warning.main' }}>
              {criticalCount}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, borderLeft: 4, borderColor: 'info.main' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Low Stock
            </Typography>
            <Typography variant="h4" sx={{ color: 'info.main' }}>
              {lowCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Low Stock Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Materials to Restock
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Material Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Current Stock</TableCell>
                  <TableCell align="center">Minimum Stock</TableCell>
                  <TableCell>Stock Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockLowStockData.map((item) => {
                  const percentage = getStockPercentage(item.currentStock, item.minimumStock);
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{getStatusChip(item.status)}</TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            color: item.currentStock === 0 ? 'error.main' : 'text.primary',
                          }}
                        >
                          {item.currentStock} {item.unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {item.minimumStock} {item.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(percentage, 100)}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor:
                                    item.status === 'out-of-stock'
                                      ? 'error.main'
                                      : item.status === 'critical'
                                      ? 'warning.main'
                                      : 'info.main',
                                },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                            {percentage.toFixed(0)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LowStockAlertsPage;
