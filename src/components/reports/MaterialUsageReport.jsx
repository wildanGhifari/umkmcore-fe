// src/components/reports/MaterialUsageReport.jsx
import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import reportService from '../../services/reportService';

function MaterialUsageReport() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['materialUsageReport'],
    queryFn: () => reportService.getMaterialUsageReport({}),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading material usage report: {error.message}</Alert>;
  }

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Consumption patterns of materials used in products
      </Typography>
      <Alert severity="info">Material usage analytics coming soon!</Alert>
    </Box>
  );
}

export default MaterialUsageReport;
