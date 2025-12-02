// src/components/UserManagementPage.jsx
import React, { useState, useEffect } from 'react';
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
  IconButton,
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  Alert,
  Chip,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as ActivateIcon,
  Block as DeactivateIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import userService from '../services/userService';
import UserForm from '../components/UserForm';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const UserManagementPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState(''); // User input
  const [search, setSearch] = useState(''); // Debounced search value
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0); // Reset page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page + 1, rowsPerPage, search],
    queryFn: () => userService.getUsers(page + 1, rowsPerPage, search),
    keepPreviousData: true,
  });

  const users = data?.data || [];
  const totalUsers = data?.pagination?.total || 0;

  const deleteUserMutation = useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSnackbar('User deleted permanently!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to delete user.', 'error');
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (id) => userService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSnackbar('User deactivated successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to deactivate user.', 'error');
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: (id) => userService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSnackbar('User activated successfully!', 'success');
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to activate user.', 'error');
    },
  });

  const handleDeactivateUser = (id) => {
    if (window.confirm('Are you sure you want to deactivate this user? They will not be able to login.')) {
      deactivateUserMutation.mutate(id);
    }
  };

  const handleActivateUser = (id) => {
    if (window.confirm('Reactivate this user? They will be able to login again.')) {
      activateUserMutation.mutate(id);
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('PERMANENTLY DELETE this user? This action cannot be undone!')) {
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
    setSearchInput(event.target.value);
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setIsUserFormOpen(true);
  };

  const handleCloseUserForm = () => {
    setEditingUser(null);
    setIsUserFormOpen(false);
  };

  if (user?.role !== 'admin') {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        You do not have permission to access this page.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error fetching users: {error.message}</Alert>;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setIsUserFormOpen(true)}
          >
            Invite User
          </Button>
        </Box>

        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={searchInput}
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
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditUser(u)}
                      title="Edit user"
                    >
                      <EditIcon />
                    </IconButton>
                    {u.isActive ? (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleDeactivateUser(u.id)}
                        title="Deactivate user"
                      >
                        <DeactivateIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleActivateUser(u.id)}
                        title="Activate user"
                      >
                        <ActivateIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(u.id)}
                      title="Permanently delete user"
                    >
                      <DeleteForeverIcon />
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
      <UserForm open={isUserFormOpen} onClose={handleCloseUserForm} user={editingUser} />
    </>
  );
};

export default UserManagementPage;
