// src/components/MaterialsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import materialService from '../services/materialService';
import StockTransactionForm from '../components/StockTransactionForm';
import MaterialForm from '../components/MaterialForm';
import { useSnackbar } from '../context/SnackbarContext';

function MaterialsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isMaterialFormOpen, setIsMaterialFormOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['materials', page + 1, rowsPerPage, search, category, stockStatus],
    queryFn: () => materialService.getMaterials(page + 1, rowsPerPage, search, category, stockStatus),
    keepPreviousData: true,
  });

  const materials = data?.data || [];
  const totalMaterials = data?.pagination?.total || 0;

  const deleteMaterialMutation = useMutation({
    mutationFn: (id) => materialService.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['materials']);
      showSnackbar('Material deleted successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to delete material.', 'error');
    },
  });

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

  const handleStockStatusChange = (event) => {
    setStockStatus(event.target.value);
    setPage(0); // Reset page when stock status changes
  };

  const handleRowClick = (materialId) => {
    navigate(`/materials/${materialId}`);
  };

  const handleOpenTransactionForm = () => {
    setIsTransactionFormOpen(true);
  };

  const handleCloseTransactionForm = () => {
    setIsTransactionFormOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterialMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading materials: {error.message}
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Materials
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
                <MenuItem value="Raw Material">Raw Material</MenuItem>
                <MenuItem value="Packaging">Packaging</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={stockStatus}
                label="Stock Status"
                onChange={handleStockStatusChange}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="OK">OK</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="primary" onClick={() => setIsMaterialFormOpen(true)}>
              Create Material
            </Button>
            <Button variant="outlined" color="primary" onClick={handleOpenTransactionForm}>
              Record Transaction
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell align="right">Current Stock</TableCell>
                <TableCell align="right">Minimum Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((material) => (
                <TableRow
                  key={material.id}
                  onClick={() => handleRowClick(material.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{material.sku}</TableCell>
                  <TableCell>{material.name}</TableCell>
                  <TableCell align="right">Rp {material.unitPrice?.toLocaleString() || 0}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell align="right">{material.currentStock}</TableCell>
                  <TableCell align="right">{material.minimumStock}</TableCell>
                  <TableCell>{material.status}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from firing
                        navigate(`/materials/edit/${material.id}`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from firing
                        handleDelete(material.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {materials.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No materials found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalMaterials}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
      <StockTransactionForm open={isTransactionFormOpen} onClose={handleCloseTransactionForm} />
      <MaterialForm open={isMaterialFormOpen} onClose={() => setIsMaterialFormOpen(false)} />
    </>
  );
}

export default MaterialsPage;