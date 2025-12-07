// src/components/RegistrationPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
  MenuItem,
  CircularProgress
} from '@mui/material';
import authService from '../services/authService';

const steps = ['Company Details', 'Store Details', 'Admin Account'];

function RegistrationPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    // Company
    companyName: '',
    companyCode: '', // Optional/Auto-generated
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    companyAddress: '',
    companyCity: '',
    companyProvince: '',
    companyPostalCode: '',
    
    // Store
    storeName: '',
    storePhone: '',
    storeAddress: '',
    storeCity: '',
    storeProvince: '',
    storePostalCode: '',

    // Admin
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setError(null);
    if (!validateStep(activeStep)) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateStep = (step) => {
    if (step === 0) {
      if (!formData.companyName) {
        setError("Company Name is required.");
        return false;
      }
    }
    if (step === 1) {
      if (!formData.storeName) {
        setError("Store Name is required.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
        setError("All Admin fields are required.");
        return false;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(activeStep)) return;
    
    setLoading(true);
    setError(null);

    // Construct Payload
    const payload = {
      company: {
        companyName: formData.companyName,
        companyCode: formData.companyCode || undefined,
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        address: formData.companyAddress,
        city: formData.companyCity,
        province: formData.companyProvince,
        postalCode: formData.companyPostalCode,
      },
      store: {
        name: formData.storeName,
        phone: formData.storePhone,
        address: formData.storeAddress,
        city: formData.storeCity,
        province: formData.storeProvince,
        postalCode: formData.storePostalCode,
      },
      admin: {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
      }
    };

    try {
      await authService.register(payload);
      navigate('/login');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Company Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required fullWidth label="Company Name" name="companyName"
                value={formData.companyName} onChange={handleChange} autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Company Code (Optional/Auto)" name="companyCode"
                value={formData.companyCode} onChange={handleChange}
                helperText="Leave empty to auto-generate"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Owner Name" name="ownerName"
                value={formData.ownerName} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Owner Phone" name="ownerPhone"
                value={formData.ownerPhone} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Address" name="companyAddress"
                value={formData.companyAddress} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="City" name="companyCity"
                value={formData.companyCity} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Province" name="companyProvince"
                value={formData.companyProvince} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Postal Code" name="companyPostalCode"
                value={formData.companyPostalCode} onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>First Store Details</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required fullWidth label="Store Name" name="storeName"
                value={formData.storeName} onChange={handleChange} autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Store Phone" name="storePhone"
                value={formData.storePhone} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Address" name="storeAddress"
                value={formData.storeAddress} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="City" name="storeCity"
                value={formData.storeCity} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Province" name="storeProvince"
                value={formData.storeProvince} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Postal Code" name="storePostalCode"
                value={formData.storePostalCode} onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Create Admin Account</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required fullWidth label="Full Name" name="fullName"
                value={formData.fullName} onChange={handleChange} autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required fullWidth label="Username" name="username"
                value={formData.username} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required fullWidth label="Email" name="email"
                value={formData.email} onChange={handleChange} type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required fullWidth label="Password" name="password"
                value={formData.password} onChange={handleChange} type="password"
                helperText="Min. 8 characters, uppercase, lowercase, & number"
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4, height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, width: '100%', borderRadius: 3 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom fontWeight="bold">
          Register Company
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? <CircularProgress size={24} /> : (activeStep === steps.length - 1 ? 'Register' : 'Next')}
            </Button>
          </Box>
          
           <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegistrationPage;
