import React, { useState } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceArea } from 'recharts';
import { motion } from 'framer-motion';

// --- Mock Data ---
const predictedFCAO = 2.15;
const confidenceInterval = '± 0.05';
const targetFCAORange = '2.0 - 2.3';
const targetFCAOMin = 2.0;
const targetFCAOMax = 2.3;

const fcaoData = {
  '24hours': [
    { name: '00:00', fcao: 2.1 },
    { name: '04:00', fcao: 2.15 },
    { name: '08:00', fcao: 2.2 },
    { name: '12:00', fcao: 2.18 },
    { name: '16:00', fcao: 2.25 },
    { name: '20:00', fcao: 2.23 },
  ],
  '7days': [
    { name: 'Day 1', fcao: 2.1 },
    { name: 'Day 2', fcao: 2.15 },
    { name: 'Day 3', fcao: 2.2 },
    { name: 'Day 4', fcao: 2.18 },
    { name: 'Day 5', fcao: 2.25 },
    { name: 'Day 6', fcao: 2.23 },
    { name: 'Day 7', fcao: 2.19 },
  ],
  '30days': [
    { name: 'Week 1', fcao: 2.12 },
    { name: 'Week 2', fcao: 2.18 },
    { name: 'Week 3', fcao: 2.21 },
    { name: 'Week 4', fcao: 2.15 },
  ],
};

const correlationData = {
  '24hours': [
    { temp: 1400, fcao: 2.05 },
    { temp: 1410, fcao: 2.10 },
    { temp: 1420, fcao: 2.18 },
    { temp: 1430, fcao: 2.25 },
    { temp: 1440, fcao: 2.20 },
    { temp: 1450, fcao: 2.30 },
    { temp: 1460, fcao: 2.28 },
  ],
  '7days': [
    { temp: 1405, fcao: 2.08 },
    { temp: 1415, fcao: 2.12 },
    { temp: 1425, fcao: 2.20 },
    { temp: 1435, fcao: 2.27 },
    { temp: 1445, fcao: 2.22 },
    { temp: 1455, fcao: 2.32 },
    { temp: 1465, fcao: 2.30 },
  ],
  '30days': [
    { temp: 1410, fcao: 2.10 },
    { temp: 1420, fcao: 2.15 },
    { temp: 1430, fcao: 2.20 },
    { temp: 1440, fcao: 2.25 },
    { temp: 1450, fcao: 2.20 },
    { temp: 1460, fcao: 2.28 },
    { temp: 1470, fcao: 2.35 },
  ],
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface PredictiveQualityDashboardProps {
  onChartClick?: (element: React.ReactNode, title: string) => void;
}

const FcaoTrendChart: React.FC<{ data: any[] }> = ({ data }) => {
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
        <ReferenceArea y1={targetFCAOMin} y2={targetFCAOMax} strokeOpacity={0.3} fill={theme.palette.success.light} />
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
  const [timeRange, setTimeRange] = useState('7days');

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value as string);
  };

  // Calculate KPIs based on current time range data
  const currentFCAOData = fcaoData[timeRange as keyof typeof fcaoData];
  const averageFCAO = (currentFCAOData.reduce((sum, entry) => sum + entry.fcao, 0) / currentFCAOData.length).toFixed(2);
  const inTargetRangeCount = currentFCAOData.filter(entry => entry.fcao >= targetFCAOMin && entry.fcao <= targetFCAOMax).length;
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
              {predictedFCAO}
              <Typography variant="h4" component="span" sx={{ ml: 0.5, color: 'text.secondary' }}>
                %
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Confidence: {confidenceInterval}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Target Range: {targetFCAORange}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper component={motion.div} variants={cardVariants} sx={{ height: '100%', p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>Average f-CaO ({timeRange === '24hours' ? '24H' : timeRange === '7days' ? '7D' : '30D'})</Typography>
            <Typography variant="h2" color="secondary" sx={{ mt: 1, fontWeight: 700 }}>
              {averageFCAO}
              <Typography variant="h4" component="span" sx={{ ml: 0.5, color: 'text.secondary' }}>
                %
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Target: {targetFCAORange}
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
            onClick={onChartClick ? () => onChartClick(<FcaoTrendChart data={fcaoData[timeRange as keyof typeof fcaoData]} />, 'Historical f-CaO Trends') : undefined}
            headerContent={
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel>Time Range</InputLabel>
                <Select value={timeRange} label="Time Range" onChange={handleTimeRangeChange}>
                  <MenuItem value={"24hours"}>Last 24 Hours</MenuItem>
                  <MenuItem value={"7days"}>Last 7 Days</MenuItem>
                  <MenuItem value={"30days"}>Last 30 Days</MenuItem>
                </Select>
              </FormControl>
            }
          >
            <FcaoTrendChart data={fcaoData[timeRange as keyof typeof fcaoData]} />
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Correlation Analysis: Kiln Temperature vs. f-CaO"
            onClick={onChartClick ? () => onChartClick(<CorrelationChart data={correlationData[timeRange as keyof typeof correlationData]} />, 'Correlation Analysis: Kiln Temperature vs. f-CaO') : undefined}
          >
            <CorrelationChart data={correlationData[timeRange as keyof typeof correlationData]} />
          </ChartCard>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default PredictiveQualityDashboard;