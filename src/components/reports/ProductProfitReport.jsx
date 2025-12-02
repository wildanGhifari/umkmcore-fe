// src/components/reports/ProductProfitReport.jsx
import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import reportService from '../../services/reportService';

function ProductProfitReport() {
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
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Analysis of profit margins for each product sold
      </Typography>
      <Alert severity="info">Product profit analytics coming soon!</Alert>
    </Box>
  );
}

export default ProductProfitReport;
