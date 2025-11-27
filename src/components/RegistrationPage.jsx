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
} from '@mui/material';
import authService from '../services/authService';

const steps = ['Store Information', 'Admin Information'];

function RegistrationPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await authService.register(storeName, storeCode, fullName, username, email, password);
      navigate('/login');
    } catch (e) {
      setError(e.message);
    }
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="storeName"
              label="Store Name"
              name="storeName"
              autoComplete="store-name"
              autoFocus
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="storeCode"
              label="Store Code"
              name="storeCode"
              autoComplete="store-code"
              value={storeCode}
              onChange={(e) => setStoreCode(e.target.value)}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Admin Full Name"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Admin Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Admin Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Admin Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h5">
          Register New Store
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5, width: '100%' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}

            <Button
              variant="contained"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
            >
              {activeStep === steps.length - 1 ? 'Register' : 'Next'}
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegistrationPage;
