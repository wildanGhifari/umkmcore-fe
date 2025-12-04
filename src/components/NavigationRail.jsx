import React, { useState, useMemo, useEffect } from 'react';
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
  TrendingDownRounded as TrendingDownRoundedIcon,
  ShoppingCartRounded as ShoppingCartIcon,
  AccountBalanceWalletRounded as MoneyIcon,
  SecurityRounded as RolesIcon,
  BusinessRounded as BusinessIcon,
  NotificationsRounded as NotificationsIcon,
  WarningRounded as AlertIcon,
  AddCircleOutlineRounded as CashInIcon,
  RemoveCircleOutlineRounded as CashOutIcon,
  AccountBalanceWalletRounded as BalanceIcon,
  ReceiptRounded as DailySalesIcon,
  InventoryRounded as StockLevelsIcon,
  PieChartRounded as MaterialUsageIcon,
  StarRounded as BestSellersIcon,
  DragIndicatorRounded as DragHandleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const drawerWidth = 260;

const NavigationRail = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  // State for collapseable sections
  const [sectionStates, setSectionStates] = useState(() => {
    const saved = localStorage.getItem('sectionCollapseStates');
    return saved ? JSON.parse(saved) : {
      stockManagement: true,
      moneyTracker: true,
      reports: true,
      settings: true,
    };
  });

  // State for section order
  const [sectionOrder, setSectionOrder] = useState(() => {
    const saved = localStorage.getItem('sectionOrder');
    return saved ? JSON.parse(saved) : ['stockManagement', 'moneyTracker', 'reports', 'settings'];
  });

  // Save section collapse states to localStorage
  useEffect(() => {
    localStorage.setItem('sectionCollapseStates', JSON.stringify(sectionStates));
  }, [sectionStates]);

  // Save section order to localStorage
  useEffect(() => {
    localStorage.setItem('sectionOrder', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const toggleSection = (section) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
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
                    px: open ? 2 : 0,
                    ...(open && isChild && { pl: 4 }),
                    height: open ? 'auto' : 56,
                    width: open ? 'auto' : 56,
                    minHeight: open ? 48 : 56,
                    py: open ? 0.75 : 0,
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
                        mr: open ? 2 : 0,
                        '& .MuiSvgIcon-root': {
                            fontSize: isChild ? '1.25rem' : '1.1rem'
                        }
                    }}>
                        {item.icon}
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

  const SortableSectionWrapper = ({ id, children }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, disabled: !open });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Box ref={setNodeRef} style={style}>
        {React.cloneElement(children, { dragHandleProps: { ...attributes, ...listeners }, isDragging })}
      </Box>
    );
  };

  const CollapsibleSection = ({ section, config, open, isDragging = false, dragHandleProps }) => {
    const isOpen = sectionStates[section];

    if (!open) {
        return (
            <Tooltip title={config.text} placement="right" arrow>
                 <ListItemButton sx={{
                     justifyContent: 'center',
                     alignItems: 'center',
                     flexDirection: 'column',
                     height: 56,
                     width: 56,
                     p: 0,
                     borderRadius: '24px',
                     mx: 'auto',
                     opacity: isDragging ? 0.5 : 1,
                 }}>
                    {config.icon && (
                        <ListItemIcon sx={{
                            minWidth: 0,
                            justifyContent: 'center',
                            mb: 0,
                            mr: 0,
                            '& .MuiSvgIcon-root': {
                                fontSize: '1.1rem'
                            }
                        }}>
                            {config.icon}
                        </ListItemIcon>
                    )}
                </ListItemButton>
            </Tooltip>
        );
    }

    return (
        <>
            <ListItemButton onClick={() => toggleSection(section)} sx={{
                px: 2,
                py: 0.75,
                height: 'auto',
                borderRadius: '24px',
                opacity: isDragging ? 0.5 : 1,
            }}>
                {open && (
                    <Box
                        {...dragHandleProps}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 1,
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' },
                            color: 'text.secondary',
                            opacity: 0.6,
                            '&:hover': { opacity: 1 },
                        }}
                    >
                        <DragHandleIcon sx={{ fontSize: '1.1rem' }} />
                    </Box>
                )}
                {config.icon && (
                    <ListItemIcon sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                        '& .MuiSvgIcon-root': {
                            fontSize: '1.1rem'
                        }
                    }}>
                        {config.icon}
                    </ListItemIcon>
                )}
                <ListItemText
                    primary={config.text}
                    sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }}
                    primaryTypographyProps={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                    }}
                />
                {open ? (
                    <Box sx={{ '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}>
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                ) : null}
            </ListItemButton>
            <Collapse in={isOpen && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {config.children.map((child, index) => (
                       <NavItem key={index} item={child} open={open} isChild={true} />
                    ))}
                </List>
            </Collapse>
        </>
    );
  };

  // Define section configurations
  const sectionConfigs = {
    stockManagement: {
      text: 'Stock Management',
      icon: <Inventory2Icon />,
      children: [
        { text: 'Materials', path: '/materials', icon: <StyleIcon /> },
        { text: 'Products', path: '/products', icon: <Inventory2Icon /> },
        { text: 'Categories', path: '/categories', icon: <CategoryIcon /> },
        { text: 'Low Stock Alerts', path: '/stock/alerts', icon: <AlertIcon /> },
      ]
    },
    moneyTracker: {
      text: 'Money Tracker',
      icon: <MoneyIcon />,
      children: [
        { text: 'Cash In', path: '/money/cash-in', icon: <CashInIcon /> },
        { text: 'Cash Out', path: '/money/cash-out', icon: <CashOutIcon /> },
        { text: 'Balance', path: '/money/balance', icon: <BalanceIcon /> },
      ]
    },
    reports: {
      text: 'Reports',
      icon: <AssessmentIcon />,
      children: [
        { text: 'Daily Sales', path: '/reports/daily-sales', icon: <DailySalesIcon /> },
        { text: 'Stock Levels', path: '/reports/stock-levels', icon: <StockLevelsIcon /> },
        { text: 'Material Usage', path: '/reports/material-usage', icon: <MaterialUsageIcon /> },
        { text: 'Best Sellers', path: '/reports/best-sellers', icon: <BestSellersIcon /> },
      ]
    },
    settings: {
      text: 'Settings',
      icon: <SettingsIcon />,
      children: [
        { text: 'Users', path: '/users', icon: <GroupIcon />, adminOnly: true },
        { text: 'Roles', path: '/roles', icon: <RolesIcon />, adminOnly: true },
        { text: 'Business Info', path: '/settings/business', icon: <BusinessIcon /> },
        { text: 'Notifications', path: '/settings/notifications', icon: <NotificationsIcon /> },
      ]
    },
  };

  const mainRailContent = (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    }}>
        {/* Logo Section - visible in both states, height matches AppBar */}
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: 64, // Match AppBar Toolbar height
            px: open ? 2 : 1.5,
            py: 2,
            mb: open ? 0 : 1, // Add margin-bottom when collapsed
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

        {/* Scrollable content area with custom scrollbar */}
        <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
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
            {/* Dashboard */}
            <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
                <NavItem item={{ text: 'Dashboard', path: '/', icon: <DashboardIcon /> }} open={open} />
            </List>

            <Divider sx={{ my: 1 }} />

            {/* POS (Point of Sale) */}
            <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
                <NavItem item={{ text: 'POS', path: '/pos', icon: <ShoppingCartIcon /> }} open={open} />
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Draggable Sections */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sectionOrder}
                    strategy={verticalListSortingStrategy}
                    disabled={!open}
                >
                    {sectionOrder.map((sectionKey) => (
                        <React.Fragment key={sectionKey}>
                            <SortableSectionWrapper id={sectionKey}>
                                <List sx={{ p: open ? 1 : 0, px: open ? 1 : 1 }}>
                                    <CollapsibleSection
                                        section={sectionKey}
                                        config={sectionConfigs[sectionKey]}
                                        open={open}
                                    />
                                </List>
                            </SortableSectionWrapper>
                            <Divider sx={{ my: 1 }} />
                        </React.Fragment>
                    ))}
                </SortableContext>
            </DndContext>

            {/* LOGOUT */}
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
                        borderRadius: '24px',
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
                        }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }} />
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
