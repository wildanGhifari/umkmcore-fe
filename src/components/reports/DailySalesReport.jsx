// src/components/reports/DailySalesReport.jsx
import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AbstractIconContainer from '../AbstractIconContainer';

// Placeholder data
const mockDailySales = {
  date: '2025-12-03',
  totalRevenue: 1450000,
  totalTransactions: 42,
  avgTransactionValue: 34524,
  topProducts: [
    { name: 'Cappuccino', quantity: 15, revenue: 525000 },
    { name: 'Latte', quantity: 12, revenue: 420000 },
    { name: 'Americano', quantity: 8, revenue: 240000 },
    { name: 'Espresso', quantity: 7, revenue: 175000 },
  ],
};

function DailySalesReport() {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const data = mockDailySales;

  const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <AbstractIconContainer icon={Icon} bgColor={bgColor} iconColor={color} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Daily Sales Report
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor sales performance every day
        </Typography>
      </Box>

      {/* Date Picker */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ width: 250 }}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Sales"
            value={`Rp ${data.totalRevenue.toLocaleString('id-ID')}`}
            subtitle={new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
            icon={TrendingUpIcon}
            color={theme.palette.success.main}
            bgColor={theme.palette.success.light}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Transactions"
            value={data.totalTransactions}
            subtitle="Total orders"
            icon={ReceiptIcon}
            color={theme.palette.primary.main}
            bgColor={theme.palette.primaryContainer.main}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Average per Transaction"
            value={`Rp ${data.avgTransactionValue.toLocaleString('id-ID')}`}
            subtitle="Average value"
            icon={CartIcon}
            color={theme.palette.info.main}
            bgColor={theme.palette.info.light}
          />
        </Grid>
      </Grid>

      {/* Top Products Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Best Sellers
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="center">Quantity Sold</TableCell>
                  <TableCell align="right">Total Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topProducts.map((product, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#CD7F32' : 'grey.300',
                          fontWeight: 'bold',
                          color: index < 3 ? 'white' : 'text.primary',
                        }}
                      >
                        #{index + 1}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {product.quantity} cup
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        Rp {product.revenue.toLocaleString('id-ID')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DailySalesReport;
