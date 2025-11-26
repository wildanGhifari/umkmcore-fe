// src/components/DashboardPage.jsx
import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  const renderDashboardContent = () => {
    if (!user) {
      return (
        <Typography variant="body1">
          Please log in to view the dashboard.
        </Typography>
      );
    }

    switch (user.role) {
      case 'admin':
        return (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1">
              Welcome, Admin {user.username}! Here you will see key metrics, charts, and quick access to all management features.
            </Typography>
            {/* TODO: Add Admin specific components/cards/charts */}
          </>
        );
      case 'manager':
        return (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Manager Dashboard
            </Typography>
            <Typography variant="body1">
              Welcome, Manager {user.username}! Here you will find sales trends, inventory overviews, and product management tools.
            </Typography>
            {/* TODO: Add Manager specific components/cards/charts */}
          </>
        );
      case 'staff':
        return (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Staff Dashboard
            </Typography>
            <Typography variant="body1">
              Welcome, Staff {user.username}! Your dashboard provides quick access to POS and your sales history.
            </Typography>
            {/* TODO: Add Staff specific components/cards/charts */}
          </>
        );
      default:
        return (
          <Typography variant="body1">
            Welcome, {user.username}! Your role ({user.role}) does not have a defined dashboard view.
          </Typography>
        );
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        {renderDashboardContent()}
      </Box>
    </Container>
  );
}

export default DashboardPage;
