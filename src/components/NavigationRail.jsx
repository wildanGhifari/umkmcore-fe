import React, { useState, useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
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
  ListSubheader,
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
  StyleRounded as StyleIcon,
  ExpandLessRounded as ExpandLess,
  ExpandMoreRounded as ExpandMore,
  StoreRounded as StoreIcon,
  AnalyticsRounded as AnalyticsIcon,
  ReceiptLongRounded as ReceiptLongRoundedIcon,
  TrendingUpRounded as TrendingUpRoundedIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

const NavigationRail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  
  const [open, setOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [revenueOpen, setRevenueOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const NavItem = ({ item, open, isChild = false }) => {
    const isSelected = pathname === item.path;
    if (item.adminOnly && user?.role !== 'admin') return null;

    return (
      <ListItemButton
        selected={isSelected}
        onClick={() => item.path && navigate(item.path)}
        sx={{
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          pl: isChild ? 4 : 2.5,
          '&.Mui-selected': {
            backgroundColor: theme.palette.primaryContainer.main,
            color: theme.palette.primaryContainer.contrastText,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primaryContainer.contrastText,
            },
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
            }
          }
        }}
      >
        {item.icon && (
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                {item.icon}
            </ListItemIcon>
        )}
        <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    );
  };
  
  const CollapsibleNavItem = ({ item, open, toggleState, parentToggle }) => {
    const hasActiveChild = useMemo(() => item.children.some(child => child.path === pathname || child.children?.some(c => c.path === pathname)), [item.children, pathname]);

    return (
        <>
            <ListItemButton onClick={parentToggle} sx={{px: 2.5}}>
                {item.icon && (
                    <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                        {item.icon}
                    </ListItemIcon>
                )}
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                {open ? (toggleState ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            <Collapse in={toggleState && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {item.children.map((child, index) => (
                        child.children ? (
                           <CollapsibleNavItem key={index} item={child} open={open} toggleState={child.text === 'Inventory' ? inventoryOpen : revenueOpen} parentToggle={() => child.text === 'Inventory' ? setInventoryOpen(!inventoryOpen) : setRevenueOpen(!revenueOpen)} />
                        ) : (
                           <NavItem key={index} item={child} open={open} isChild={true} />
                        )
                    ))}
                </List>
            </Collapse>
        </>
    );
  };


  const mainRailContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: open ? 'space-between' : 'center' }}>
            {open && <Typography variant="h6" component="div">UMKM Core</Typography>}
            <IconButton onClick={handleDrawerToggle}>
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
        </Box>
        <Box sx={{ px: open ? 2 : 1, my: 1 }}>
            <Fab variant="extended" color="primary" aria-label="pos" onClick={() => navigate('/pos')} sx={{ width: '100%' }}>
                <PointOfSaleIcon sx={{ mr: open ? 1 : 0 }} />
                {open && 'POS'}
            </Fab>
        </Box>
      <Divider sx={{ my: 1 }} />
      
      <List
        sx={{ flexGrow: 1, p: open ? 1 : 0 }}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem'}}>DASHBOARD</ListSubheader>}
      >
        <NavItem item={{ text: "Today's Sales", path: '/', icon: <DashboardIcon /> }} open={open} />
        <CollapsibleNavItem item={{
            text: 'Analytics',
            icon: <AnalyticsIcon />,
            children: [
                { text: 'Inventory', icon: <Inventory2Icon/>, children: [
                    { text: 'Stock', path: '/reports/stock' },
                    { text: 'Low Stock', path: '/reports/low-stock' },
                    { text: 'Stock Movement', path: '/reports/stock-movement' }
                ]},
                { text: 'Material Usage', path: '/reports/material-usage', icon: <StyleIcon /> },
                { text: 'Revenue', icon: <ReceiptLongRoundedIcon />, children: [
                     { text: 'Product Profit', path: '/reports/product-profit' },
                ]},
                { text: 'Forecast', path: '/reports/forecast', icon: <TrendingUpRoundedIcon /> }
            ]
        }} open={open} toggleState={analyticsOpen} parentToggle={() => setAnalyticsOpen(!analyticsOpen)} />
      </List>

      <Divider />
      
       <List
        sx={{ p: open ? 1 : 0 }}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem'}}>MANAGEMENT</ListSubheader>}
      >
        <NavItem item={{ text: 'Categories', path: '/categories', icon: <CategoryIcon /> }} open={open} />
        <NavItem item={{ text: 'Materials', path: '/materials', icon: <StyleIcon /> }} open={open} />
        <NavItem item={{ text: 'Products', path: '/products', icon: <Inventory2Icon /> }} open={open} />
        <NavItem item={{ text: 'Stores', path: '/stores', icon: <StoreIcon /> }} open={open} />
        <NavItem item={{ text: 'Users', path: '/users', icon: <GroupIcon />, adminOnly: true }} open={open} />
      </List>

      <Box sx={{flexGrow: 1}} />

      <Divider />

      <List sx={{ p: open ? 1 : 0 }}>
        <NavItem item={{ text: 'Settings', path: '#', icon: <SettingsIcon /> }} open={open} />
        <ListItemButton onClick={handleLogout} sx={{px: 2.5}}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
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
          backgroundColor: theme.palette.background.paper,
        },
      }}
      open={open}
    >
      {mainRailContent}
    </Drawer>
  );
};

export default NavigationRail;
