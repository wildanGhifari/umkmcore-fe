// src/components/reports/BestSellersReport.jsx
import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

// Placeholder data
const mockBestSellers = [
  { name: 'Cappuccino', sales: 245, revenue: 8575000, percentage: 100 },
  { name: 'Latte', sales: 198, revenue: 6930000, percentage: 81 },
  { name: 'Americano', sales: 156, revenue: 4680000, percentage: 64 },
  { name: 'Espresso', sales: 123, revenue: 3075000, percentage: 50 },
  { name: 'Mocha', sales: 89, revenue: 3115000, percentage: 36 },
];

function BestSellersReport() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Produk Terlaris
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Produk dengan penjualan tertinggi bulan ini
        </Typography>
      </Box>

      {/* Best Sellers List */}
      <Grid container spacing={3}>
        {mockBestSellers.map((product, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor:
                        index === 0
                          ? 'gold'
                          : index === 1
                          ? 'silver'
                          : index === 2
                          ? '#CD7F32'
                          : 'grey.300',
                      color: index < 3 ? 'white' : 'text.primary',
                    }}
                  >
                    {index === 0 ? (
                      <TrophyIcon sx={{ fontSize: 28 }} />
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        #{index + 1}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.sales} terjual • Rp {product.revenue.toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={product.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: index === 0 ? 'success.main' : index === 1 ? 'primary.main' : 'info.main',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BestSellersReport;
