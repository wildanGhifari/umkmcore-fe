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
  Typography,
  IconButton,
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
import { alpha } from '@mui/material/styles';

const drawerWidth = 240;

const NavigationRail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false); // Re-introduce open state for rail
  const [reportsOpen, setReportsOpen] = useState(false); // For internal reports collapse

  const navItems = useMemo(() => [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Products', icon: <Inventory2Icon />, path: '/products' },
    { text: 'Materials', icon: <CategoryIcon />, path: '/materials' },
    { text: 'Categories', icon: <StyleIcon />, path: '/categories' },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      children: [
        { text: 'Stock Report', path: '/reports/stock' },
        { text: 'Low Stock', path: '/reports/low-stock' },
        { text: 'Stock Movement', path: '/reports/stock-movement' },
        { text: 'Material Usage', path: '/reports/material-usage' },
        { text: 'Product Profit', path: '/reports/product-profit' },
        { text: 'Forecast', path: '/reports/forecast' },
      ],
    },
    { text: 'Users', icon: <GroupIcon />, path: '/users', adminOnly: true },
  ], []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => { // Re-introduce toggle for main rail
    setOpen(!open);
    if (!open) {
      setReportsOpen(false); // Collapse reports when closing the main rail
    }
  };

  const handleReportsToggle = () => { // For internal reports collapse
    setReportsOpen(!reportsOpen);
  };

  const isReportActive = navItems.find(item => item.text === 'Reports').children.some(child => child.path === pathname);

  const mainRailContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Menu & Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'flex-end',
          px: open ? 2 : 'auto',
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
            variant={open ? 'extended' : 'circular'}
            color="primary"
            aria-label="pos"
            onClick={() => navigate('/pos')}
            sx={{
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              width: open ? 'auto' : theme.spacing(7),
            }}
          >
            <PointOfSaleIcon sx={{ mr: open ? 1 : 0 }} />
            {open && <Typography variant="button">POS</Typography>}
          </Fab>
        </Tooltip>
      </Box>

      <Divider sx={{ my: 1 }} />

<<<<<<< HEAD
      <List sx={{ flexGrow: 1, py: 1 }}>
=======
      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, p: open ? 1 : 0 }}>
>>>>>>> 164c681 (revert(NavigationRail): Undo M3 design and restore expandable rail)
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') {
            return null;
          }
          if (item.children) {
            return (
              <React.Fragment key={item.text}>
                <ListItemButton
<<<<<<< HEAD
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
=======
                  onClick={handleReportsToggle}
                  selected={isReportActive} // Use selected for standard MUI active state
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 2,
                    mx: open ? 1 : 'auto',
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
                        {/* No Icon for report child items */}
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
>>>>>>> 164c681 (revert(NavigationRail): Undo M3 design and restore expandable rail)
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Bottom Actions */}
<<<<<<< HEAD
      <List sx={{ py: 1 }}>
        {[{ text: 'Settings', icon: <SettingsIcon />, action: () => {} }, { text: 'Logout', icon: <LogoutIcon />, action: handleLogout }].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
             <Tooltip title={item.text} placement="right">
              <IconButton onClick={item.action} sx={{ height: 40, width: 40 }}>
                {item.icon}
              </IconButton>
             </Tooltip>
=======
      <List sx={{ p: open ? 1 : 0 }}>
        {[{text: 'Settings', icon: <SettingsIcon />, action: () => {} }, {text: 'Logout', icon: <LogoutIcon />, action: handleLogout }].map((item) => (
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
                onClick={item.action}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
>>>>>>> 164c681 (revert(NavigationRail): Undo M3 design and restore expandable rail)
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
<<<<<<< HEAD
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
=======
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
      {mainRailContent}
    </Drawer>
>>>>>>> 164c681 (revert(NavigationRail): Undo M3 design and restore expandable rail)
  );
};

export default NavigationRail;
