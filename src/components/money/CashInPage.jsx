// src/components/money/CashInPage.jsx
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
  TrendingUp as MoneyInIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Placeholder data - will be replaced with API
const mockCashInData = [
  { id: 1, date: '2025-12-03', source: 'Sales', amount: 1500000, notes: 'Daily POS sales' },
  { id: 2, date: '2025-12-02', source: 'Sales', amount: 1200000, notes: 'Daily POS sales' },
  { id: 3, date: '2025-12-01', source: 'Other', amount: 500000, notes: 'Customer payment' },
];

function CashInPage() {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    source: 'Sales',
    amount: '',
    notes: '',
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      source: 'Sales',
      amount: '',
      notes: '',
    });
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = () => {
    // TODO: Call API to save cash in
    console.log('Cash In:', formData);
    handleCloseDialog();
  };

  const totalCashIn = mockCashInData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Cash In
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Record all income for your business
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: '24px' }}
        >
          Add Cash In
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <MoneyInIcon sx={{ fontSize: 48, color: 'white' }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Cash In (This Month)
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Rp {totalCashIn.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cash In History
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCashInData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{new Date(item.date).toLocaleDateString('en-US')}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.source}
                        size="small"
                        color={item.source === 'Sales' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{item.notes}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
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

      {/* Add Cash In Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Cash In</DialogTitle>
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
              label="Source"
              select
              value={formData.source}
              onChange={handleChange('source')}
              fullWidth
            >
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Customer Payment">Customer Payment</MenuItem>
              <MenuItem value="Loan">Loan</MenuItem>
              <MenuItem value="Investment">Investment</MenuItem>
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
            <Alert severity="info" sx={{ mt: 1 }}>
              POS transactions are automatically recorded. You only need to add income from other sources.
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

export default CashInPage;
