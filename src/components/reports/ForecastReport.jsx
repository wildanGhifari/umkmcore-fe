// src/components/reports/ForecastReport.jsx
import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
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
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Future predictions for sales and inventory needs based on historical data
      </Typography>
      <Alert severity="info">Sales and inventory forecasting coming soon!</Alert>
    </Box>
  );
}

export default ForecastReport;
