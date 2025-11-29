// src/components/ReportsPage.jsx
import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import reports from './reports'; // Importing the report metadata

const ReportsPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Reports
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select a report to view detailed analytics and visualizations.
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.path}>
            <Card>
              <CardActionArea onClick={() => navigate(report.path)}>
                <CardContent sx={{ minHeight: 120 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReportsPage;
