// src/components/money/CashOutPage.jsx
import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingDown as MoneyOutIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Placeholder data - will be replaced with API
const mockCashOutData = [
  { id: 1, date: '2025-12-03', category: 'Purchase', amount: 800000, notes: 'Coffee beans purchase' },
  { id: 2, date: '2025-12-02', category: 'Salary', amount: 500000, notes: 'Employee salary' },
  { id: 3, date: '2025-12-01', category: 'Utilities', amount: 150000, notes: 'Electricity and water' },
];

function CashOutPage() {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Purchase',
    amount: '',
    notes: '',
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'Purchase',
      amount: '',
      notes: '',
    });
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = () => {
    // TODO: Call API to save cash out
    console.log('Cash Out:', formData);
    handleCloseDialog();
  };

  const totalCashOut = mockCashOutData.reduce((sum, item) => sum + item.amount, 0);

  const categoryColors = {
    'Purchase': 'primary',
    'Salary': 'secondary',
    'Utilities': 'warning',
    'Rent': 'info',
    'Marketing': 'success',
    'Other': 'default',
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Cash Out
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Record all business expenses
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: '24px' }}
        >
          Add Expense
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <MoneyOutIcon sx={{ fontSize: 48, color: 'white' }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Expenses (This Month)
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Rp {totalCashOut.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Expense History
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCashOutData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{new Date(item.date).toLocaleDateString('en-US')}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.category}
                        size="small"
                        color={categoryColors[item.category]}
                      />
                    </TableCell>
                    <TableCell>{item.notes}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        Rp {item.amount.toLocaleString('id-ID')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Cash Out Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Category"
              select
              value={formData.category}
              onChange={handleChange('category')}
              fullWidth
            >
              <MenuItem value="Purchase">Material Purchase</MenuItem>
              <MenuItem value="Salary">Employee Salary</MenuItem>
              <MenuItem value="Utilities">Utilities (Electricity, Water)</MenuItem>
              <MenuItem value="Rent">Rent</MenuItem>
              <MenuItem value="Marketing">Marketing & Promotion</MenuItem>
              <MenuItem value="Maintenance">Maintenance & Repairs</MenuItem>
              <MenuItem value="Transportation">Transportation & Logistics</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              label="Amount (Rp)"
              type="number"
              value={formData.amount}
              onChange={handleChange('amount')}
              fullWidth
              placeholder="0"
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleChange('notes')}
              fullWidth
              multiline
              rows={3}
              placeholder="Additional notes (optional)"
            />
            <Alert severity="warning" sx={{ mt: 1 }}>
              Make sure to record every expense for accurate financial reports.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.amount}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CashOutPage;
