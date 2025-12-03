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
            Uang Masuk (Cash In)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Catat semua uang yang masuk ke bisnis Anda
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: '24px' }}
        >
          Tambah Uang Masuk
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <MoneyInIcon sx={{ fontSize: 48, color: 'white' }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Uang Masuk (Bulan Ini)
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
            Riwayat Uang Masuk
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Sumber</TableCell>
                  <TableCell>Keterangan</TableCell>
                  <TableCell align="right">Jumlah</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCashInData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{new Date(item.date).toLocaleDateString('id-ID')}</TableCell>
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
        <DialogTitle>Tambah Uang Masuk</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tanggal"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Sumber"
              select
              value={formData.source}
              onChange={handleChange('source')}
              fullWidth
            >
              <MenuItem value="Sales">Penjualan (Sales)</MenuItem>
              <MenuItem value="Customer Payment">Pembayaran Customer</MenuItem>
              <MenuItem value="Loan">Pinjaman</MenuItem>
              <MenuItem value="Investment">Modal</MenuItem>
              <MenuItem value="Other">Lainnya</MenuItem>
            </TextField>
            <TextField
              label="Jumlah (Rp)"
              type="number"
              value={formData.amount}
              onChange={handleChange('amount')}
              fullWidth
              placeholder="0"
            />
            <TextField
              label="Keterangan"
              value={formData.notes}
              onChange={handleChange('notes')}
              fullWidth
              multiline
              rows={3}
              placeholder="Catatan tambahan (opsional)"
            />
            <Alert severity="info" sx={{ mt: 1 }}>
              Uang dari POS otomatis tercatat. Anda hanya perlu menambahkan uang masuk dari sumber lain.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.amount}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CashInPage;
