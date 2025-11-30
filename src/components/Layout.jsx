// src/components/Layout.jsx
import React from 'react';
import { Box } from '@mui/material';
import NavigationRail from './NavigationRail';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavigationRail />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: 'calc(100% - 72px)', // 72px is the collapsed width of the rail
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
