// src/components/POSPage.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteIcon,
  Person as PersonIcon,
  ReceiptLong as ReceiptIcon,
  ShoppingCartCheckout as CheckoutIcon,
} from '@mui/icons-material';
import productService from '../services/productService';
import salesOrderService from '../services/salesOrderService';
import customerService from '../services/customerService';
import { useSnackbar } from '../context/SnackbarContext';
import { useTheme } from '@mui/material/styles';

const POSPage = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerSearchOpen, setCustomerSearchOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 1, 50, search, ''], // Fetch up to 50 products for POS
    queryFn: () => productService.getProducts(1, 50, search, ''),
    keepPreviousData: true,
  });

  const products = data?.data || [];

  const { data: customerData, isLoading: customersLoading, error: customersError } = useQuery({
    queryKey: ['customers', 1, 10, customerSearch], // Fetch up to 10 customers for search
    queryFn: () => customerService.getCustomers(1, 10, customerSearch),
    enabled: isCustomerSearchOpen && customerSearch.length > 0, // Only fetch if search is open and term is entered
    keepPreviousData: true,
  });

  const customers = customerData?.data || [];

  const createSalesOrderMutation = useMutation({
    mutationFn: salesOrderService.createSalesOrder,
    onSuccess: () => {
      showSnackbar('Sale completed successfully!', 'success');
      setCart([]);
      setCheckoutModalOpen(false);
      setAmountReceived('');
      setSelectedCustomer(null);
      queryClient.invalidateQueries(['products']); // Refetch products to update stock info
    },
    onError: (err) => {
      showSnackbar(err.message || 'Failed to complete sale.', 'error');
    },
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showSnackbar(`${product.name} added to cart`, 'success');
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showSnackbar('Item removed from cart', 'info');
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.sellingPrice * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // Example 10% tax
  const total = subtotal + tax;

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      showSnackbar('Cart is empty!', 'error');
      return;
    }
    setAmountReceived(total.toFixed(2));
    setCheckoutModalOpen(true);
  };

  const handleCompleteSale = () => {
    const orderData = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.sellingPrice
      })),
      taxAmount: tax,
      paymentMethod,
      paidAmount: parseFloat(amountReceived) || total,
      customerId: selectedCustomer?.id || null,
    };
    createSalesOrderMutation.mutate(orderData);
  };

  return (
    <Container maxWidth={false} sx={{ height: 'calc(100vh - 64px)', display: 'flex', gap: 3, p: 3 }}>
      {/* Product Grid */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Products
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          placeholder="Search products by name or SKU..."
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: 'background.paper' }
          }}
        />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
          {isLoading && (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          )}
          {error && <Alert severity="error">Error fetching products: {error.message}</Alert>}
          
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  <CardActionArea onClick={() => addToCart(product)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={product.image || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, width: '100%' }}>
                      <Typography gutterBottom variant="subtitle1" fontWeight="bold" noWrap>
                        {product.name}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <Typography variant="body1" color="primary.main" fontWeight="bold">
                          Rp {product.sellingPrice.toLocaleString()}
                        </Typography>
                        {/* You could add stock count here later */}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Cart Sidebar */}
      <Paper 
        elevation={0}
        sx={{ 
          width: 400, 
          display: 'flex', 
          flexDirection: 'column',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.primaryContainer.main, color: theme.palette.primaryContainer.contrastText }}>
          <Box display="flex" alignItems="center" gap={1}>
            <ReceiptIcon />
            <Typography variant="h6" fontWeight="bold">
              Current Order
            </Typography>
          </Box>
          {selectedCustomer ? (
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="500">Customer: {selectedCustomer.name}</Typography>
              <Button size="small" onClick={() => setSelectedCustomer(null)} sx={{ color: 'inherit', minWidth: 'auto' }}>Clear</Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonIcon />}
              onClick={() => setCustomerSearchOpen(true)}
              sx={{ mt: 1, borderColor: 'inherit', color: 'inherit', '&:hover': { borderColor: 'inherit', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Add Customer
            </Button>
          )}
        </Box>

        <List sx={{ flexGrow: 1, overflowY: 'auto', px: 2 }}>
          {cart.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" opacity={0.5}>
              <ShoppingCartCheckoutIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography>Cart is empty</Typography>
            </Box>
          ) : (
            cart.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton edge="end" size="small" onClick={() => removeFromCart(item.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ px: 0, py: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={item.image || 'https://via.placeholder.com/40'} 
                      variant="rounded"
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                         <Typography variant="body2" color="text.secondary">
                           Rp {item.sellingPrice.toLocaleString()}
                         </Typography>
                         <Box display="flex" alignItems="center" bgcolor={theme.palette.action.hover} borderRadius={2}>
                           <IconButton size="small" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                             <RemoveIcon fontSize="small"/>
                           </IconButton>
                           <Typography variant="body2" fontWeight="bold" sx={{ px: 1 }}>{item.quantity}</Typography>
                           <IconButton size="small" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                             <AddIcon fontSize="small"/>
                           </IconButton>
                         </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>

        {/* Summary Section */}
        <Box sx={{ p: 3, bgcolor: theme.palette.background.default, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
            <Typography variant="body2">Rp {subtotal.toLocaleString()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body2" color="text.secondary">Tax (10%)</Typography>
            <Typography variant="body2">Rp {tax.toLocaleString()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight="bold">Total</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">Rp {total.toLocaleString()}</Typography>
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={handleOpenCheckout}
            disabled={cart.length === 0}
            startIcon={<CheckoutIcon />}
            sx={{ borderRadius: 3, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
          >
            Checkout
          </Button>
        </Box>
      </Paper>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutModalOpen} onClose={() => setCheckoutModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Typography variant="h5" fontWeight="bold">Complete Sale</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight="bold">
              Rp {total.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">Total Amount Due</Typography>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="ewallet">E-Wallet</MenuItem>
              <MenuItem value="transfer">Bank Transfer</MenuItem>
              <MenuItem value="qris">QRIS</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            label="Amount Received"
            type="number"
            fullWidth
            variant="outlined"
            value={amountReceived}
            onChange={(e) => setAmountReceived(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            }}
          />
          
          {parseFloat(amountReceived) > total && (
             <Alert severity="success" sx={{ mt: 2 }}>
               Change Due: Rp {(parseFloat(amountReceived) - total).toLocaleString()}
             </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setCheckoutModalOpen(false)} size="large" fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCompleteSale} 
            variant="contained" 
            size="large"
            disabled={createSalesOrderMutation.isLoading || !amountReceived}
            fullWidth
            sx={{ borderRadius: 2 }}
          >
            {createSalesOrderMutation.isLoading ? <CircularProgress size={24} /> : 'Complete Payment'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Search Customer Modal */}
      <Dialog open={isCustomerSearchOpen} onClose={() => setCustomerSearchOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select Customer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Search Customers"
            variant="outlined"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List>
            {customers.map((customer) => (
              <ListItem
                key={customer.id}
                button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setCustomerSearchOpen(false);
                  setCustomerSearch('');
                }}
              >
                <ListItemAvatar>
                   <Avatar><PersonIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText primary={customer.name} secondary={customer.email || customer.phone} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomerSearchOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
function ShoppingCartCheckoutIcon(props) {
  return <CheckoutIcon {...props} />;
}


export default POSPage;
