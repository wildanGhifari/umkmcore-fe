import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Button,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from '../context/SnackbarContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { showSnackbar } = useSnackbar();

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page + 1, rowsPerPage, search, category],
    queryFn: () => productService.getProducts(page + 1, rowsPerPage, search, category),
    keepPreviousData: true,
  });

  const products = data?.data || [];
  const totalProducts = data?.total || 0;

  const deleteProductMutation = useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      showSnackbar('Product deleted successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to delete product.', 'error');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); // Reset page when search changes
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(0); // Reset page when category changes
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Error fetching products: {error.message}</Alert>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h2">
          Product List
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/products/new"
        >
          Create Product
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {/* TODO: Fetch categories from API */}
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Beverage">Beverage</MenuItem>
            <MenuItem value="Merchandise">Merchandise</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Selling Price</TableCell>
              <TableCell align="right">Cost Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Avatar src={product.image || 'https://via.placeholder.com/40'} alt={product.name} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell>{product.sku || 'N/A'}</TableCell>
                  <TableCell align="right">{product.sellingPrice || 'N/A'}</TableCell>
                  <TableCell align="right">{product.costPrice || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Box>
                      <IconButton
                        aria-label="edit"
                        component={Link}
                        to={`/products/edit/${product.id}`}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalProducts}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default ProductList;