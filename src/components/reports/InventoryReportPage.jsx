// src/components/reports/InventoryReportPage.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import StockReport from './StockReport';
import LowStockReport from './LowStockReport';
import StockMovementReport from './StockMovementReport';

function InventoryReportPage() {
  const [selectedReport, setSelectedReport] = useState('stock');

  const reports = [
    {
      id: 'stock',
      title: 'Stock Report',
      description: 'Total materials and stock value overview',
      color: 'primary.main',
    },
    {
      id: 'lowStock',
      title: 'Low Stock Alerts',
      description: 'Materials below minimum threshold',
      color: 'warning.main',
    },
    {
      id: 'movement',
      title: 'Stock Movement',
      description: 'Transaction history and analysis',
      color: 'info.main',
    },
  ];

  const renderReport = () => {
    switch (selectedReport) {
      case 'stock':
        return <StockReport />;
      case 'lowStock':
        return <LowStockReport />;
      case 'movement':
        return <StockMovementReport />;
      default:
        return <StockReport />;
    }
  };

  return (
    <Box>
      {/* Grid of Report Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {reports.map((report) => (
          <Grid item xs={12} md={4} key={report.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selectedReport === report.id ? 2 : 0,
                borderColor: selectedReport === report.id ? report.color : 'transparent',
                transform: selectedReport === report.id ? 'translateY(-4px)' : 'none',
                boxShadow: selectedReport === report.id ? 4 : 1,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: report.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    opacity: 0.9,
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {report.title.charAt(0)}
                  </Typography>
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {report.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {report.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Selected Report Content */}
      <Box>{renderReport()}</Box>
    </Box>
  );
}

export default InventoryReportPage;
