import React, { useState } from 'react';
import { Box, Typography, Grid, Chip, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine, LineChart, Line } from 'recharts';

// --- Icon Imports ---
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PowerIcon from '@mui/icons-material/Power';

// --- Mock Data ---
const mockKilnData = {
  '8hours': Array.from({ length: 8 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    temp: 1420 + Math.sin(i / 2) * 15 + Math.random() * 10,
    pressure: 50 + Math.sin(i / 3) * 2 + Math.random() * 2,
    oxygen: 2.5 - Math.sin(i / 4) * 0.2 + Math.random() * 0.2,
  })),
  '24hours': Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    temp: 1410 + Math.sin(i / 4) * 20 + Math.random() * 15,
    pressure: 48 + Math.sin(i / 6) * 3 + Math.random() * 3,
    oxygen: 2.8 - Math.sin(i / 8) * 0.3 + Math.random() * 0.3,
  })),
  '7days': Array.from({ length: 7 }, (_, i) => ({
    time: `Day ${i + 1}`,
    temp: 1400 + Math.random() * 50,
    pressure: 45 + Math.random() * 10,
    oxygen: 2.5 + Math.random() * 1,
  })),
};

const operationalParameters = {
  kilnSpeed: { value: 3.5, unit: 'RPM', icon: <SpeedIcon /> },
  fuelConsumption: { value: 85, unit: 'tons/hr', icon: <WhatshotIcon /> },
  clinkerProduction: { value: 120, unit: 'tons/hr', icon: <PowerIcon /> },
  kilnTemp: { value: 1452, unit: '°C', icon: <WhatshotIcon /> },
  exhaustO2: { value: 3.2, unit: '%', icon: <SpeedIcon /> },
  motorPower: { value: 250, unit: 'kW', icon: <PowerIcon /> },
};

const recentAlerts = [
  { id: 1, type: 'Warning', message: 'High exhaust gas temperature detected', timestamp: '2025-09-19 10:30 AM' },
  { id: 2, type: 'Info', message: 'Kiln speed adjusted automatically', timestamp: '2025-09-19 09:45 AM' },
  { id: 3, type: 'Critical', message: 'Vibration levels exceed critical threshold in Zone 2', timestamp: '2025-09-19 08:15 AM' },
];

// --- Helper Components ---
const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const theme = useTheme();
  const config = {
    Operational: { label: 'Operational', color: theme.palette.success.main, icon: <CheckCircleOutlineOutlinedIcon /> },
    Warning: { label: 'Warning', color: theme.palette.warning.main, icon: <WarningAmberOutlinedIcon /> },
    Critical: { label: 'Critical', color: theme.palette.error.main, icon: <ErrorOutlineOutlinedIcon /> },
    Offline: { label: 'Offline', color: theme.palette.text.secondary, icon: <InfoOutlinedIcon /> },
  }[status] || { label: 'Unknown', color: theme.palette.text.secondary, icon: <InfoOutlinedIcon /> };

  return <Chip icon={config.icon} label={config.label} sx={{ backgroundColor: config.color, color: '#fff', fontWeight: 600 }} />;
};

const ParameterCard: React.FC<{ title: string; value: number; unit: string; icon: React.ReactNode }> = ({ title, value, unit, icon }) => (
  <Grid xs={12} sm={6} md={4} component="div">
    <Paper elevation={2} sx={{ height: '100%', p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
        {icon}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
        {value} <Typography variant="h6" component="span" color="text.secondary">{unit}</Typography>
      </Typography>
    </Paper>
  </Grid>
);

const AlertCard: React.FC<{ alert: typeof recentAlerts[0] }> = ({ alert }) => {
  const theme = useTheme();
  const alertConfig = {
    Warning: { color: theme.palette.warning.main, icon: <WarningAmberOutlinedIcon /> },
    Critical: { color: theme.palette.error.main, icon: <ErrorOutlineOutlinedIcon /> },
    Info: { color: theme.palette.info.main, icon: <InfoOutlinedIcon /> },
  };
  const config = alertConfig[alert.type as keyof typeof alertConfig];

  return (
    <Grid xs={12} component="div">
      <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, borderLeft: `4px solid ${config.color}` }}>
        <Box sx={{ mr: 2, color: config.color }}>{config.icon}</Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>{alert.message}</Typography>
          <Typography variant="caption" color="text.secondary">{alert.timestamp}</Typography>
        </Box>
      </Paper>
    </Grid>
  );
};




const ChartCard: React.FC<any> = ({ title, children }) => (
  <Grid xs={12} md={6} component="div">
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 350 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{title}</Typography>
      <Box sx={{ flex: 1, mt: 2 }}>
        {children}
      </Box>
    </Paper>
  </Grid>
);


// --- Main Component ---
const KilnHealthOverview: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('8hours');

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value as string);
  };

  const data = mockKilnData[timeRange as keyof typeof mockKilnData];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} component="div">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Kiln Health Overview</Typography>
            <Typography color="text.secondary">Detailed analysis of kiln performance and health metrics.</Typography>
          </Box>
          <StatusChip status="Operational" />
        </Grid>

        {/* Key Parameters */}
        <Grid xs={12}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Key Operational Parameters</Typography>
          <Grid container spacing={2}>
            <ParameterCard title="Kiln Speed" value={operationalParameters.kilnSpeed.value} unit={operationalParameters.kilnSpeed.unit} icon={operationalParameters.kilnSpeed.icon} />
            <ParameterCard title="Fuel Consumption" value={operationalParameters.fuelConsumption.value} unit={operationalParameters.fuelConsumption.unit} icon={operationalParameters.fuelConsumption.icon} />
            <ParameterCard title="Clinker Production" value={operationalParameters.clinkerProduction.value} unit={operationalParameters.clinkerProduction.unit} icon={operationalParameters.clinkerProduction.icon} />
            <ParameterCard title="Kiln Temperature" value={operationalParameters.kilnTemp.value} unit={operationalParameters.kilnTemp.unit} icon={operationalParameters.kilnTemp.icon} />
            <ParameterCard title="Exhaust Gas O₂" value={operationalParameters.exhaustO2.value} unit={operationalParameters.exhaustO2.unit} icon={operationalParameters.exhaustO2.icon} />
            <ParameterCard title="Motor Power" value={operationalParameters.motorPower.value} unit={operationalParameters.motorPower.unit} icon={operationalParameters.motorPower.icon} />
          </Grid>
        </Grid>

        {/* Trends Section */}
        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Kiln Trends</Typography>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} label="Time Range" onChange={handleTimeRangeChange}>
              <MenuItem value="8hours">Last 8 Hours</MenuItem>
              <MenuItem value="24hours">Last 24 Hours</MenuItem>
              <MenuItem value="7days">Last 7 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <ChartCard title="Temperature Trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="tempGradientOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.7}/>
                  <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: theme.palette.divider, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3] }} />
              <Legend />
              <ReferenceLine y={1480} label={{ value: 'Critical', position: 'insideTopLeft' }} stroke="red" strokeDasharray="3 3" />
              <ReferenceLine y={1460} label={{ value: 'Warning', position: 'insideTopLeft' }} stroke="orange" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke={theme.palette.secondary.dark} strokeWidth={2} fill="url(#tempGradientOverview)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pressure & Oxygen Levels">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
              <YAxis yAxisId="left" stroke={theme.palette.success.main} />
              <YAxis yAxisId="right" orientation="right" stroke={theme.palette.info.main} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: theme.palette.divider, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3] }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="pressure" name="Pressure (kPa)" stroke={theme.palette.success.main} strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="oxygen" name="Oxygen (%)" stroke={theme.palette.info.main} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Alerts */}
        <Grid xs={12} mt={2}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Recent Alerts</Typography>
          <Grid container spacing={2}>
            {recentAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default KilnHealthOverview;