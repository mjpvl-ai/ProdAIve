import React, { useState } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { motion } from 'framer-motion';

// --- Mock Data ---
const predictedFCAO = 2.15;
const confidenceInterval = '± 0.05';
const targetFCAORange = '2.0 - 2.3';

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

const PredictiveQualityDashboard: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7days');

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value as string);
  };

  return (
    <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
      <Grid container spacing={3}>
        <Grid xs={12} component="div">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Predictive Quality Dashboard</Typography>
        </Grid>

        <Grid xs={12} md={4} component="div">
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

        <Grid xs={12} md={8} component="div">
          <Paper component={motion.div} variants={cardVariants} sx={{ height: '100%', p: 3, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', minHeight: 350 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Historical f-CaO Trends</Typography>
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel>Time Range</InputLabel>
                <Select value={timeRange} label="Time Range" onChange={handleTimeRangeChange}>
                  <MenuItem value={"24hours"}>Last 24 Hours</MenuItem>
                  <MenuItem value={"7days"}>Last 7 Days</MenuItem>
                  <MenuItem value={"30days"}>Last 30 Days</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box id="fcao-chart-container" sx={{ flex: 1, height: '300px' }}>
              {console.log('FCAO Data for chart:', fcaoData[timeRange as keyof typeof fcaoData])}
              {console.log('Parent Box height (FCAO):', document.getElementById('fcao-chart-container')?.clientHeight)}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fcaoData[timeRange as keyof typeof fcaoData]}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: theme.palette.divider, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3] }} />
                  <Legend />
                  <Line type="monotone" dataKey="fcao" name="f-CaO" stroke={theme.palette.primary.main} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} component="div">
          <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', minHeight: 350 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Correlation Analysis: Kiln Temperature vs. f-CaO</Typography>
            </Box>
            <Box id="correlation-chart-container" sx={{ flex: 1, height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                {console.log('CorrelationData for chart:', correlationData[timeRange as keyof typeof correlationData])}
                {console.log('Parent Box height (Correlation):', document.getElementById('correlation-chart-container')?.clientHeight)}
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis type="number" dataKey="temp" name="Kiln Temperature" unit="°C" stroke={theme.palette.text.secondary} />
                  <YAxis type="number" dataKey="fcao" name="f-CaO" stroke={theme.palette.text.secondary} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: theme.palette.divider, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3] }} />
                  <Legend />
                  <Scatter name="f-CaO vs Temp" data={correlationData[timeRange as keyof typeof correlationData]} fill={theme.palette.secondary.main} />
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default PredictiveQualityDashboard;