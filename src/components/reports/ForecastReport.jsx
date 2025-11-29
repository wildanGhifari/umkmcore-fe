// src/components/reports/ForecastReport.jsx
import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tantml:query';
import reportService from '../../services/reportService';

function ForecastReport() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['forecastReport'],
    queryFn: () => reportService.getForecastReport({}),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading forecast report: {error.message}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Sales & Inventory Forecast
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Future predictions for sales and inventory needs
      </Typography>
      <Alert severity="info">Sales and inventory forecasting coming soon!</Alert>
    </Box>
  );
}

export default ForecastReport;
