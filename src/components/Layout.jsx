// src/components/Layout.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import NavigationRail from './NavigationRail';
import TopAppBar from './AppBar'; // Assuming AppBar will be created

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavigationRail open={open} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${open ? 280 : 72}px)`, // Adjust width based on rail state
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          overscrollBehavior: 'none', // Prevent overscroll bounce/rubber-band effect
        }}
      >
        <TopAppBar handleDrawerToggle={handleDrawerToggle} />
        <Box sx={{ p: 3, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
