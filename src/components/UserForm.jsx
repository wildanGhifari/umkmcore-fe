// src/components/UserForm.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { useSnackbar } from '../context/SnackbarContext';

function UserForm({ open, onClose, user = null }) {
  const isEdit = !!user;
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    role: user?.role || 'staff',
  });

  const [errors, setErrors] = useState({});

  // Update form data when user prop changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
      });
    }
  }, [user]);

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSnackbar('User invited successfully!', 'success');
      handleClose();
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to invite user', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => userService.updateUser(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSnackbar('User updated successfully!', 'success');
      handleClose();
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to update user', 'error');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password is required for create, optional for edit
    if (!isEdit && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const { confirmPassword, password, ...userData } = formData;

    // For edit mode, only include password if it was changed
    if (isEdit) {
      const dataToUpdate = password ? { ...userData, password } : userData;
      updateMutation.mutate(dataToUpdate);
    } else {
      createMutation.mutate({ ...userData, password });
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'staff',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Edit User' : 'Invite New User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={isEdit}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required={!isEdit}
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || (isEdit ? 'Leave blank to keep current password' : '')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required={!isEdit && !!formData.password}
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {isEdit ? 'Update User' : 'Invite User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UserForm;
