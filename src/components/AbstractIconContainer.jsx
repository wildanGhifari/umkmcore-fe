// src/components/AbstractIconContainer.jsx
import React from 'react';
import { Box } from '@mui/material';

const AbstractIconContainer = ({ icon: Icon, bgColor, iconColor }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 0C29.9411 0 38.5294 5.88235 40 15.2941C38.5294 24.7059 29.9411 30.5882 20 30.5882C10.0589 30.5882 1.47059 24.7059 0 15.2941C1.47059 5.88235 10.0589 0 20 0Z"
            transform="matrix(0.866025 -0.5 0.642788 0.766044 0 20)"
            fill={bgColor}
          />
        </svg>
      </Box>
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Icon sx={{ color: iconColor, fontSize: 24 }} />
      </Box>
    </Box>
  );
};

export default AbstractIconContainer;
