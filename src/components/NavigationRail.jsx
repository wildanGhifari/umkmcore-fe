import React, { useState, useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
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
  ChevronLeftRounded as ChevronLeftIcon,
  StyleRounded as StyleIcon,
  ExpandLessRounded as ExpandLess,
  ExpandMoreRounded as ExpandMore,
  StoreRounded as StoreIcon,
  AnalyticsRounded as AnalyticsIcon,
  TrendingUpRounded as TrendingUpRoundedIcon,
  ShoppingCartRounded as ShoppingCartIcon,
  LocalShippingRounded as ProcurementIcon,
  PersonRounded as CRMIcon,
  AccountBalanceRounded as FinanceIcon,
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

const NavigationRail = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);
  const [procurementOpen, setProcurementOpen] = useState(true);
  const [crmOpen, setCrmOpen] = useState(true);
  const [financeOpen, setFinanceOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const NavItem = ({ item, open, isChild = false }) => {
    const isSelected = pathname === item.path;
    if (item.adminOnly && user?.role !== 'admin') return null;

    return (
        <Tooltip title={!open ? item.text : ''} placement="right" arrow>
            <ListItemButton
                selected={isSelected}
                onClick={() => item.path && navigate(item.path)}
                sx={{
                    flexDirection: open ? 'row' : 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: open ? 2.5 : 0,
                    ...(open && isChild && { pl: 4 }),
                    height: open ? 'auto' : 56,
                    width: open ? 'auto' : 56,
                    minHeight: open ? 48 : 56,
                    py: open ? 1 : 0,
                    borderRadius: '24px',
                    mx: open ? 0 : 'auto',
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
                    <ListItemIcon sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        mb: 0,
                        mr: open ? 3 : 0,
                        '& .MuiSvgIcon-root': {
                            fontSize: isChild ? '1.25rem' : '1.1rem'
                        }
                    }}>
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
            <Tooltip title={item.text} placement="right" arrow>
                 <ListItemButton sx={{
                     justifyContent: 'center',
                     alignItems: 'center',
                     flexDirection: 'column',
                     height: 56,
                     width: 56,
                     p: 0,
                     borderRadius: '24px',
                     mx: 'auto',
                 }}>
                    {item.icon && (
                        <ListItemIcon sx={{
                            minWidth: 0,
                            justifyContent: 'center',
                            mb: 0,
                            mr: 0,
                            '& .MuiSvgIcon-root': {
                                fontSize: '1.1rem'
                            }
                        }}>
                            {item.icon}
                        </ListItemIcon>
                    )}
                </ListItemButton>
            </Tooltip>
        );
    }

    return (
        <>
            <ListItemButton onClick={parentToggle} sx={{
                px: 2.5,
                py: 1,
                height: 'auto',
                borderRadius: '24px',
            }}>
                {item.icon && (
                    <ListItemIcon sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        '& .MuiSvgIcon-root': {
                            fontSize: '1.1rem'
                        }
                    }}>
                        {item.icon}
                    </ListItemIcon>
                )}
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }} />
                {open ? (
                    <Box sx={{ '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}>
                        {toggleState ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                ) : null}
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
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
    }}>
        {/* Logo Section - visible in both states, height matches AppBar */}
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: 64, // Match AppBar Toolbar height
            px: open ? 2 : 1.5,
            py: 2, // Always have vertical padding
            position: 'sticky',
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
        }}>
            <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: theme.palette.primary.contrastText,
            }}>
                U
            </Box>
        </Box>
      <Divider sx={{ mb: 1 }} />

      <List
        sx={{ flexGrow: 0, p: open ? 1 : 0, px: open ? 1 : 1, pt: 0}}
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

      <Divider sx={{ mb: 1 }} />

       <List
        sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem', lineHeight: 'normal'}}>MANAGEMENT</ListSubheader>}
      >
        <NavItem item={{ text: 'Categories', path: '/categories', icon: <CategoryIcon /> }} open={open} />
        <NavItem item={{ text: 'Materials', path: '/materials', icon: <StyleIcon /> }} open={open} />
        <NavItem item={{ text: 'Products', path: '/products', icon: <Inventory2Icon /> }} open={open} />
        <NavItem item={{ text: 'Stores', path: '/stores', icon: <StoreIcon /> }} open={open} />
        <NavItem item={{ text: 'Users', icon: <GroupIcon />, path: '/users', adminOnly: true }} open={open} />
      </List>

      <Divider sx={{ mb: 1 }} />

      <List
        sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem', lineHeight: 'normal'}}>SALES</ListSubheader>}
      >
        <CollapsibleNavItem item={{
            text: 'Sales',
            icon: <ShoppingCartIcon />,
            children: [
                { text: 'Sales Orders', path: '/sales/orders', icon: '•' },
                { text: 'Invoices', path: '/sales/invoices', icon: '•' },
                { text: 'Customers', path: '/sales/customers', icon: '•' },
                { text: 'Quotations', path: '/sales/quotations', icon: '•' },
                { text: 'Sales Returns', path: '/sales/returns', icon: '•' }
            ]
        }} open={open} toggleState={salesOpen} parentToggle={() => setSalesOpen(!salesOpen)} />
      </List>

      <Divider sx={{ mb: 1 }} />

      <List
        sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem', lineHeight: 'normal'}}>PROCUREMENT</ListSubheader>}
      >
        <CollapsibleNavItem item={{
            text: 'Procurement',
            icon: <ProcurementIcon />,
            children: [
                { text: 'Purchase Orders', path: '/procurement/orders', icon: '•' },
                { text: 'Suppliers', path: '/procurement/suppliers', icon: '•' },
                { text: 'Goods Receipt', path: '/procurement/receipts', icon: '•' },
                { text: 'Purchase Requests', path: '/procurement/requests', icon: '•' },
                { text: 'Supplier Invoices', path: '/procurement/invoices', icon: '•' }
            ]
        }} open={open} toggleState={procurementOpen} parentToggle={() => setProcurementOpen(!procurementOpen)} />
      </List>

      <Divider sx={{ mb: 1 }} />

      <List
        sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem', lineHeight: 'normal'}}>CRM</ListSubheader>}
      >
        <CollapsibleNavItem item={{
            text: 'CRM',
            icon: <CRMIcon />,
            children: [
                { text: 'Contacts', path: '/crm/contacts', icon: '•' },
                { text: 'Leads', path: '/crm/leads', icon: '•' },
                { text: 'Opportunities', path: '/crm/opportunities', icon: '•' },
                { text: 'Customer Notes', path: '/crm/notes', icon: '•' },
                { text: 'Follow-ups', path: '/crm/followups', icon: '•' }
            ]
        }} open={open} toggleState={crmOpen} parentToggle={() => setCrmOpen(!crmOpen)} />
      </List>

      <Divider sx={{ mb: 1 }} />

      <List
        sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}
        subheader={open && <ListSubheader sx={{bgcolor: 'transparent', fontSize: '0.75rem', lineHeight: 'normal'}}>FINANCE</ListSubheader>}
      >
        <CollapsibleNavItem item={{
            text: 'Finance',
            icon: <FinanceIcon />,
            children: [
                { text: 'Chart of Accounts', path: '/finance/accounts', icon: '•' },
                { text: 'Payments', path: '/finance/payments', icon: '•' },
                { text: 'Expenses', path: '/finance/expenses', icon: '•' },
                { text: 'Journal Entries', path: '/finance/journals', icon: '•' },
                { text: 'Financial Reports', path: '/finance/reports', icon: '•' }
            ]
        }} open={open} toggleState={financeOpen} parentToggle={() => setFinanceOpen(!financeOpen)} />
      </List>

      <Box sx={{flexGrow: 1}} />

      <Divider sx={{ mb: 1 }} />

      <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
        <NavItem item={{ text: 'Settings', path: '#', icon: <SettingsIcon /> }} open={open} />
         <Tooltip title={!open ? "Logout" : ''} placement="right" arrow>
            <ListItemButton onClick={handleLogout} sx={{
                px: open ? 2.5 : 0,
                py: open ? 1 : 0,
                justifyContent: 'center',
                alignItems: 'center',
                height: open ? 'auto' : 56,
                width: open ? 'auto' : 56,
                minHeight: open ? 48 : 56,
                borderRadius: '24px',
                mx: open ? 0 : 'auto',
            }}>
                <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 3 : 0,
                    justifyContent: 'center',
                    mb: 0,
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.1rem'
                    }
                }}><LogoutIcon /></ListItemIcon>
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
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent',
            borderRadius: '16px',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.text.secondary,
          },
          '&:hover::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme.palette.text.primary,
          },
        },
      }}
      open={open}
    >
      {mainRailContent}
    </Drawer>
  );
};

export default NavigationRail;
