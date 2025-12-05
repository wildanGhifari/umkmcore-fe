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
          Notification Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure which notifications you want to receive
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Notification settings saved successfully!
        </Alert>
      )}

      {/* Notification Settings */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Business Notifications
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch checked={settings.lowStockAlert} onChange={handleChange('lowStockAlert')} />}
              label={
                <Box>
                  <Typography variant="body1">Low Stock Alert</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get notified when material stock is running low
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
                  <Typography variant="body1">Daily Sales Report</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sales summary sent daily at 10 PM
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
                  <Typography variant="body1">New Order</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get notified for every new order
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
                  <Typography variant="body1">Payment Reminder</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notifications for due payments
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Notification Channels
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch checked={settings.whatsappNotifications} onChange={handleChange('whatsappNotifications')} />}
              label={
                <Box>
                  <Typography variant="body1">WhatsApp</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive notifications via WhatsApp
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
                    Receive notifications via email
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
              Save Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NotificationsPage;
