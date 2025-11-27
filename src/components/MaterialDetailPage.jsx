// src/components/MaterialDetailPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import materialService from '../services/materialService';
import StockTransactionForm from './StockTransactionForm';

function MaterialDetailPage() {
  const { id } = useParams();
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const { data: material, isLoading, error } = useQuery({
    queryKey: ['material', id],
    queryFn: () => materialService.getMaterialById(id),
  });

  const handleOpenTransactionForm = () => {
    setIsTransactionFormOpen(true);
  };

  const handleCloseTransactionForm = () => {
    setIsTransactionFormOpen(false);
  };

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" color="error">
            Error loading material: {error.message}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!material) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h6">
            Material not found.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Material Details: {material.name}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenTransactionForm}>
            Record Transaction
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/materials/edit/${material.id}`)}
            sx={{ ml: 2 }}
          >
            Edit Material
          </Button>
        </Box>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>SKU:</strong> {material.sku}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Name:</strong> {material.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Description:</strong> {material.description || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Category:</strong> {material.category || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Current Stock:</strong> {material.currentStock}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Minimum Stock:</strong> {material.minimumStock}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Unit:</strong> {material.unit || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Status:</strong> {material.status}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* TODO: Add Transaction History */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Transaction History
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2">Coming Soon...</Typography>
          </Paper>
        </Box>

        {/* TODO: Add Stock Levels Over Time Chart */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Stock Levels Over Time
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2">Coming Soon...</Typography>
          </Paper>
        </Box>

        {/* TODO: Add Products Using This Material */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Products Using This Material
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2">Coming Soon...</Typography>
          </Paper>
        </Box>
      </Box>
      <StockTransactionForm open={isTransactionFormOpen} onClose={handleCloseTransactionForm} materialId={material.id} />
    </Container>
  );
}

export default MaterialDetailPage;
