import React from 'react';
import { Card, CardContent, Typography, Button, Box, LinearProgress, Chip } from '@mui/material';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import KilnHealthOverview from './KilnHealthOverview'; // The full component
import { useTheme } from '@mui/material/styles';

interface KilnHealthOverviewCardProps {
  isExpanded: boolean;
  onExpand: () => void;
}

const mockData = [
  { name: 'Hour 1', temp: 1400 },
  { name: 'Hour 2', temp: 1420 },
  { name: 'Hour 3', temp: 1410 },
  { name: 'Hour 4', temp: 1430 },
  { name: 'Hour 5', temp: 1425 },
  { name: 'Hour 6', temp: 1440 },
];

const KilnHealthOverviewCard: React.FC<KilnHealthOverviewCardProps> = ({ isExpanded, onExpand }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Kiln Health Overview
          </Typography>
          <Button size="small" onClick={onExpand}>
            {isExpanded ? 'Collapse' : 'View Details'}
          </Button>
        </Box>
        {!isExpanded ? (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Chip label="Stable" color="success" sx={{ mb: 1, fontWeight: 500 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              1430°C
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Avg. Temp (Last 6 hrs)
            </Typography>
            <Box sx={{ height: 80, width: '100%', mt: 1 }}>
              <ResponsiveContainer>
                <LineChart data={mockData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <Line type="monotone" dataKey="temp" stroke={theme.palette.secondary.main} strokeWidth={2} dot={false} />
                  <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <LinearProgress variant="determinate" value={85} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Box sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: 85 >= 90 ? theme.palette.success.main : (85 >= 70 ? theme.palette.warning.main : theme.palette.error.main),
                mr: 1,
              }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Overall Health Score: 85%</Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <KilnHealthOverview />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KilnHealthOverviewCard;
