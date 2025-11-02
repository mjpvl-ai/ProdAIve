import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Paper, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceArea } from 'recharts';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface PredictiveQualityDashboardProps {
  onChartClick?: (element: React.ReactNode, title: string) => void;
}

const FcaoTrendChart: React.FC<{ data: any[], targetMin: number, targetMax: number }> = ({ data, targetMin, targetMax }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: theme.palette.divider, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3] }}
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'f-CaO']}
          labelFormatter={(label: string) => `Time: ${label}`}
        />
        <Legend />
        <ReferenceArea y1={targetMin} y2={targetMax} strokeOpacity={0.3} fill={theme.palette.success.light} />
        <Line type="monotone" dataKey="fcao" name="f-CaO" stroke={theme.palette.primary.main} strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const CorrelationChart: React.FC<{ data: any[] }> = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis type="number" dataKey="temp" name="Kiln Temperature" unit="°C" stroke={theme.palette.text.secondary} />
        <YAxis type="number" dataKey="fcao" name="f-CaO" unit="%" stroke={theme.palette.text.secondary} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: theme.palette.divider, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3] }} />
        <Legend />
        <Scatter name="f-CaO vs Temp" fill={theme.palette.secondary.main} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

const ChartCard: React.FC<any> = ({ title, children, onClick, headerContent }) => (
  <Paper component={motion.div} variants={cardVariants} sx={{ height: '100%', p: 3, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', minHeight: 350 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
      {headerContent}
    </Box>
    <Box sx={{ flex: 1, height: '300px', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      {children}
    </Box>
  </Paper>
);

const PredictiveQualityDashboard: React.FC<PredictiveQualityDashboardProps> = ({ onChartClick }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [qualityData, setQualityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/predictive_quality?timerange=${timeRange}`);
        const data = await response.json();
        setQualityData(data);
      } catch (err) {
        setError('Failed to fetch predictive quality data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value as string);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const currentFCAOData = qualityData?.trends;
  const averageFCAO = (currentFCAOData.reduce((sum: any, entry: any) => sum + entry.fcao, 0) / currentFCAOData.length).toFixed(2);
  const inTargetRangeCount = currentFCAOData.filter((entry: any) => entry.fcao >= qualityData?.target_fcao_min && entry.fcao <= qualityData?.target_fcao_max).length;
  const inTargetRangePercentage = ((inTargetRangeCount / currentFCAOData.length) * 100).toFixed(1);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} component="div">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Predictive Quality Dashboard</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper component={motion.div} variants={cardVariants} sx={{ height: '100%', p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>Real-time f-CaO Prediction</Typography>
            <Typography variant="h2" color="primary" sx={{ mt: 1, fontWeight: 700 }}>
              {qualityData?.predicted_fcao}
              <Typography variant="h4" component="span" sx={{ ml: 0.5, color: 'text.secondary' }}>
                %
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Confidence: {qualityData?.confidence_interval}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Target Range: {qualityData?.target_fcao_range}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper component={motion.div} variants={cardVariants} sx={{ height: '100%', p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>Average f-CaO ({timeRange === '24h' ? '24H' : '7D'})</Typography>
            <Typography variant="h2" color="secondary" sx={{ mt: 1, fontWeight: 700 }}>
              {averageFCAO}
              <Typography variant="h4" component="span" sx={{ ml: 0.5, color: 'text.secondary' }}>
                %
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Target: {qualityData?.target_fcao_range}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper component={motion.div} variants={cardVariants} sx={{ height: '100%', p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>% In Target Range</Typography>
            <Typography variant="h2" color="success.main" sx={{ mt: 1, fontWeight: 700 }}>
              {inTargetRangePercentage}
              <Typography variant="h4" component="span" sx={{ ml: 0.5, color: 'text.secondary' }}>
                %
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              ({inTargetRangeCount} of {currentFCAOData.length} data points)
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} component="div">
          <ChartCard
            title="Historical f-CaO Trends"
            onClick={onChartClick ? () => onChartClick(<FcaoTrendChart data={qualityData?.trends} targetMin={qualityData?.target_fcao_min} targetMax={qualityData?.target_fcao_max} />, 'Historical f-CaO Trends') : undefined}
            headerContent={
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel>Time Range</InputLabel>
                <Select value={timeRange} label="Time Range" onChange={handleTimeRangeChange}>
                  <MenuItem value={"24h"}>Last 24 Hours</MenuItem>
                  <MenuItem value={"7d"}>Last 7 Days</MenuItem>
                </Select>
              </FormControl>
            }
          >
            <FcaoTrendChart data={qualityData?.trends} targetMin={qualityData?.target_fcao_min} targetMax={qualityData?.target_fcao_max} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Correlation Analysis: Kiln Temperature vs. f-CaO"
            onClick={onChartClick ? () => onChartClick(<CorrelationChart data={qualityData?.correlation_data} />, 'Correlation Analysis: Kiln Temperature vs. f-CaO') : undefined}
          >
            <CorrelationChart data={qualityData?.correlation_data} />
          </ChartCard>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default PredictiveQualityDashboard;