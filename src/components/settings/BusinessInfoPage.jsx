// src/components/settings/BusinessInfoPage.jsx
import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';

function BusinessInfoPage() {
  const [formData, setFormData] = useState({
    storeName: 'Kedai Kopi Sederhana',
    ownerName: 'Budi Santoso',
    phone: '08123456789',
    email: 'kedaikopi@example.com',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    taxNumber: '01.234.567.8-910.000',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSave = () => {
    // TODO: Call API to save business info
    console.log('Save business info:', formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Business Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your store and business owner information
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Business information saved successfully!
        </Alert>
      )}

      {/* Business Info Form */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Business Details
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Store Name"
                value={formData.storeName}
                onChange={handleChange('storeName')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Owner Name"
                value={formData.ownerName}
                onChange={handleChange('ownerName')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange('phone')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Full Address"
                value={formData.address}
                onChange={handleChange('address')}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tax ID (Optional)"
                value={formData.taxNumber}
                onChange={handleChange('taxNumber')}
                fullWidth
                placeholder="00.000.000.0-000.000"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ borderRadius: '24px' }}
            >
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BusinessInfoPage;
