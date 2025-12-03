// src/components/settings/NotificationsPage.jsx
import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';

function NotificationsPage() {
  const [settings, setSettings] = useState({
    lowStockAlert: true,
    dailySalesReport: true,
    newOrderNotification: false,
    paymentReminder: true,
    emailNotifications: false,
    whatsappNotifications: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (event) => {
    setSettings({ ...settings, [field]: event.target.checked });
  };

  const handleSave = () => {
    // TODO: Call API to save notification settings
    console.log('Save notification settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pengaturan Notifikasi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Atur notifikasi yang ingin Anda terima
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Pengaturan notifikasi berhasil disimpan!
        </Alert>
      )}

      {/* Notification Settings */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notifikasi Bisnis
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch checked={settings.lowStockAlert} onChange={handleChange('lowStockAlert')} />}
              label={
                <Box>
                  <Typography variant="body1">Peringatan Stok Rendah</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notifikasi ketika stok bahan hampir habis
                  </Typography>
                </Box>
              }
              sx={{ mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={<Switch checked={settings.dailySalesReport} onChange={handleChange('dailySalesReport')} />}
              label={
                <Box>
                  <Typography variant="body1">Laporan Penjualan Harian</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ringkasan penjualan dikirim setiap hari jam 10 malam
                  </Typography>
                </Box>
              }
              sx={{ mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={<Switch checked={settings.newOrderNotification} onChange={handleChange('newOrderNotification')} />}
              label={
                <Box>
                  <Typography variant="body1">Pesanan Baru</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notifikasi setiap ada pesanan baru masuk
                  </Typography>
                </Box>
              }
              sx={{ mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={<Switch checked={settings.paymentReminder} onChange={handleChange('paymentReminder')} />}
              label={
                <Box>
                  <Typography variant="body1">Pengingat Pembayaran</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notifikasi untuk pembayaran yang jatuh tempo
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Channel Notifikasi
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch checked={settings.whatsappNotifications} onChange={handleChange('whatsappNotifications')} />}
              label={
                <Box>
                  <Typography variant="body1">WhatsApp</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Terima notifikasi via WhatsApp
                  </Typography>
                </Box>
              }
              sx={{ mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={<Switch checked={settings.emailNotifications} onChange={handleChange('emailNotifications')} />}
              label={
                <Box>
                  <Typography variant="body1">Email</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Terima notifikasi via email
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ borderRadius: '24px' }}
            >
              Simpan Pengaturan
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NotificationsPage;
