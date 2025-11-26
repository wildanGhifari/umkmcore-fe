// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          UMKM Core
        </Typography>
        {user && (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/pos')}
              sx={{ mr: 2 }}
            >
              POS
            </Button>
            <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
            <Button color="inherit" onClick={() => navigate('/products')}>Products</Button>
            <Button color="inherit" onClick={() => navigate('/materials')}>Materials</Button>
            <Button color="inherit" onClick={() => navigate('/reports')}>Reports</Button>
            {user.role === 'admin' && (
              <Button color="inherit" onClick={() => navigate('/users')}>User Management</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
