import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { useSnackbar } from '../context/SnackbarContext';

function ProductForm() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await productService.createProduct(product);
      showSnackbar('Product created successfully!', 'success');
      navigate('/');
    } catch (e) {
      setError(e.message);
      showSnackbar(e.message || 'Failed to create product.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
            id="name"
            label="Product Name"
            name="name"
            value={product.name}
            onChange={handleChange}
            disabled={loading}
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
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="stock"
            label="Stock"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            disabled={loading}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mr: 2 }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
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