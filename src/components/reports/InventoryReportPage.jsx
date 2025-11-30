// src/components/reports/InventoryReportPage.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

function InventoryReportPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory Reports
      </Typography>
      <Typography variant="body1">
        This page will contain the Stock, Low Stock, and Stock Movement reports.
      </Typography>
    </Box>
  );
}

export default InventoryReportPage;
