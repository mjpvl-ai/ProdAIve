import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Avatar, useTheme } from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  WarningAmber as WarningAmberIcon,
  ErrorOutline as ErrorOutlineIcon,
  Whatshot as WhatshotIcon,
  Bolt as BoltIcon,
  HighQuality as HighQualityIcon,
} from '@mui/icons-material';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FlowDisplayCard from './FlowDisplayCard';
import FlowDisplay from './FlowDisplay';

// Mock data for the overview chart
const overviewChartData = [
  { name: 'Mon', 'Energy (MWh)': 26.5, 'Quality (%)': 98.2, 'Warnings': 1 },
  { name: 'Tue', 'Energy (MWh)': 27.1, 'Quality (%)': 98.0, 'Warnings': 2 },
  { name: 'Wed', 'Energy (MWh)': 26.2, 'Quality (%)': 98.4, 'Warnings': 1 },
  { name: 'Thu', 'Energy (MWh)': 25.5, 'Quality (%)': 98.6, 'Warnings': 0 },
  { name: 'Fri', 'Energy (MWh)': 25.8, 'Quality (%)': 98.5, 'Warnings': 1 },
  { name: 'Sat', 'Energy (MWh)': 24.9, 'Quality (%)': 98.8, 'Warnings': 0 },
  { name: 'Sun', 'Energy (MWh)': 25.1, 'Quality (%)': 98.7, 'Warnings': 0 },
];

// A reusable chart component to be displayed in both the overview and the fullscreen dialog
const WeeklyPerformanceChart = () => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={overviewChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
        <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} label={{ value: 'Energy (MWh)', angle: -90, position: 'insideLeft', fill: theme.palette.text.primary }} />
        <YAxis yAxisId="right" orientation="right" stroke={theme.palette.error.main} domain={[97, 100]} label={{ value: 'Quality (%)', angle: -90, position: 'insideRight', fill: theme.palette.text.primary }} />
        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
        <Legend />
        <Bar yAxisId="left" dataKey="Warnings" barSize={20} fill={theme.palette.warning.main} />
        <Line yAxisId="left" type="monotone" dataKey="Energy (MWh)" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="Quality (%)" stroke={theme.palette.error.main} strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// A more detailed placeholder Overview Component
export const Overview: React.FC<{
  onChartClick: (chart: React.ReactNode, title: string) => void;
  alertingNodeId: string | null;
}> = ({ onChartClick, alertingNodeId }) => {
  return <Box>
    <Typography variant="h4" gutterBottom>
      Dashboard Overview
    </Typography>
    <Grid container spacing={3}>
      {/* System Health Summary Card */}
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><WhatshotIcon /></Avatar>}
            title="System Health Summary"
            subheader="At-a-glance kiln status"
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>5</strong> Kilns Optimal</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>1</strong> Kiln with Warnings</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>0</strong> Kilns in Critical State</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Energy Snapshot Card */}
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><BoltIcon /></Avatar>}
            title="Energy Snapshot"
            subheader="Today's consumption vs. target"
          />
          <CardContent>
            <Typography variant="h4" component="p" gutterBottom>25.8 MWh</Typography>
            <Typography variant="body1" color="success.main"><strong>-5%</strong> vs. yesterday</Typography>
            <Typography variant="body2" color="text.secondary">Target: 27 MWh</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Predictive Quality Card */}
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: '#2e7d32' }}><HighQualityIcon /></Avatar>}
            title="Predictive Quality"
            subheader="Next 24h forecast"
          />
          <CardContent>
            <Typography variant="h4" component="p" gutterBottom>98.5%</Typography>
            <Typography variant="body1" color="text.primary">Expected First-Pass Yield</Typography>
            <Typography variant="body2" color="text.secondary">Confidence: High</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly Performance Summary Chart */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Weekly Performance Summary" />
          <CardContent sx={{ cursor: 'pointer' }} onClick={() => onChartClick(<WeeklyPerformanceChart />, "Weekly Performance Summary")}>
            <Box sx={{ height: 300 }}>
              <WeeklyPerformanceChart />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Realtime Flow Card */}
      <Grid item xs={12}>
        <FlowDisplayCard
          onViewDetails={() => onChartClick(<FlowDisplay alertingNodeId={alertingNodeId} />, 'Realtime Process Flow')}
          alertingNodeId={alertingNodeId}
        />
      </Grid>

    </Grid>
  </Box>;
};