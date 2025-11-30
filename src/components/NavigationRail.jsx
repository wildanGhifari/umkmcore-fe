import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Fab,
  Divider,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory2 as Inventory2Icon,
  Category as CategoryIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  PointOfSale as PointOfSaleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Style as StyleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Products', icon: <Inventory2Icon />, path: '/products' },
  { text: 'Materials', icon: <CategoryIcon />, path: '/materials' },
  { text: 'Categories', icon: <StyleIcon />, path: '/categories' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Users', icon: <GroupIcon />, path: '/users', adminOnly: true },
];

const NavigationRail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Menu & Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: open ? 1 : 2, py: 1.5 }}>
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* POS FAB */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Tooltip title="Point of Sale" placement="right">
          <Fab color="primary" aria-label="pos" onClick={() => navigate('/pos')} sx={{ transform: open ? 'scale(1)' : 'scale(0.8)' }}>
            <PointOfSaleIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') {
            return null;
          }
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={item.text} placement="right" disableHoverListener={open}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Bottom Actions */}
      <List>
        {['Settings', 'Logout'].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={text} placement="right" disableHoverListener={open}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={text === 'Logout' ? handleLogout : undefined}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <SettingsIcon /> : <LogoutIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : theme.spacing(9),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : theme.spacing(9),
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
      open={open}
    >
      {drawerContent}
    </Drawer>
  );
};

export default NavigationRail;
