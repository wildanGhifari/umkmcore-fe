// src/components/reports/LowStockReport.jsx
import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import reportService from '../../services/reportService';

function LowStockReport() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lowStockReport'],
    queryFn: () => reportService.getLowStockReport({}),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading low stock report: {error.message}</Alert>;
  }

  const materials = data?.data?.materials || [];

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Materials that are below their minimum stock threshold
      </Typography>

      {materials.length === 0 ? (
        <Alert severity="success">
          All materials are adequately stocked! No low stock items found.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Priority</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Current Stock</TableCell>
                <TableCell align="right">Min Stock</TableCell>
                <TableCell align="right">Shortage</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell align="right">Restock Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>
                    <Chip
                      icon={<WarningIcon />}
                      label={material.priority}
                      color={
                        material.priority === 'Critical'
                          ? 'error'
                          : material.priority === 'High'
                          ? 'warning'
                          : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{material.sku}</TableCell>
                  <TableCell>{material.name}</TableCell>
                  <TableCell align="right">
                    {material.currentStock} {material.unit}
                  </TableCell>
                  <TableCell align="right">
                    {material.minimumStock} {material.unit}
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="error" fontWeight="bold">
                      {material.shortage} {material.unit}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">Rp {material.unitCost.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    Rp {material.restockCost.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default LowStockReport;
