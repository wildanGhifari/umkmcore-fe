// src/components/reports/StockMovementReport.jsx
import React, { useState } from 'react';
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
  TextField,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import reportService from '../../services/reportService';

function StockMovementReport() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [params, setParams] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['stockMovementReport', params],
    queryFn: () => reportService.getStockMovementReport(params),
    enabled: Object.keys(params).length > 0,
  });

  const handleApplyFilter = () => {
    setParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/reports')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Stock Movement Report
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Analysis of stock IN, OUT, and ADJUSTMENT transactions over a period
      </Typography>

      {/* Date Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilter}
              disabled={!startDate || !endDate}
            >
              Apply Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '40vh' }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">Error loading stock movement report: {error.message}</Alert>}

      {!isLoading && !error && Object.keys(params).length === 0 && (
        <Alert severity="info">Please select a date range to view stock movements</Alert>
      )}

      {!isLoading && !error && data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell align="right">Stock IN</TableCell>
                <TableCell align="right">Stock OUT</TableCell>
                <TableCell align="right">Adjustments</TableCell>
                <TableCell align="right">Net Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.movements?.map((movement, index) => (
                <TableRow key={index}>
                  <TableCell>{movement.materialName}</TableCell>
                  <TableCell align="right">{movement.totalIn || 0}</TableCell>
                  <TableCell align="right">{movement.totalOut || 0}</TableCell>
                  <TableCell align="right">{movement.totalAdjustment || 0}</TableCell>
                  <TableCell align="right">
                    <Typography
                      color={movement.netChange >= 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {movement.netChange > 0 ? '+' : ''}
                      {movement.netChange || 0}
                    </Typography>
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

export default StockMovementReport;
