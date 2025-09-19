import React from 'react';
import { Card, CardContent, Typography, Button, Box, LinearProgress, Chip } from '@mui/material';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import PredictiveQualityDashboard from './PredictiveQualityDashboard'; // The full component
import { useTheme } from '@mui/material/styles';

interface PredictiveQualityDashboardCardProps {
  isExpanded: boolean;
  onExpand: () => void;
}

const mockQualityData = [
  { name: 'Shift A', quality: 90 },
  { name: 'Shift B', quality: 92 },
  { name: 'Shift C', quality: 91 },
  { name: 'Shift D', quality: 93 },
  { name: 'Shift E', quality: 92.5 },
  { name: 'Shift F', quality: 94 },
];

const PredictiveQualityDashboardCard: React.FC<PredictiveQualityDashboardCardProps> = ({ isExpanded, onExpand }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Predictive Quality
          </Typography>
          <Button size="small" onClick={onExpand}>
            {isExpanded ? 'Collapse' : 'View Details'}
          </Button>
        </Box>
        {!isExpanded ? (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Chip label="Improving" color="success" sx={{ mb: 1, fontWeight: 500 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              93.5%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Predicted Clinker Quality
            </Typography>
            <Box sx={{ height: 80, width: '100%', mt: 1 }}>
              <ResponsiveContainer>
                <LineChart data={mockQualityData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <Line type="monotone" dataKey="quality" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                  <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <LinearProgress variant="determinate" value={93.5} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Confidence: High</Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <PredictiveQualityDashboard />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveQualityDashboardCard;
