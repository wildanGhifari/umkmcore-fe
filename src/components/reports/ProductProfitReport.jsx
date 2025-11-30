// src/components/reports/ProductProfitReport.jsx
import React from 'react';
import { Box, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import reportService from '../../services/reportService';

function ProductProfitReport() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['productProfitReport'],
    queryFn: () => reportService.getProductProfitReport({}),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading product profit report: {error.message}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/reports')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Product Profit Report
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Analysis of profit margins for each product sold
      </Typography>
      <Alert severity="info">Product profit analytics coming soon!</Alert>
    </Box>
  );
}

export default ProductProfitReport;
