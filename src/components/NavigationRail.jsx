import React, { useState, useMemo } from 'react';
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
  Collapse,
  Typography, // Import Typography
} from '@mui/material';
import {
  MenuRounded as MenuIcon,
  DashboardRounded as DashboardIcon,
  Inventory2Rounded as Inventory2Icon,
  CategoryRounded as CategoryIcon,
  AssessmentRounded as AssessmentIcon,
  GroupRounded as GroupIcon,
  SettingsRounded as SettingsIcon,
  LogoutRounded as LogoutIcon,
  PointOfSaleRounded as PointOfSaleIcon,
  ChevronLeftRounded as ChevronLeftIcon,
  ChevronRightRounded as ChevronRightIcon,
  StyleRounded as StyleIcon,
  ExpandLessRounded as ExpandLess,
  ExpandMoreRounded as ExpandMore,
  AnalyticsRounded as AnalyticsIcon,
  ShowChartRounded as ShowChartIcon,
  StackedBarChartRounded as StackedBarChartIcon,
  WarningRounded as WarningIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const NavigationRail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const navItems = useMemo(() => [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Products', icon: <Inventory2Icon />, path: '/products' },
    { text: 'Materials', icon: <CategoryIcon />, path: '/materials' },
    { text: 'Categories', icon: <StyleIcon />, path: '/categories' },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      children: [
        { text: 'Stock Report', icon: <Inventory2Icon />, path: '/reports/stock' },
        { text: 'Low Stock', icon: <WarningIcon />, path: '/reports/low-stock' },
        { text: 'Stock Movement', icon: <ShowChartIcon />, path: '/reports/stock-movement' },
        { text: 'Material Usage', icon: <StackedBarChartIcon />, path: '/reports/material-usage' },
        { text: 'Product Profit', icon: <AnalyticsIcon />, path: '/reports/product-profit' },
        { text: 'Forecast', icon: <ShowChartIcon />, path: '/reports/forecast' },
      ],
    },
    { text: 'Users', icon: <GroupIcon />, path: '/users', adminOnly: true },
  ], []);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
    if (!open) {
      setReportsOpen(false); // Collapse reports when closing the main rail
    }
  };

  const handleReportsToggle = () => {
    if (!open) {
      setOpen(true); // Open the rail first
      setReportsOpen(true);
    } else {
      setReportsOpen(!reportsOpen);
    }
  };

  const isReportActive = navItems.find(item => item.text === 'Reports').children.some(child => child.path === pathname);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Menu & Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'flex-end', // Adjusted for logo
          px: open ? 2 : 'auto', // Adjusted padding
          py: 1.5,
          pl: 2.5,
        }}
      >
        {open && (
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            UMKM Core
          </Typography>
        )}
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* POS FAB */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Tooltip title="Point of Sale" placement="right">
          <Fab
            variant={open ? 'extended' : 'circular'} // Use extended variant when open
            color="primary"
            aria-label="pos"
            onClick={() => navigate('/pos')}
            sx={{
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              width: open ? 'auto' : theme.spacing(7), // Adjust width for extended fab
            }}
          >
            <PointOfSaleIcon sx={{ mr: open ? 1 : 0 }} /> {/* Add margin to icon when open */}
            {open && <Typography variant="button">POS</Typography>} {/* Show text when open */}
          </Fab>
        </Tooltip>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, p: open ? 1 : 0 }}>
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') {
            return null;
          }
          if (item.children) {
            return (
              <React.Fragment key={item.text}>
                <ListItemButton
                  onClick={handleReportsToggle}
                  selected={isReportActive && !open}
                  sx={{
                    borderRadius: 2,
                    mx: open ? 1 : 'auto',
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <Tooltip title={item.text} placement="right" disableHoverListener={open}>
                    <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                  </Tooltip>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                  {open ? (reportsOpen ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
                <Collapse in={reportsOpen && open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map(child => (
                      <ListItemButton
                        key={child.text}
                        selected={pathname === child.path}
                        onClick={() => navigate(child.path)}
                        sx={{ pl: 4, borderRadius: 2, mx: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: 'center' }}>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={item.text} placement="right" disableHoverListener={open}>
                <ListItemButton
                  selected={pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 2,
                    mx: open ? 1 : 'auto',
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Bottom Actions */}
      <List sx={{ p: open ? 1 : 0 }}>
        {[{text: 'Settings', icon: <SettingsIcon />}, {text: 'Logout', icon: <LogoutIcon /> }].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={item.text} placement="right" disableHoverListener={open}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 2,
                  mx: open ? 1 : 'auto',
                }}
                onClick={item.text === 'Logout' ? handleLogout : undefined}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
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
