// src/components/Layout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar'; // We will create this next

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
