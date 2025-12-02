// src/components/reports/StockReport.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import reportService from '../../services/reportService';

function StockReport() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const { data, isLoading, error } = useQuery({
    queryKey: ['stockReport', sortBy, sortOrder],
    queryFn: () => reportService.getStockReport({ sortBy, sortOrder }),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading stock report: {error.message}</Alert>;
  }

  const summary = data?.data?.summary || {};
  const materials = data?.data?.materials || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/reports')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Stock Report
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Total Materials
              </Typography>
              <Typography variant="h4">{summary.totalMaterials || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Total Stock Value
              </Typography>
              <Typography variant="h4">
                Rp {(summary.totalValue || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Low Stock Items
              </Typography>
              <Typography variant="h4" color="warning.main">
                {summary.lowStockCount || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Out of Stock
              </Typography>
              <Typography variant="h4" color="error.main">
                {summary.outOfStockCount || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="sku">SKU</MenuItem>
            <MenuItem value="currentStock">Current Stock</MenuItem>
            <MenuItem value="totalValue">Total Value</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort Order</InputLabel>
          <Select value={sortOrder} label="Sort Order" onChange={(e) => setSortOrder(e.target.value)}>
            <MenuItem value="ASC">Ascending</MenuItem>
            <MenuItem value="DESC">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Materials Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Current Stock</TableCell>
              <TableCell align="right">Min Stock</TableCell>
              <TableCell align="right">Unit Cost</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.sku}</TableCell>
                <TableCell>{material.name}</TableCell>
                <TableCell align="right">
                  {material.currentStock} {material.unit}
                </TableCell>
                <TableCell align="right">
                  {material.minimumStock} {material.unit}
                </TableCell>
                <TableCell align="right">Rp {material.unitCost.toLocaleString()}</TableCell>
                <TableCell align="right">Rp {material.totalValue.toLocaleString()}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        material.status === 'OK'
                          ? 'success.main'
                          : material.status === 'Low'
                          ? 'warning.main'
                          : 'error.main',
                      fontWeight: 'bold',
                    }}
                  >
                    {material.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StockReport;
