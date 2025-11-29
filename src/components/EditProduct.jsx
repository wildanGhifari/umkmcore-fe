// src/components/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';
import materialService from '../services/materialService'; // Import materialService
import { useSnackbar } from '../context/SnackbarContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: product, isLoading: isProductLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    onSuccess: (data) => {
      // Set local state from fetched data if needed, or rely on react-query's cache
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to fetch product.', 'error');
    }
  });

  const { data: bom, isLoading: isBOMLoading, error: bomError } = useQuery({
    queryKey: ['productBOM', id],
    queryFn: () => productService.getProductBOM(id),
    enabled: !!id, // Only run if product ID is available
  });

  const { data: materials, isLoading: areMaterialsLoading, error: materialsError } = useQuery({
    queryKey: ['allMaterials'],
    queryFn: () => materialService.getMaterials(1, 100, '', ''), // Fetch materials (max 100 per backend validation)
  });

  const updateProductMutation = useMutation({
    mutationFn: (updatedProduct) => productService.updateProduct(id, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', id]); // Invalidate to refetch updated product
      queryClient.invalidateQueries(['products']); // Invalidate products list
      showSnackbar('Product updated successfully!', 'success');
      // navigate('/'); // Maybe don't navigate immediately if user wants to edit BOM
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to update product.', 'error');
    },
  });

  const addMaterialToBOMMutation = useMutation({
    mutationFn: ({ materialId, quantity }) => productService.addMaterialToBOM(id, materialId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['productBOM', id]);
      showSnackbar('Material added to BOM successfully!', 'success');
      setNewMaterialId('');
      setNewMaterialQuantity('');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to add material to BOM.', 'error');
    },
  });

  const removeMaterialFromBOMMutation = useMutation({
    mutationFn: (bomId) => productService.removeMaterialFromBOM(bomId),
    onSuccess: () => {
      queryClient.invalidateQueries(['productBOM', id]);
      showSnackbar('Material removed from BOM successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to remove material from BOM.', 'error');
    },
  });

  const updateBOMEntryMutation = useMutation({
    mutationFn: ({ bomId, quantity }) => productService.updateBOMEntry(bomId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['productBOM', id]);
      showSnackbar('BOM entry updated successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to update BOM entry.', 'error');
    },
  });

  const updateProductCostMutation = useMutation({
    mutationFn: () => productService.updateProductCost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', id]); // Re-fetch product to get updated cost
      showSnackbar('Product cost recalculated and updated successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to recalculate product cost.', 'error');
    },
  });

  const [localProduct, setLocalProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [newMaterialId, setNewMaterialId] = useState('');
  const [newMaterialQuantity, setNewMaterialQuantity] = useState('');

  useEffect(() => {
    if (product) {
      setLocalProduct({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
      });
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleAddMaterialToBOM = () => {
    if (newMaterialId && newMaterialQuantity > 0) {
      addMaterialToBOMMutation.mutate({ materialId: newMaterialId, quantity: parseFloat(newMaterialQuantity) });
    } else {
      showSnackbar('Please select a material and enter a valid quantity.', 'error');
    }
  };

  const handleUpdateBOMQuantity = (bomId, currentQuantity) => {
    const newQuantity = prompt('Enter new quantity', currentQuantity);
    if (newQuantity !== null && parseFloat(newQuantity) > 0) {
      updateBOMEntryMutation.mutate({ bomId, quantity: parseFloat(newQuantity) });
    } else if (newQuantity !== null) {
      showSnackbar('Quantity must be a positive number.', 'error');
    }
  };

  const handleRemoveMaterialFromBOM = (bomId) => {
    if (window.confirm('Are you sure you want to remove this material from BOM?')) {
      removeMaterialFromBOMMutation.mutate(bomId);
    }
  };

  const handleRecalculateCost = () => {
    if (window.confirm('Are you sure you want to recalculate product cost based on current BOM?')) {
      updateProductCostMutation.mutate();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProductMutation.mutate(localProduct);
  };

  if (isProductLoading) {
    return <CircularProgress />;
  }

  if (productError) {
    return <Alert severity="error">Error fetching product: {productError.message}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
          Edit Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Product Name"
            name="name"
            value={localProduct.name}
            onChange={handleChange}
            disabled={updateProductMutation.isLoading}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={localProduct.description}
            onChange={handleChange}
            disabled={updateProductMutation.isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Selling Price"
            name="price"
            type="number"
            value={localProduct.price}
            onChange={handleChange}
            disabled={updateProductMutation.isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="stock"
            label="Stock"
            name="stock"
            type="number"
            value={localProduct.stock}
            onChange={handleChange}
            disabled={updateProductMutation.isLoading}
          />
          {updateProductMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>{updateProductMutation.error.message}</Alert>}
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mr: 2 }}
              disabled={updateProductMutation.isLoading}
            >
              {updateProductMutation.isLoading ? 'Updating...' : 'Update Product Details'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              disabled={updateProductMutation.isLoading}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Bill of Materials (BOM)
          </Typography>
          <Button variant="outlined" sx={{ mb: 2 }} onClick={handleRecalculateCost}>
            Recalculate Cost ({product?.costPrice || 'N/A'})
          </Button>

          {isBOMLoading && <CircularProgress size={20} />}
          {bomError && <Alert severity="error">Error loading BOM: {bomError.message}</Alert>}

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Material</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bom?.data?.length === 0 && !isBOMLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No materials in BOM.</TableCell>
                  </TableRow>
                ) : (
                  bom?.data?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.material.name}</TableCell>
                      <TableCell>{item.material.sku}</TableCell>
                      <TableCell align="right">
                        <TextField
                          value={item.quantity}
                          type="number"
                          size="small"
                          onChange={(e) => handleUpdateBOMQuantity(item.id, e.target.value)}
                          onBlur={(e) => updateBOMEntryMutation.mutate({ bomId: item.id, quantity: parseFloat(e.target.value) })}
                          InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
                          sx={{ width: '80px' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveMaterialFromBOM(item.id)}
                          disabled={removeMaterialFromBOMMutation.isLoading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h4" gutterBottom>
              Add Material to BOM
            </Typography>
            {areMaterialsLoading && <CircularProgress size={20} />}
            {materialsError && <Alert severity="error">Error loading materials: {materialsError.message}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                select
                label="Select Material"
                value={newMaterialId}
                onChange={(e) => setNewMaterialId(e.target.value)}
                fullWidth
                size="small"
                disabled={areMaterialsLoading}
              >
                {materials?.data?.map((mat) => (
                  <MenuItem key={mat.id} value={mat.id}>
                    {mat.name} ({mat.sku})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Quantity"
                type="number"
                value={newMaterialQuantity}
                onChange={(e) => setNewMaterialQuantity(e.target.value)}
                size="small"
                sx={{ width: '120px' }}
                InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
              />
              <Button
                variant="contained"
                onClick={handleAddMaterialToBOM}
                startIcon={<AddIcon />}
                disabled={addMaterialToBOMMutation.isLoading}
              >
                Add
              </Button>
            </Box>
            {addMaterialToBOMMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>{addMaterialToBOMMutation.error.message}</Alert>}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditProduct;
