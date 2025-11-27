// src/components/UserManagementPage.jsx
import React, { useState } from 'react';
import {
  Container,
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
  IconButton,
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  Alert,
  Chip,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const UserManagementPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page + 1, rowsPerPage, search],
    queryFn: () => userService.getUsers(page + 1, rowsPerPage, search),
    keepPreviousData: true,
  });

  const users = data?.data || [];
  const totalUsers = data?.total || 0;

  const deleteUserMutation = useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSnackbar('User deactivated successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to deactivate user.', 'error');
    },
  });

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      deleteUserMutation.mutate(id);
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
    setPage(0);
  };

  if (user?.role !== 'admin') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          You do not have permission to access this page.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Error fetching users: {error.message}</Alert>;
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            // onClick={() => setCreateUserModalOpen(true)} // TODO: Implement Create User Modal
          >
            Invite User
          </Button>
        </Box>

        <TextField
          label="Search Users"
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
          sx={{ mb: 3, width: '300px' }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.fullName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? 'Active' : 'Inactive'}
                      color={u.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" /* onClick={() => handleEditUser(u)} */>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeactivateUser(u.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
      {/* TODO: Add Create/Edit User Modal */}
    </Container>
  );
};

export default UserManagementPage;
