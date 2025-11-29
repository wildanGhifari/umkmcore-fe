import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormHelperText, // Added FormHelperText import
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { useSnackbar } from '../context/SnackbarContext';

function ProductForm() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    sellingPrice: '',
    currentStock: '',
    sku: '',
    category: '',
    unit: '',
    costPrice: '',
    isActive: true,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch product categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'product'],
    queryFn: () => categoryService.getCategories({ type: 'product', limit: 100 }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const categories = categoriesData?.data || [];

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // SKU Validation (updated to match new constraint)
    if (!product.sku) {
      errors.sku = 'SKU is required.';
      isValid = false;
    } else if (product.sku.length > 20) {
      errors.sku = 'SKU cannot exceed 20 characters.';
      isValid = false;
    }

    // Name Validation (updated to match new constraint)
    if (!product.name) {
      errors.name = 'Product Name is required.';
      isValid = false;
    } else if (product.name.length > 40) {
      errors.name = 'Product Name cannot exceed 40 characters.';
      isValid = false;
    }

    // Unit Validation
    const allowedUnits = ['pcs', 'cup', 'serving', 'bottle', 'box', 'kg', 'liter'];
    if (!product.unit) {
      errors.unit = 'Unit is required.';
      isValid = false;
    } else if (!allowedUnits.includes(product.unit)) {
      errors.unit = 'Invalid unit selected.';
      isValid = false;
    }

    // Selling Price Validation
    if (product.sellingPrice === '' || product.sellingPrice === null) {
      errors.sellingPrice = 'Selling Price is required.';
      isValid = false;
    } else if (parseFloat(product.sellingPrice) < 0) {
      errors.sellingPrice = 'Selling Price cannot be negative.';
      isValid = false;
    }

    // Cost Price Validation (optional, but if provided, must be >= 0)
    if (product.costPrice !== '' && product.costPrice !== null && parseFloat(product.costPrice) < 0) {
      errors.costPrice = 'Cost Price cannot be negative.';
      isValid = false;
    }

    // Current Stock Validation
    if (product.currentStock === '' || product.currentStock === null) {
      errors.currentStock = 'Current Stock is required.';
      isValid = false;
    } else if (parseFloat(product.currentStock) < 0) {
      errors.currentStock = 'Current Stock cannot be negative.';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Auto-generate SKU from name if name field is changed and SKU is empty
    if (name === 'name' && !product.sku) {
      const autoSku = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '') // Remove non-alphanumeric characters
        .substring(0, 20); // Limit to 20 characters

      setProduct((prevProduct) => ({
        ...prevProduct,
        name: value,
        sku: autoSku,
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear validation error for the changed field immediately
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      showSnackbar('Please correct the errors in the form.', 'error');
      return;
    }

    setLoading(true);
    try {
      await productService.createProduct(product);
      showSnackbar('Product created successfully!', 'success');
      navigate('/products'); // Assuming a products list page
    } catch (e) {
      setError(e.message);
      showSnackbar(e.message || 'Failed to create product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.values(validationErrors).every((error) => !error);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
          Create Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="sku"
            label="SKU"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            disabled={loading}
            error={!!validationErrors.sku}
            helperText={validationErrors.sku || `${product.sku.length}/20 characters`}
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Product Name"
            name="name"
            value={product.name}
            onChange={handleChange}
            disabled={loading}
            error={!!validationErrors.name}
            helperText={validationErrors.name || `${product.name.length}/40 characters`}
            inputProps={{ maxLength: 40 }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={product.description}
            onChange={handleChange}
            disabled={loading}
          />
          <FormControl fullWidth margin="normal" disabled={loading}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={product.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories
                .filter(cat => cat.isActive)
                .map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required disabled={loading} error={!!validationErrors.unit}>
            <InputLabel id="unit-label">Unit</InputLabel>
            <Select
              labelId="unit-label"
              id="unit"
              name="unit"
              value={product.unit}
              label="Unit"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="pcs">Pcs</MenuItem>
              <MenuItem value="cup">Cup</MenuItem>
              <MenuItem value="serving">Serving</MenuItem>
              <MenuItem value="bottle">Bottle</MenuItem>
              <MenuItem value="box">Box</MenuItem>
              <MenuItem value="kg">Kg</MenuItem>
              <MenuItem value="liter">Liter</MenuItem>
            </Select>
            {validationErrors.unit && <FormHelperText>{validationErrors.unit}</FormHelperText>}
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="sellingPrice"
            label="Selling Price"
            name="sellingPrice"
            type="number"
            value={product.sellingPrice}
            onChange={handleChange}
            disabled={loading}
            error={!!validationErrors.sellingPrice}
            helperText={validationErrors.sellingPrice}
          />
          <TextField
            margin="normal"
            fullWidth
            id="costPrice"
            label="Cost Price"
            name="costPrice"
            type="number"
            value={product.costPrice}
            onChange={handleChange}
            disabled={loading}
            error={!!validationErrors.costPrice}
            helperText={validationErrors.costPrice}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="currentStock"
            label="Current Stock"
            name="currentStock"
            type="number"
            value={product.currentStock}
            onChange={handleChange}
            disabled={loading}
            error={!!validationErrors.currentStock}
            helperText={validationErrors.currentStock}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={product.isActive}
                onChange={handleChange}
                name="isActive"
                color="primary"
                disabled={loading}
              />
            }
            label="Is Active"
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mr: 2 }}
              disabled={loading || !isFormValid}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')} // Assuming a products list page
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProductForm;