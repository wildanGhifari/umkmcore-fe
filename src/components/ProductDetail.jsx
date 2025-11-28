// src/components/ProductDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/productService';
import materialService from '../services/materialService';
import { useSnackbar } from '../context/SnackbarContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [isBOMDialogOpen, setIsBOMDialogOpen] = useState(false);
  const [editingBOM, setEditingBOM] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState('');

  // Fetch product details
  const { data: productData, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  });

  // Fetch product BOM
  const { data: bomData, isLoading: isLoadingBOM, error: bomError } = useQuery({
    queryKey: ['product-bom', id],
    queryFn: () => productService.getProductBOM(id),
  });

  // Fetch all materials for the dropdown
  const { data: materialsData } = useQuery({
    queryKey: ['materials-all'],
    queryFn: () => materialService.getMaterials(1, 100, '', '', ''), // Get all materials (max 100 per backend validation)
  });

  const product = productData?.data;
  const bomItems = bomData?.data || [];
  const materials = materialsData?.data || [];

  // Add material to BOM
  const addMaterialMutation = useMutation({
    mutationFn: ({ materialId, quantity, unit }) =>
      productService.addMaterialToBOM(id, materialId, quantity, unit),
    onSuccess: () => {
      queryClient.invalidateQueries(['product-bom', id]);
      queryClient.invalidateQueries(['product', id]);
      showSnackbar('Material added to BOM successfully!', 'success');
      handleCloseBOMDialog();
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to add material to BOM.', 'error');
    },
  });

  // Update BOM entry
  const updateBOMMutation = useMutation({
    mutationFn: ({ bomId, quantity }) =>
      productService.updateBOMEntry(bomId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['product-bom', id]);
      queryClient.invalidateQueries(['product', id]);
      showSnackbar('BOM entry updated successfully!', 'success');
      handleCloseBOMDialog();
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to update BOM entry.', 'error');
    },
  });

  // Remove material from BOM
  const removeMaterialMutation = useMutation({
    mutationFn: (bomId) => productService.removeMaterialFromBOM(bomId),
    onSuccess: () => {
      queryClient.invalidateQueries(['product-bom', id]);
      queryClient.invalidateQueries(['product', id]);
      showSnackbar('Material removed from BOM successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to remove material from BOM.', 'error');
    },
  });

  // Update product cost based on BOM
  const updateCostMutation = useMutation({
    mutationFn: () => productService.updateProductCost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', id]);
      showSnackbar('Product cost updated successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to update product cost.', 'error');
    },
  });

  const handleOpenBOMDialog = (bomItem = null) => {
    if (bomItem) {
      setEditingBOM(bomItem);
      setSelectedMaterial(bomItem.materialId);
      setQuantity(bomItem.quantity);
    } else {
      setEditingBOM(null);
      setSelectedMaterial('');
      setQuantity('');
    }
    setIsBOMDialogOpen(true);
  };

  const handleCloseBOMDialog = () => {
    setIsBOMDialogOpen(false);
    setEditingBOM(null);
    setSelectedMaterial('');
    setQuantity('');
  };

  const handleSaveBOM = () => {
    if (!selectedMaterial || !quantity) {
      showSnackbar('Please select a material and enter quantity.', 'error');
      return;
    }

    if (editingBOM) {
      updateBOMMutation.mutate({ bomId: editingBOM.id, quantity: parseFloat(quantity) });
    } else {
      // Get the unit from the selected material
      const selectedMat = materials.find(m => m.id === selectedMaterial);
      const unit = selectedMat?.unit || 'pcs';
      addMaterialMutation.mutate({
        materialId: selectedMaterial,
        quantity: parseFloat(quantity),
        unit: unit
      });
    }
  };

  const handleRemoveMaterial = (bomId) => {
    if (window.confirm('Are you sure you want to remove this material from the BOM?')) {
      removeMaterialMutation.mutate(bomId);
    }
  };

  const handleUpdateCost = () => {
    if (window.confirm('Recalculate product cost from BOM materials? This will update the cost price.')) {
      updateCostMutation.mutate();
    }
  };

  // Calculate total material cost from BOM
  const calculateTotalMaterialCost = () => {
    return bomItems.reduce((total, item) => {
      return total + (item.quantity * (item.Material?.unitPrice || 0));
    }, 0);
  };

  if (isLoadingProduct || isLoadingBOM) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (productError || bomError) {
    return <Alert severity="error">Error loading product details</Alert>;
  }

  if (!product) {
    return <Alert severity="error">Product not found</Alert>;
  }

  const totalMaterialCost = calculateTotalMaterialCost();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/products')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{product.name}</Typography>
          <Chip
            label={product.isActive ? 'Active' : 'Inactive'}
            color={product.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/products/edit/${id}`)}
        >
          Edit Product
        </Button>
      </Box>

      {/* Product Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Product Information</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">SKU</Typography>
                  <Typography variant="body1">{product.sku || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{product.category || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Unit</Typography>
                  <Typography variant="body1">{product.unit || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                  <Typography variant="body1">{product.currentStock || 0}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{product.description || 'No description'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pricing</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Selling Price</Typography>
                  <Typography variant="h6" color="primary">
                    Rp {product.sellingPrice?.toLocaleString() || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Cost Price</Typography>
                  <Typography variant="h6">
                    Rp {product.costPrice?.toLocaleString() || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Material Cost (from BOM)</Typography>
                  <Typography variant="body1" color="info.main">
                    Rp {totalMaterialCost.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Additional Costs</Typography>
                  <Typography variant="body1">
                    Rp {((product.costPrice || 0) - totalMaterialCost).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                  <Typography variant="body1" color="success.main">
                    Rp {((product.sellingPrice || 0) - (product.costPrice || 0)).toLocaleString()}
                    {' '}
                    ({product.costPrice ? (((product.sellingPrice - product.costPrice) / product.sellingPrice * 100).toFixed(1)) : 0}%)
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bill of Materials */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Bill of Materials (BOM)</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CalculateIcon />}
              onClick={handleUpdateCost}
              disabled={bomItems.length === 0}
            >
              Recalculate Cost
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleOpenBOMDialog()}
            >
              Add Material
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total Cost</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bomItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No materials added to BOM yet. Click "Add Material" to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bomItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.Material?.name || 'N/A'}</TableCell>
                    <TableCell>{item.Material?.sku || 'N/A'}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{item.Material?.unit || 'N/A'}</TableCell>
                    <TableCell align="right">Rp {item.Material?.unitPrice?.toLocaleString() || 0}</TableCell>
                    <TableCell align="right">
                      Rp {(item.quantity * (item.Material?.unitPrice || 0)).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenBOMDialog(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveMaterial(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {bomItems.length > 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="right">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Material Cost:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      Rp {totalMaterialCost.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* BOM Dialog */}
      <Dialog open={isBOMDialogOpen} onClose={handleCloseBOMDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBOM ? 'Edit BOM Entry' : 'Add Material to BOM'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Material</InputLabel>
              <Select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                label="Material"
                disabled={!!editingBOM}
              >
                {materials.map((material) => (
                  <MenuItem key={material.id} value={material.id}>
                    {material.name} ({material.sku}) - Rp {material.unitPrice?.toLocaleString()}/{material.unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
            />
            {selectedMaterial && quantity && (
              <Alert severity="info">
                Estimated cost: Rp {(
                  quantity * (materials.find(m => m.id === selectedMaterial)?.unitPrice || 0)
                ).toLocaleString()}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBOMDialog}>Cancel</Button>
          <Button
            onClick={handleSaveBOM}
            variant="contained"
            disabled={addMaterialMutation.isLoading || updateBOMMutation.isLoading}
          >
            {editingBOM ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductDetail;
