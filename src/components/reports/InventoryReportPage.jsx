// src/components/reports/InventoryReportPage.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import StockReport from './StockReport';
import LowStockReport from './LowStockReport';
import StockMovementReport from './StockMovementReport';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function InventoryReportPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Stock Report" />
          <Tab label="Low Stock Alerts" />
          <Tab label="Stock Movement" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <StockReport />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <LowStockReport />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <StockMovementReport />
      </TabPanel>
    </Box>
  );
}

export default InventoryReportPage;
