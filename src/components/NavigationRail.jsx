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
  TrendingUpRounded as TrendingUpRoundedIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';

const drawerWidth = 280;

// Custom "•" icon component
const BulletIcon = () => {
    const theme = useTheme();
    const bulletColor = theme.palette.text.primary;
    const bgColor = alpha(bulletColor, 0.4);

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '4px', // Wrapper padding changed to 4px
            backgroundColor: 'rgba(27, 27, 33, 0.2)', // New background color
            borderRadius: '50%',
            // width and height removed
        }}>
            <Box sx={{ width: '4px', height: '4px', bgcolor: bulletColor, borderRadius: '50%' }} />
        </Box>
    );
}

const NavigationRail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  
  const [open, setOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);

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
        <Tooltip title={!open ? item.text : ''}>
            <ListItemButton
                selected={isSelected}
                onClick={() => item.path && navigate(item.path)}
                sx={{
                    flexDirection: open ? 'row' : 'column',
                    justifyContent: 'center',
                    px: 2.5,
                    pl: open && isChild ? 4 : 2.5,
                    height: open ? 48 : 72,
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primaryContainer.main,
                        color: theme.palette.primaryContainer.contrastText,
                        '& .MuiListItemIcon-root, & .MuiTypography-root': {
                        color: theme.palette.primaryContainer.contrastText,
                        },
                        '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        }
                    }
                }}
            >
                {item.icon && (
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mb: open ? 0 : 1, mr: open ? 3 : 0 }}>
                        {item.icon === '•' ? <BulletIcon /> : item.icon}
                    </ListItemIcon>
                )}
                <ListItemText 
                    primary={item.text} 
                    sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }} 
                    primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                    }}
                />
            </ListItemButton>
        </Tooltip>
    );
  };
  
  const CollapsibleNavItem = ({ item, open, toggleState, parentToggle }) => {
    if (!open) {
        return (
            <Tooltip title={item.text}>
                 <ListItemButton sx={{justifyContent: 'center', flexDirection: 'column', height: 72}}>
                    {item.icon && (
                        <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mb: 1, mr: 0 }}>
                            {item.icon}
                        </ListItemIcon>
                    )}
                </ListItemButton>
            </Tooltip>
        );
    }

    return (
        <>
            <ListItemButton onClick={parentToggle} sx={{px: 2.5}}>
                {item.icon && (
                    <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                        {item.icon}
                    </ListItemIcon>
                )}
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }} />
                {open ? (toggleState ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            <Collapse in={toggleState && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {item.children.map((child, index) => (
                       <NavItem key={index} item={child} open={open} isChild={true} />
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
            <Tooltip title={!open ? 'Point of Sale' : ''}>
                <Fab variant={open ? 'extended' : 'circular'} color="primary" aria-label="pos" onClick={() => navigate('/pos')} sx={{ width: '100%' }}>
                    <PointOfSaleIcon sx={{ mr: open ? 1 : 0 }} />
                    {open && 'POS'}
                </Fab>
            </Tooltip>
        </Box>
      <Divider sx={{ my: 1 }} />
      
      <List
        sx={{ flexGrow: 0, p: open ? 1 : 0, pt: 0}}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem', lineHeight: 'normal'}}>DASHBOARD</ListSubheader>}
      >
        <NavItem item={{ text: "Today's Sales", path: '/', icon: <DashboardIcon /> }} open={open} />
        <CollapsibleNavItem item={{
            text: 'Analytics',
            icon: <AnalyticsIcon />,
            children: [
                { text: 'Inventory', path: '/reports/inventory', icon: '•' },
                { text: 'Material Usage', path: '/reports/material-usage', icon: '•' },
                { text: 'Revenue', path: '/reports/revenue', icon: '•' },
                { text: 'Forecast', path: '/reports/forecast', icon: '•' }
            ]
        }} open={open} toggleState={analyticsOpen} parentToggle={() => setAnalyticsOpen(!analyticsOpen)} />
      </List>

      <Divider />
      
       <List
        sx={{ p: open ? 1 : 0 }}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem', lineHeight: 'normal'}}>MANAGEMENT</ListSubheader>}
      >
        <NavItem item={{ text: 'Categories', path: '/categories', icon: <CategoryIcon /> }} open={open} />
        <NavItem item={{ text: 'Materials', path: '/materials', icon: <StyleIcon /> }} open={open} />
        <NavItem item={{ text: 'Products', path: '/products', icon: <Inventory2Icon /> }} open={open} />
        <NavItem item={{ text: 'Stores', path: '/stores', icon: <StoreIcon /> }} open={open} />
        <NavItem item={{ text: 'Users', icon: <GroupIcon />, path: '/users', adminOnly: true }} open={open} />
      </List>

      <Box sx={{flexGrow: 1}} />

      <Divider />

      <List sx={{ p: open ? 1 : 0 }}>
        <NavItem item={{ text: 'Settings', path: '#', icon: <SettingsIcon /> }} open={open} />
         <Tooltip title={!open ? "Logout" : ''}>
            <ListItemButton onClick={handleLogout} sx={{px: 2.5, justifyContent: 'center'}}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }} />
            </ListItemButton>
        </Tooltip>
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
