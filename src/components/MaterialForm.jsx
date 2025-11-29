// src/components/MaterialForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import materialService from '../services/materialService';
import { useSnackbar } from '../context/SnackbarContext';

function MaterialForm({ open, onClose, material = null }) {
  const isEdit = !!material;
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    sku: material?.sku || '',
    name: material?.name || '',
    unit: material?.unit || '',
    unitCost: material?.unitCost || '',
    minimumStock: material?.minimumStock || '',
    currentStock: material?.currentStock || 0,
  });

  // Update form data when material prop changes (for edit mode)
  useEffect(() => {
    if (material) {
      setFormData({
        sku: material.sku || '',
        name: material.name || '',
        unit: material.unit || '',
        unitCost: material.unitCost || '',
        minimumStock: material.minimumStock || '',
        currentStock: material.currentStock || 0,
      });
    }
  }, [material]);

  const createMutation = useMutation({
    mutationFn: materialService.createMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries(['materials']);
      showSnackbar('Material created successfully!', 'success');
      handleClose();
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to create material', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => materialService.updateMaterial(material.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['materials']);
      showSnackbar('Material updated successfully!', 'success');
      handleClose();
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to update material', 'error');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      unitCost: parseFloat(formData.unitCost),
      minimumStock: parseInt(formData.minimumStock, 10),
      currentStock: parseInt(formData.currentStock, 10),
    };

    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    setFormData({
      sku: '',
      name: '',
      unit: '',
      unitCost: '',
      minimumStock: '',
      currentStock: 0,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Edit Material' : 'Create New Material'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                disabled={isEdit} // SKU shouldn't change
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Material Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Unit</InputLabel>
                <Select
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <MenuItem value="pcs">Pcs</MenuItem>
                  <MenuItem value="cup">Cup</MenuItem>
                  <MenuItem value="ml">Ml</MenuItem>
                  <MenuItem value="liter">Liter</MenuItem>
                  <MenuItem value="gram">Gram</MenuItem>
                  <MenuItem value="kg">Kg</MenuItem>
                  <MenuItem value="serving">Serving</MenuItem>
                  <MenuItem value="bottle">Bottle</MenuItem>
                  <MenuItem value="box">Box</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Unit Cost"
                name="unitCost"
                value={formData.unitCost}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Minimum Stock"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Current Stock"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                disabled={isEdit} // Current stock managed via stock transactions
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default MaterialForm;
