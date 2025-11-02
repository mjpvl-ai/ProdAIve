import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Avatar, useTheme, CircularProgress } from '@mui/material';
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

// A reusable chart component to be displayed in both the overview and the fullscreen dialog
const WeeklyPerformanceChart = ({ data }: { data: any[] }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/overview`)
      .then(response => response.json())
      .then(data => {
        const transformedData = {
          system_health: {
            optimal: data.kiln_health.status === "Optimal" ? 1 : 0,
            warning: data.kiln_health.status === "Warning" ? 1 : 0,
            critical: data.kiln_health.status === "Critical" ? 1 : 0,
          },
          energy_snapshot: {
            consumption: data.energy_cockpit.fuel_consumption.currentRate,
            unit: data.energy_cockpit.fuel_consumption.unit || "t/h",
            comparison: ((data.energy_cockpit.fuel_consumption.currentRate - data.energy_cockpit.fuel_consumption.dailyAverage) / data.energy_cockpit.fuel_consumption.dailyAverage) * 100,
            target: data.energy_cockpit.energy_efficiency.target,
          },
          predictive_quality: {
            yield: data.predictive_quality.predicted_fcao,
            confidence: data.predictive_quality.confidence_interval,
          },
          weekly_performance: data.energy_cockpit.trends.map((trend: any) => ({
            name: trend.name,
            "Energy (MWh)": trend.consumption,
            "Warnings": 0, // Placeholder, as we don't have this data in the overview endpoint
            "Quality (%)": 100 - (trend.consumption / 300) * 10 // Placeholder for quality based on consumption
          })),
          process_flow: data.process_flow,
          action_log: data.action_log,
          recommendations: data.recommendations,
          variance_analysis: data.variance_analysis,
        };
        setOverviewData(transformedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching overview data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

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
              <Typography variant="body1"><strong>{overviewData?.system_health?.optimal || 0}</strong> Kilns Optimal</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>{overviewData?.system_health?.warning || 0}</strong> Kiln with Warnings</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>{overviewData?.system_health?.critical || 0}</strong> Kilns in Critical State</Typography>
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
            <Typography variant="h4" component="p" gutterBottom>{overviewData?.energy_snapshot?.consumption || 0} {overviewData?.energy_snapshot?.unit}</Typography>
            <Typography variant="body1" color={overviewData?.energy_snapshot?.comparison > 0 ? "error.main" : "success.main"}><strong>{overviewData?.energy_snapshot?.comparison || 0}%</strong> vs. yesterday</Typography>
            <Typography variant="body2" color="text.secondary">Target: {overviewData?.energy_snapshot?.target || 0} {overviewData?.energy_snapshot?.unit}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Predictive Quality Card */}
      <Grid item xs={12} md={6} lg={4} component="div">
        <Card sx={{ height: '100%' }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: '#2e7d32' }}><HighQualityIcon /></Avatar>}
            title="Predictive Quality"
            subheader="Next 24h forecast"
          />
          <CardContent>
            <Typography variant="h4" component="p" gutterBottom>{overviewData?.predictive_quality?.yield || 0}%</Typography>
            <Typography variant="body1" color="text.primary">Expected First-Pass Yield</Typography>
            <Typography variant="body2" color="text.secondary">Confidence: {overviewData?.predictive_quality?.confidence || 'N/A'}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly Performance Summary Chart */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Weekly Performance Summary" />
          <CardContent sx={{ cursor: 'pointer' }} onClick={() => onChartClick(<WeeklyPerformanceChart data={overviewData?.weekly_performance} />, "Weekly Performance Summary")}>
            <Box sx={{ height: 300 }}>
              <WeeklyPerformanceChart data={overviewData?.weekly_performance} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Realtime Flow Card */}
      <Grid item xs={12} component="div">
        <FlowDisplayCard
          onViewDetails={() => onChartClick(<FlowDisplay alertingNodeId={alertingNodeId} />, 'Realtime Process Flow')}
          alertingNodeId={alertingNodeId}
        />
      </Grid>

    </Grid>
  </Box>;
};