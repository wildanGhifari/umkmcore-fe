// src/components/reports/RevenueReportPage.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Alert } from '@mui/material';
import ProductProfitReport from './ProductProfitReport';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function RevenueReportPage() {
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
          <Tab label="Product Profit Analysis" />
          <Tab label="Profit & Loss" disabled />
          <Tab label="Detailed Revenue" disabled />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <ProductProfitReport />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Box>
          <Typography variant="body1" color="text.secondary">
            Profit & Loss report coming soon!
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            This feature will show comprehensive P&L statements with income, expenses, and net profit calculations.
          </Alert>
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Box>
          <Typography variant="body1" color="text.secondary">
            Detailed Revenue report coming soon!
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            This feature will show detailed revenue breakdowns by product, category, and time period.
          </Alert>
        </Box>
      </TabPanel>
    </Box>
  );
}

export default RevenueReportPage;
