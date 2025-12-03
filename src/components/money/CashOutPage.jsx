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
  { id: 1, date: '2025-12-03', category: 'Purchase', amount: 800000, notes: 'Beli bahan baku kopi' },
  { id: 2, date: '2025-12-02', category: 'Salary', amount: 500000, notes: 'Gaji karyawan' },
  { id: 3, date: '2025-12-01', category: 'Utilities', amount: 150000, notes: 'Listrik & air' },
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
            Uang Keluar (Cash Out)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Catat semua pengeluaran bisnis Anda
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: '24px' }}
        >
          Tambah Pengeluaran
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <MoneyOutIcon sx={{ fontSize: 48, color: 'white' }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Pengeluaran (Bulan Ini)
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
            Riwayat Pengeluaran
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Kategori</TableCell>
                  <TableCell>Keterangan</TableCell>
                  <TableCell align="right">Jumlah</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCashOutData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{new Date(item.date).toLocaleDateString('id-ID')}</TableCell>
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
        <DialogTitle>Tambah Pengeluaran</DialogTitle>
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
              label="Kategori"
              select
              value={formData.category}
              onChange={handleChange('category')}
              fullWidth
            >
              <MenuItem value="Purchase">Pembelian Bahan</MenuItem>
              <MenuItem value="Salary">Gaji Karyawan</MenuItem>
              <MenuItem value="Utilities">Utilitas (Listrik, Air)</MenuItem>
              <MenuItem value="Rent">Sewa Tempat</MenuItem>
              <MenuItem value="Marketing">Promosi & Marketing</MenuItem>
              <MenuItem value="Maintenance">Perawatan & Perbaikan</MenuItem>
              <MenuItem value="Transportation">Transport & Logistik</MenuItem>
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
            <Alert severity="warning" sx={{ mt: 1 }}>
              Pastikan setiap pengeluaran dicatat untuk laporan keuangan yang akurat.
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

export default CashOutPage;
