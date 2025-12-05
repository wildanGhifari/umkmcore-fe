// src/components/money/BalancePage.jsx
import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as MoneyInIcon,
  TrendingDown as MoneyOutIcon,
  AccountBalanceWallet as BalanceIcon,
  ShowChart as ChartIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AbstractIconContainer from '../AbstractIconContainer';

// Placeholder data - will be replaced with API
const mockBalanceData = {
  currentBalance: 2150000,
  cashIn: {
    today: 450000,
    thisWeek: 2800000,
    thisMonth: 11200000,
  },
  cashOut: {
    today: 250000,
    thisWeek: 1600000,
    thisMonth: 9050000,
  },
  profit: {
    today: 200000,
    thisWeek: 1200000,
    thisMonth: 2150000,
  },
};

function BalancePage() {
  const theme = useTheme();
  const data = mockBalanceData;

  const profitMargin = (data.profit.thisMonth / data.cashIn.thisMonth * 100).toFixed(1);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1, color: color }}>
              Rp {value.toLocaleString('id-ID')}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <AbstractIconContainer
            icon={Icon}
            bgColor={bgColor}
            iconColor={color}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Balance & Summary
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        View your business financial condition at a glance
      </Typography>

      {/* Current Balance - Large Card */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <BalanceIcon sx={{ fontSize: 64, color: 'white' }} />
            <Box>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
                Current Balance
              </Typography>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                Rp {data.currentBalance.toLocaleString('id-ID')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                Updated: {new Date().toLocaleString('en-US')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Today's Summary
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Cash In Today"
            value={data.cashIn.today}
            icon={MoneyInIcon}
            color={theme.palette.success.main}
            bgColor={theme.palette.success.light}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Cash Out Today"
            value={data.cashOut.today}
            icon={MoneyOutIcon}
            color={theme.palette.error.main}
            bgColor={theme.palette.error.light}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Profit Today"
            value={data.profit.today}
            icon={ChartIcon}
            color={theme.palette.info.main}
            bgColor={theme.palette.info.light}
          />
        </Grid>
      </Grid>

      {/* This Month Summary */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        This Month Summary
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Income & Expenses
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cash In
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    Rp {data.cashIn.thisMonth.toLocaleString('id-ID')}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{ height: 8, borderRadius: 4, bgcolor: 'success.light', '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cash Out
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    Rp {data.cashOut.thisMonth.toLocaleString('id-ID')}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(data.cashOut.thisMonth / data.cashIn.thisMonth) * 100}
                  sx={{ height: 8, borderRadius: 4, bgcolor: 'error.light', '& .MuiLinearProgress-bar': { bgcolor: 'error.main' } }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Net Profit
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Rp {data.profit.thisMonth.toLocaleString('id-ID')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profit Analysis
              </Typography>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Profit Margin
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    color: profitMargin > 20 ? 'success.main' : profitMargin > 10 ? 'warning.main' : 'error.main',
                  }}
                >
                  {profitMargin}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {profitMargin > 20
                    ? '✓ Excellent - Your business is healthy!'
                    : profitMargin > 10
                    ? '⚠ Good - Can be improved'
                    : '✗ Attention - Cost evaluation needed'}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">This Week</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Rp {data.profit.thisWeek.toLocaleString('id-ID')}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Today</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Rp {data.profit.today.toLocaleString('id-ID')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BalancePage;
