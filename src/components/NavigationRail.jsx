import React, { useState, useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Fab,
  Divider,
  useTheme,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';
import {
  DashboardRounded as DashboardIcon,
  Inventory2Rounded as Inventory2Icon,
  CategoryRounded as CategoryIcon,
  AssessmentRounded as AssessmentIcon,
  GroupRounded as GroupIcon,
  SettingsRounded as SettingsIcon,
  LogoutRounded as LogoutIcon,
  PointOfSaleRounded as PointOfSaleIcon,
  StyleRounded as StyleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';

const railWidth = 80;

const NavigationRail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [reportsDrawerOpen, setReportsDrawerOpen] = useState(false);

  const reportItems = useMemo(() => [
    { text: 'Stock Report', path: '/reports/stock' },
    { text: 'Low Stock', path: '/reports/low-stock' },
    { text: 'Stock Movement', path: '/reports/stock-movement' },
    { text: 'Material Usage', path: '/reports/material-usage' },
    { text: 'Product Profit', path: '/reports/product-profit' },
    { text: 'Forecast', path: '/reports/forecast' },
  ], []);

  const navItems = useMemo(() => [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Products', icon: <Inventory2Icon />, path: '/products' },
    { text: 'Materials', icon: <CategoryIcon />, path: '/materials' },
    { text: 'Categories', icon: <StyleIcon />, path: '/categories' },
    { text: 'Reports', icon: <AssessmentIcon />, action: () => setReportsDrawerOpen(true) },
    { text: 'Users', icon: <GroupIcon />, path: '/users', adminOnly: true },
  ], []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReportItemClick = (path) => {
    navigate(path);
    setReportsDrawerOpen(false);
  };

  const isReportActive = reportItems.some(child => child.path === pathname);

  const mainRailContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Tooltip title="Point of Sale" placement="right">
          <Fab color="primary" aria-label="pos" onClick={() => navigate('/pos')}>
            <PointOfSaleIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Divider sx={{ width: '56px' }} />

      <List sx={{ flexGrow: 1, py: 1 }}>
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') {
            return null;
          }
          const isSelected = item.path ? pathname === item.path : (item.text === 'Reports' && isReportActive);
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
              <Tooltip title={item.text} placement="right">
                <ListItemButton
                  onClick={item.action ? item.action : () => navigate(item.path)}
                  sx={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 56,
                    width: 72, 
                    borderRadius: 2,
                    py: '4px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 32,
                      width: 64,
                      borderRadius: 4,
                      backgroundColor: isSelected ? alpha(theme.palette.secondary.main, 0.3) : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, color: isSelected ? theme.palette.secondary.dark : 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                  </Box>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      variant: 'caption',
                      sx: { 
                        mt: '4px',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary
                      },
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ width: '56px' }} />

      {/* Bottom Actions */}
      <List sx={{ py: 1 }}>
        {[{ text: 'Settings', icon: <SettingsIcon />, action: () => {} }, { text: 'Logout', icon: <LogoutIcon />, action: handleLogout }].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
             <Tooltip title={item.text} placement="right">
              <IconButton onClick={item.action} sx={{ height: 40, width: 40 }}>
                {item.icon}
              </IconButton>
             </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: railWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: railWidth,
            boxSizing: 'border-box',
            borderRight: 'none'
          },
        }}
      >
        {mainRailContent}
      </Drawer>

      <Drawer
        anchor="left"
        open={reportsDrawerOpen}
        onClose={() => setReportsDrawerOpen(false)}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': { 
            marginLeft: `${railWidth}px`,
            boxSizing: 'border-box',
            boxShadow: theme.shadows[3],
          },
        }}
      >
        <Box
          sx={{ width: 250, p: 2 }}
          role="presentation"
        >
          <Typography variant="h6" sx={{ mb: 2 }}>Reports</Typography>
          <List>
            {reportItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={pathname === item.path}
                  onClick={() => handleReportItemClick(item.path)}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary={item.text} sx={{ pl: 2 }}/>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavigationRail;
