import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Chip, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine, LineChart, Line } from 'recharts';

// --- Icon Imports ---
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WhatshotIcon from '@mui/icons-material/Whatshot';

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
  <Grid item xs={12} sm={6} md={4} component="div">
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

const AlertCard: React.FC<{ alert: any }> = ({ alert }) => {
  const theme = useTheme();
  const alertConfig = {
    Warning: { color: theme.palette.warning.main, icon: <WarningAmberOutlinedIcon /> },
    Critical: { color: theme.palette.error.main, icon: <ErrorOutlineOutlinedIcon /> },
    Info: { color: theme.palette.info.main, icon: <InfoOutlinedIcon /> },
  };
  const config = alertConfig[alert.type as keyof typeof alertConfig];

  return (
    <Grid item xs={12} component="div">
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


const TemperatureTrendChart: React.FC<{ data: any[] }> = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="tempGradientOverview" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.7} />
            <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
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
  );
};

const PressureOxygenChart: React.FC<{ data: any[] }> = ({ data }) => {
  const theme = useTheme();
  return (
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
  );
};

const ChartCard: React.FC<any> = ({ title, children, onClick }) => (
  <Grid item xs={12} component="div">
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 350 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{title}</Typography>
      <Box sx={{ flex: 1, mt: 2, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
        {children}
      </Box>
    </Paper>
  </Grid>);


// --- Main Component ---
const KilnHealthOverview: React.FC<{ onChartClick?: (element: React.ReactNode, title: string) => void }> = ({ onChartClick }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [kilnData, setKilnData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kiln_health?timerange=${timeRange}`)
      .then(response => response.json())
      .then(data => {
        setKilnData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching kiln health data:', error);
        setLoading(false);
      });
  }, [timeRange]);

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value as string);
  };

  if (loading) {
    return <CircularProgress />;
  }

  const data = kilnData?.trends;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Header and Status */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} component="div">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Kiln Health Overview</Typography>
            <Typography color="text.secondary">Detailed analysis of kiln performance and health metrics.</Typography>
          </Box>
          <StatusChip status={kilnData?.status || 'Offline'} />
        </Grid>

        {/* Key Operational Parameters */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Key Operational Parameters</Typography>
          <Grid container spacing={2}>
            <ParameterCard title="Fuel Consumption" value={kilnData?.operational_parameters?.fuel_consumption.value} unit={kilnData?.operational_parameters?.fuel_consumption.unit} icon={<WhatshotIcon />} />
            <ParameterCard title="Kiln Temperature" value={kilnData?.operational_parameters?.kiln_temp.value} unit={kilnData?.operational_parameters?.kiln_temp.unit} icon={<WhatshotIcon />} />
          </Grid>
        </Grid>

        {/* Trends Section Header */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Kiln Trends</Typography>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} label="Time Range" onChange={handleTimeRangeChange}>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Trend Charts */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <ChartCard
              title="Temperature Trend"
              onClick={onChartClick ? () => onChartClick(<TemperatureTrendChart data={data} />, 'Temperature Trend') : undefined}
            >
              <TemperatureTrendChart data={data} />
            </ChartCard>

            <ChartCard
              title="Pressure & Oxygen Levels"
              onClick={onChartClick ? () => onChartClick(<PressureOxygenChart data={data} />, 'Pressure & Oxygen Levels') : undefined}
            >
              <PressureOxygenChart data={data} />
            </ChartCard>
          </Grid>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} mt={2} component="div">
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Recent Alerts</Typography>
          <Grid container spacing={2}>
            {kilnData?.recent_alerts.map((alert: any) => <AlertCard key={alert.id} alert={alert} />)}
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default KilnHealthOverview;
