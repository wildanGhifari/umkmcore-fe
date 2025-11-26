// src/components/StockTransactionForm.jsx
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import materialService from '../services/materialService';

function StockTransactionForm({ open, onClose, materialId: initialMaterialId = '' }) {
  const queryClient = useQueryClient();
  const [transactionType, setTransactionType] = useState('IN');
  const [selectedMaterial, setSelectedMaterial] = useState(initialMaterialId);
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  // Fetch materials for dropdown
  const { data: materials, isLoading: materialsLoading, error: materialsError } = useQuery({
    queryKey: ['allMaterials'],
    queryFn: () => materialService.getMaterials(1, 1000), // Fetch all for simplicity
    select: (data) => data.data,
  });

  const createTransactionMutation = useMutation({
    mutationFn: materialService.createStockTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['materials']); // Invalidate materials list
      queryClient.invalidateQueries(['material', selectedMaterial]); // Invalidate specific material
      onClose();
      resetForm();
    },
    onError: (err) => {
      setError(err.message || 'Failed to create transaction');
    },
  });

  const handleSubmit = async () => {
    setError(null);
    if (!selectedMaterial || !quantity || quantity <= 0) {
      setError('Please select a material and enter a valid quantity.');
      return;
    }

    const payload = {
      materialId: selectedMaterial,
      type: transactionType,
      quantity: parseFloat(quantity),
      description,
    };

    createTransactionMutation.mutate(payload);
  };

  const resetForm = () => {
    setTransactionType('IN');
    setSelectedMaterial(initialMaterialId);
    setQuantity('');
    setDescription('');
    setError(null);
  };

  React.useEffect(() => {
    if (open) {
      resetForm();
      if (initialMaterialId) {
        setSelectedMaterial(initialMaterialId);
      }
    }
  }, [open, initialMaterialId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Stock Transaction</DialogTitle>
      <DialogContent>
        {materialsLoading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}
        {materialsError && (
          <Alert severity="error" sx={{ my: 2 }}>
            Error loading materials: {materialsError.message}
          </Alert>
        )}
        <FormControl fullWidth margin="dense" required>
          <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
          <Select
            labelId="transaction-type-label"
            id="transaction-type"
            value={transactionType}
            label="Transaction Type"
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <MenuItem value="IN">IN (Receive)</MenuItem>
            <MenuItem value="OUT">OUT (Spoilage/Loss)</MenuItem>
            <MenuItem value="ADJUSTMENT">ADJUSTMENT (Correction)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" required disabled={!!initialMaterialId}>
          <InputLabel id="material-select-label">Material</InputLabel>
          <Select
            labelId="material-select-label"
            id="material-select"
            value={selectedMaterial}
            label="Material"
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <MenuItem value="">
              <em>Select Material</em>
            </MenuItem>
            {materials && materials.map((mat) => (
              <MenuItem key={mat.id} value={mat.id}>
                {mat.name} ({mat.sku})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          inputProps={{ min: "0" }}
        />
        <TextField
          margin="dense"
          label="Description / Reason"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {createTransactionMutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {createTransactionMutation.error.message || 'An unexpected error occurred.'}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={createTransactionMutation.isLoading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={createTransactionMutation.isLoading}>
          {createTransactionMutation.isLoading ? <CircularProgress size={24} /> : 'Create Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StockTransactionForm;
