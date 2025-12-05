import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,

  // Dashboard - Outline & Filled
  DashboardOutlined as DashboardOutlinedIcon,
  DashboardRounded as DashboardFilledIcon,

  // POS - Outline & Filled
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  ShoppingCartRounded as ShoppingCartFilledIcon,

  // Materials - Outline & Filled
  StyleOutlined as StyleOutlinedIcon,
  StyleRounded as StyleFilledIcon,

  // Products - Outline & Filled
  Inventory2Outlined as Inventory2OutlinedIcon,
  Inventory2Rounded as Inventory2FilledIcon,

  // Categories - Outline & Filled
  CategoryOutlined as CategoryOutlinedIcon,
  CategoryRounded as CategoryFilledIcon,

  // Low Stock Alerts - Outline & Filled
  WarningAmberOutlined as WarningAmberOutlinedIcon,
  WarningAmberRounded as WarningAmberFilledIcon,

  // Cash In - Outline & Filled
  AddCircleOutlineOutlined as AddCircleOutlineIcon,
  AddCircleRounded as AddCircleFilledIcon,

  // Cash Out - Outline & Filled
  RemoveCircleOutlineOutlined as RemoveCircleOutlineIcon,
  RemoveCircleOutlineRounded as RemoveCircleFilledIcon,

  // Balance - Outline & Filled
  AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon,
  AccountBalanceWalletRounded as AccountBalanceWalletFilledIcon,

  // Daily Sales - Outline & Filled
  ReceiptLongOutlined as ReceiptLongOutlinedIcon,
  ReceiptLongRounded as ReceiptLongFilledIcon,

  // Stock Levels - Outline & Filled
  InventoryOutlined as InventoryOutlinedIcon,
  InventoryRounded as InventoryFilledIcon,

  // Material Usage - Outline & Filled
  PieChartOutlineOutlined as PieChartOutlineOutlinedIcon,
  PieChartRounded as PieChartFilledIcon,

  // Best Sellers - Outline & Filled
  StarBorderRounded as StarBorderOutlinedIcon,
  StarRounded as StarFilledIcon,

  // Users - Outline & Filled
  GroupOutlined as GroupOutlinedIcon,
  GroupRounded as GroupFilledIcon,

  // Roles - Outline & Filled
  SecurityOutlined as SecurityOutlinedIcon,
  SecurityRounded as SecurityFilledIcon,

  // Business Info - Outline & Filled
  BusinessOutlined as BusinessOutlinedIcon,
  BusinessRounded as BusinessFilledIcon,

  // Notifications - Outline & Filled
  NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
  NotificationsRounded as NotificationsFilledIcon,

  // Logout - Outline & Filled
  LogoutOutlined as LogoutOutlinedIcon,
  LogoutRounded as LogoutFilledIcon,

  // Section representative icons (when collapsed)
  AssessmentRounded as AssessmentFilledIcon,
  SettingsRounded as SettingsFilledIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const NavigationRail = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  // State for section expansion (default: STOCK MANAGEMENT and MONEY TRACKER expanded)
  const [sectionStates, setSectionStates] = useState(() => {
    const saved = localStorage.getItem('sectionCollapseStates');
    return saved ? JSON.parse(saved) : {
      stockManagement: true,
      moneyTracker: true,
      reports: false,
      settings: false,
    };
  });

  // Save section collapse states to localStorage
  useEffect(() => {
    localStorage.setItem('sectionCollapseStates', JSON.stringify(sectionStates));
  }, [sectionStates]);

  const toggleSection = (section) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSectionClick = (sectionKey) => {
    if (!open) {
      // If sidebar collapsed, expand it first
      handleDrawerToggle();
      // Then expand this section
      setSectionStates(prev => ({ ...prev, [sectionKey]: true }));
    } else {
      // If sidebar already open, just toggle section
      toggleSection(sectionKey);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // NavItem component - displays individual navigation items
  const NavItem = ({ item, open }) => {
    const isSelected = pathname === item.path;
    if (item.adminOnly && user?.role !== 'admin') return null;

    // Choose icon variant based on selection state
    const IconComponent = isSelected ? item.iconFilled : item.iconOutline;

    return (
      <Tooltip title={!open ? item.text : ''} placement="right" arrow>
        <ListItemButton
          selected={isSelected}
          onClick={() => item.path && navigate(item.path)}
          sx={{
            flexDirection: open ? 'row' : 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: open ? 2 : 0,
            height: open ? 'auto' : 56,
            width: open ? 'auto' : 56,
            minHeight: open ? 48 : 56,
            py: open ? 0.75 : 0,
            borderRadius: open ? '24px' : '50%',
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
          <ListItemIcon sx={{
            minWidth: 0,
            justifyContent: 'center',
            mb: 0,
            mr: open ? 2 : 0,
            '& .MuiSvgIcon-root': {
              fontSize: '1.1rem'
            }
          }}>
            {IconComponent}
          </ListItemIcon>
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

  // CollapsibleSection - uses MUI Collapse for sections
  const CollapsibleSection = ({ sectionKey, config, open }) => {
    const isExpanded = sectionStates[sectionKey];

    // When sidebar is collapsed, show representative icon
    if (!open) {
      return (
        <Tooltip title={config.text} placement="right" arrow>
          <ListItemButton
            onClick={() => handleSectionClick(sectionKey)}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              height: 56,
              width: 56,
              p: 0,
              borderRadius: '50%',
              mx: 'auto',
            }}
          >
            <ListItemIcon sx={{
              minWidth: 0,
              justifyContent: 'center',
              mb: 0,
              mr: 0,
              '& .MuiSvgIcon-root': {
                fontSize: '1.1rem'
              }
            }}>
              {config.collapsedIcon}
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
      );
    }

    // When sidebar is expanded, show collapsible section
    return (
      <Box>
        <ListItemButton
          onClick={() => handleSectionClick(sectionKey)}
          sx={{
            px: 2,
            py: 0.75,
            minHeight: 48,
            borderRadius: '24px',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemText
            primary={config.text}
            primaryTypographyProps={{
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: 'text.secondary',
            }}
          />
          {isExpanded ? <ExpandLess sx={{ fontSize: '1.1rem' }} /> : <ExpandMore sx={{ fontSize: '1.1rem' }} />}
        </ListItemButton>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {config.children.map((child, index) => (
              <NavItem key={index} item={child} open={open} />
            ))}
          </List>
        </Collapse>
      </Box>
    );
  };

  // Define section configurations with nav items
  const sectionConfigs = {
    stockManagement: {
      text: 'Stock Management',
      collapsedIcon: <Inventory2FilledIcon />,
      children: [
        {
          text: 'Products',
          path: '/products',
          iconOutline: <Inventory2OutlinedIcon />,
          iconFilled: <Inventory2FilledIcon />
        },
        {
          text: 'Materials',
          path: '/materials',
          iconOutline: <StyleOutlinedIcon />,
          iconFilled: <StyleFilledIcon />
        },
        {
          text: 'Categories',
          path: '/categories',
          iconOutline: <CategoryOutlinedIcon />,
          iconFilled: <CategoryFilledIcon />
        },
        {
          text: 'Low Stock Alerts',
          path: '/stock/alerts',
          iconOutline: <WarningAmberOutlinedIcon />,
          iconFilled: <WarningAmberFilledIcon />
        },
      ]
    },
    moneyTracker: {
      text: 'Money Tracker',
      collapsedIcon: <AccountBalanceWalletFilledIcon />,
      children: [
        {
          text: 'Cash In',
          path: '/money/cash-in',
          iconOutline: <AddCircleOutlineIcon />,
          iconFilled: <AddCircleFilledIcon />
        },
        {
          text: 'Cash Out',
          path: '/money/cash-out',
          iconOutline: <RemoveCircleOutlineIcon />,
          iconFilled: <RemoveCircleFilledIcon />
        },
        {
          text: 'Balance',
          path: '/money/balance',
          iconOutline: <AccountBalanceWalletOutlinedIcon />,
          iconFilled: <AccountBalanceWalletFilledIcon />
        },
      ]
    },
    reports: {
      text: 'Reports',
      collapsedIcon: <AssessmentFilledIcon />,
      children: [
        {
          text: 'Daily Sales',
          path: '/reports/daily-sales',
          iconOutline: <ReceiptLongOutlinedIcon />,
          iconFilled: <ReceiptLongFilledIcon />
        },
        {
          text: 'Stock Levels',
          path: '/reports/stock-levels',
          iconOutline: <InventoryOutlinedIcon />,
          iconFilled: <InventoryFilledIcon />
        },
        {
          text: 'Material Usage',
          path: '/reports/material-usage',
          iconOutline: <PieChartOutlineOutlinedIcon />,
          iconFilled: <PieChartFilledIcon />
        },
        {
          text: 'Best Sellers',
          path: '/reports/best-sellers',
          iconOutline: <StarBorderOutlinedIcon />,
          iconFilled: <StarFilledIcon />
        },
      ]
    },
    settings: {
      text: 'Settings',
      collapsedIcon: <SettingsFilledIcon />,
      children: [
        {
          text: 'Users',
          path: '/users',
          iconOutline: <GroupOutlinedIcon />,
          iconFilled: <GroupFilledIcon />,
          adminOnly: true
        },
        {
          text: 'Roles',
          path: '/roles',
          iconOutline: <SecurityOutlinedIcon />,
          iconFilled: <SecurityFilledIcon />,
          adminOnly: true
        },
        {
          text: 'Business Info',
          path: '/settings/business',
          iconOutline: <BusinessOutlinedIcon />,
          iconFilled: <BusinessFilledIcon />
        },
        {
          text: 'Notifications',
          path: '/settings/notifications',
          iconOutline: <NotificationsNoneOutlinedIcon />,
          iconFilled: <NotificationsFilledIcon />
        },
      ]
    },
  };

  const mainRailContent = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Logo Section - fixed at top */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 64, // Match AppBar Toolbar height
        px: open ? 2 : 1.5,
        py: 2,
        mb: open ? 0 : 1,
        position: 'sticky',
        top: 0,
        backgroundColor: theme.palette.background.paper,
        borderBottom: 1,
        borderColor: 'divider',
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

      {/* Scrollable content area with custom scrollbar and smooth scroll */}
      <Box sx={{
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
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
          backgroundColor: theme.palette.primary.main,
        },
        '&:hover::-webkit-scrollbar-thumb:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      }}>
        {/* Dashboard - Fixed (not draggable) */}
        <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
          <NavItem
            item={{
              text: 'Dashboard',
              path: '/',
              iconOutline: <DashboardOutlinedIcon />,
              iconFilled: <DashboardFilledIcon />
            }}
            open={open}
          />
        </List>

        {/* POS - Fixed (not draggable) */}
        <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
          <NavItem
            item={{
              text: 'POS',
              path: '/pos',
              iconOutline: <ShoppingCartOutlinedIcon />,
              iconFilled: <ShoppingCartFilledIcon />
            }}
            open={open}
          />
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Collapsible Sections */}
        <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
          <CollapsibleSection
            sectionKey="stockManagement"
            config={sectionConfigs.stockManagement}
            open={open}
          />
        </List>

        <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
          <CollapsibleSection
            sectionKey="moneyTracker"
            config={sectionConfigs.moneyTracker}
            open={open}
          />
        </List>

        <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
          <CollapsibleSection
            sectionKey="reports"
            config={sectionConfigs.reports}
            open={open}
          />
        </List>

        <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
          <CollapsibleSection
            sectionKey="settings"
            config={sectionConfigs.settings}
            open={open}
          />
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Logout - Fixed at bottom */}
        <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1, pb: 2 }}>
          <Tooltip title={!open ? "Logout" : ''} placement="right" arrow>
            <ListItemButton onClick={handleLogout} sx={{
              px: open ? 2 : 0,
              py: open ? 0.75 : 0,
              justifyContent: 'center',
              alignItems: 'center',
              height: open ? 'auto' : 56,
              width: open ? 'auto' : 56,
              minHeight: open ? 48 : 56,
              borderRadius: open ? '24px' : '50%',
              mx: open ? 0 : 'auto',
            }}>
              <ListItemIcon sx={{
                minWidth: 0,
                mr: open ? 2 : 0,
                justifyContent: 'center',
                mb: 0,
                '& .MuiSvgIcon-root': {
                  fontSize: '1.1rem'
                }
              }}>
                <LogoutOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              />
            </ListItemButton>
          </Tooltip>
        </List>
      </Box>
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
          overflowY: 'hidden', // Disable scrolling on drawer paper
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
