// src/components/reports/StockLevelsReport.jsx
import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AbstractIconContainer from '../AbstractIconContainer';

// Placeholder data
const mockStockData = {
  totalMaterials: 24,
  goodStockCount: 18,
  lowStockCount: 4,
  outOfStockCount: 2,
  materials: [
    { id: 1, name: 'Kopi Arabica', currentStock: 25, minimumStock: 10, unit: 'kg', status: 'good' },
    { id: 2, name: 'Susu UHT', currentStock: 5, minimumStock: 20, unit: 'liter', status: 'low' },
    { id: 3, name: 'Gula Pasir', currentStock: 0, minimumStock: 15, unit: 'kg', status: 'out' },
    { id: 4, name: 'Paper Cup', currentStock: 150, minimumStock: 200, unit: 'pcs', status: 'low' },
    { id: 5, name: 'Sirup Vanilla', currentStock: 8, minimumStock: 5, unit: 'botol', status: 'good' },
  ],
};

function StockLevelsReport() {
  const theme = useTheme();
  const data = mockStockData;

  const getStatusChip = (status) => {
    switch (status) {
      case 'good':
        return <Chip label="Aman" color="success" size="small" />;
      case 'low':
        return <Chip label="Rendah" color="warning" size="small" />;
      case 'out':
        return <Chip label="Habis" color="error" size="small" />;
      default:
        return null;
    }
  };

  const getStockPercentage = (current, minimum) => {
    return Math.min((current / minimum) * 100, 100);
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <AbstractIconContainer icon={Icon} bgColor={bgColor} iconColor={color} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Laporan Level Stok
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pantau ketersediaan semua bahan
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <StatCard
            title="Total Bahan"
            value={data.totalMaterials}
            icon={InventoryIcon}
            color={theme.palette.primary.main}
            bgColor={theme.palette.primaryContainer.main}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatCard
            title="Stok Aman"
            value={data.goodStockCount}
            icon={CheckIcon}
            color={theme.palette.success.main}
            bgColor={theme.palette.success.light}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatCard
            title="Stok Rendah"
            value={data.lowStockCount}
            icon={WarningIcon}
            color={theme.palette.warning.main}
            bgColor={theme.palette.warning.light}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatCard
            title="Stok Habis"
            value={data.outOfStockCount}
            icon={WarningIcon}
            color={theme.palette.error.main}
            bgColor={theme.palette.error.light}
          />
        </Grid>
      </Grid>

      {/* Stock Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detail Level Stok
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama Bahan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Stok Saat Ini</TableCell>
                  <TableCell align="center">Stok Minimum</TableCell>
                  <TableCell>Level Stok</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.materials.map((material) => {
                  const percentage = getStockPercentage(material.currentStock, material.minimumStock);
                  return (
                    <TableRow key={material.id} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {material.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(material.status)}</TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            color: material.status === 'out' ? 'error.main' : 'text.primary',
                          }}
                        >
                          {material.currentStock} {material.unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {material.minimumStock} {material.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor:
                                    material.status === 'out'
                                      ? 'error.main'
                                      : material.status === 'low'
                                      ? 'warning.main'
                                      : 'success.main',
                                },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                            {percentage.toFixed(0)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default StockLevelsReport;
