// src/components/CategoryManagement.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from '../services/categoryService';
import { useSnackbar } from '../context/SnackbarContext';

function CategoryManagement() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [tabValue, setTabValue] = useState(0); // 0 = Material, 1 = Product
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'material',
    description: '',
    isActive: true,
  });

  const categoryType = tabValue === 0 ? 'material' : 'product';

  // Fetch categories based on current tab
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories', categoryType, search],
    queryFn: () => categoryService.getCategories({ type: categoryType, search, limit: 100 }),
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });

  const categories = categoriesData?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      showSnackbar('Category created successfully!', 'success');
      handleCloseDialog();
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to create category', 'error');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      showSnackbar('Category updated successfully!', 'success');
      handleCloseDialog();
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to update category', 'error');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      showSnackbar('Category deleted successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to delete category', 'error');
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearch(''); // Clear search when switching tabs
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      // Edit mode
      setEditingCategory(category);
      setFormData({
        name: category.name,
        type: category.type,
        description: category.description || '',
        isActive: category.isActive,
      });
    } else {
      // Create mode
      setEditingCategory(null);
      setFormData({
        name: '',
        type: categoryType,
        description: '',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'material',
      description: '',
      isActive: true,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showSnackbar('Category name is required', 'error');
      return;
    }

    if (editingCategory) {
      // Update
      const updateData = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
      };
      updateMutation.mutate({ id: editingCategory.id, data: updateData });
    } else {
      // Create
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This will fail if the category is in use.`)) {
      deleteMutation.mutate(category.id);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Category Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        </Box>

        {/* Tabs for Material/Product */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Material Categories" />
            <Tab label="Product Categories" />
          </Tabs>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder={`Search ${categoryType} categories...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Categories Table */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No {categoryType} categories found. Click "Add Category" to create one.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.type}
                        size="small"
                        color={category.type === 'material' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={category.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(category)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(category)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                required
                fullWidth
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                inputProps={{ maxLength: 50 }}
                helperText={`${formData.name.length}/50 characters`}
              />

              <FormControl fullWidth required disabled={!!editingCategory}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                >
                  <MenuItem value="material">Material</MenuItem>
                  <MenuItem value="product">Product</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleFormChange}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default CategoryManagement;
