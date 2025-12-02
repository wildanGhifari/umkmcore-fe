// src/components/AppBar.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Badge,
} from '@mui/material';
import {
  MenuRounded as MenuIcon,
  SearchRounded as SearchIcon,
  NotificationsNoneRounded as NotificationsIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const TopAppBar = ({ handleDrawerToggle }) => {
  return (
    <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
            backgroundColor: 'transparent', 
            backdropFilter: 'blur(8px)',
            color: 'text.primary',
            top: 0,
            zIndex: (theme) => theme.zIndex.drawer - 1,
         }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.7),
            borderRadius: '999px',
            p: '4px 16px',
            flexGrow: 0.5,
          }}
        >
          <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            sx={{ color: 'text.primary', width: '100%' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar alt="User" src="/static/images/avatar/1.jpg" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
