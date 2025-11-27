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
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search as SearchIcon, AddCircle as AddIcon, RemoveCircle as RemoveIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import productService from '../services/productService';
import salesOrderService from '../services/salesOrderService';
import customerService from '../services/customerService';
import { useSnackbar } from '../context/SnackbarContext';

const POSPage = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerSearchOpen, setCustomerSearchOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 1, 50, search, ''], // Fetch up to 50 products for POS
    queryFn: () => productService.getProducts(1, 50, search, ''),
    keepPreviousData: true,
  });

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
      totalAmount: total,
      taxAmount: tax,
      paymentMethod,
      customerId: selectedCustomer?.id || null,
    };
    createSalesOrderMutation.mutate(orderData);
  };

  return (
    <Container maxWidth={false} sx={{ height: 'calc(100vh - 64px)', display: 'flex', p: '0 !important' }}>
      {/* Product Grid */}
      <Box sx={{ flex: 3, p: 2, overflowY: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Point of Sale
        </Typography>
        <TextField
          fullWidth
          label="Search Products"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">Error fetching products: {error.message}</Alert>}
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card>
                <CardActionArea onClick={() => addToCart(product)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`Rp ${product.sellingPrice}`}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Cart Sidebar */}
      <Box sx={{ flex: 1, p: 2, borderLeft: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Current Order
        </Typography>
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <ListItem>
              <ListItemText primary="Cart is empty" />
            </ListItem>
          ) : (
            cart.map((item) => (
              <ListItem key={item.id} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemAvatar>
                  <Avatar src={item.image || 'https://via.placeholder.com/40'} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`Rp ${item.sellingPrice}`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                  <IconButton size="small" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))
          )}
        </List>
        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1">Subtotal: Rp {subtotal.toFixed(2)}</Typography>
          <Typography variant="body1">Tax (10%): Rp {tax.toFixed(2)}</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Total: Rp {total.toFixed(2)}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            {selectedCustomer ? (
              <>
                <Typography variant="body2">Customer: {selectedCustomer.name}</Typography>
                <Button size="small" onClick={() => setSelectedCustomer(null)}>Clear</Button>
              </>
            ) : (
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => setCustomerSearchOpen(true)}
              >
                Select Customer
              </Button>
            )}
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleOpenCheckout}
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
        </Box>
      </Box>
      {/* Checkout Modal */}
      <Dialog open={isCheckoutModalOpen} onClose={() => setCheckoutModalOpen(false)}>
        <DialogTitle>Complete Sale</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Typography variant="subtitle1" gutterBottom>
              Customer: {selectedCustomer.name}
            </Typography>
          )}
          <Typography variant="h6" gutterBottom>Total: Rp {total.toFixed(2)}</Typography>
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Digital Wallet">Digital Wallet</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Amount Received"
            type="number"
            fullWidth
            variant="outlined"
            value={amountReceived}
            onChange={(e) => setAmountReceived(e.target.value)}
            required
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Change: Rp {Math.max(0, amountReceived - total).toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutModalOpen(false)} disabled={createSalesOrderMutation.isLoading}>Cancel</Button>
          <Button onClick={handleCompleteSale} variant="contained" disabled={createSalesOrderMutation.isLoading}>
            {createSalesOrderMutation.isLoading ? <CircularProgress size={24} /> : 'Complete Sale'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Customer Search Modal */}
      <Dialog open={isCustomerSearchOpen} onClose={() => setCustomerSearchOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select Customer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Search Customers"
            variant="outlined"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {customersLoading && <CircularProgress />}
          {customersError && <Alert severity="error">Error fetching customers: {customersError.message}</Alert>}
          <List>
            {customers.map((customer) => (
              <ListItem
                key={customer.id}
                button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setCustomerSearchOpen(false);
                  setCustomerSearch(''); // Clear search after selection
                }}
              >
                <ListItemText primary={customer.name} secondary={customer.email} />
              </ListItem>
            ))}
            {customers.length === 0 && customerSearch.length > 0 && !customersLoading && (
              <ListItem>
                <ListItemText primary="No customers found." />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomerSearchOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default POSPage;
