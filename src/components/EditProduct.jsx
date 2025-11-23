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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';
import { useSnackbar } from '../context/SnackbarContext';

function EditProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data.data || data);
      } catch (e) {
        setError(e.message);
        showSnackbar(e.message || 'Failed to fetch product.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
      await productService.updateProduct(id, product);
      showSnackbar('Product updated successfully!', 'success');
      navigate('/');
    } catch (e) {
      setError(e.message);
      showSnackbar(e.message || 'Failed to update product.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !product.name) { // only show spinner on initial load
    return <CircularProgress />;
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
              {loading ? 'Updating...' : 'Update Product'}
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

export default EditProduct;