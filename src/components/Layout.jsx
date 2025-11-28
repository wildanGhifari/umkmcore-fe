// src/components/Layout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar'; // We will create this next

const Layout = ({ children }) => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, width: '100%', p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
