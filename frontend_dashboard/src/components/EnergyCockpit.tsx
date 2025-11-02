import React, { useState, useEffect, type ReactNode } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import EnergyCockpitCard from './EnergyCockpitCard';

// interface EnergyDataPoint {
//   name: string;
//   consumption: number;
// }



interface EnergyCockpitProps {
  onChartClick: (element: ReactNode, title: string) => void;
}

const EnergyCockpit: React.FC<EnergyCockpitProps> = ({ onChartClick }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7d');
  const [cockpitData, setCockpitData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnergyData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/energy_cockpit?timerange=${timeRange}`);
        const data = await response.json();
        setCockpitData(data);
      } catch (err) {
        setError('Failed to fetch energy data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, [timeRange]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const EnergyTrendChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={cockpitData?.trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.7}/>
            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3],
          }}
        />
        <Legend />
        <Area type="monotone" dataKey="consumption" name="Consumption" stroke={theme.palette.primary.dark} strokeWidth={2} fill="url(#energyGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
      <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Energy Cockpit</Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, mt: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          <EnergyCockpitCard title="Real-time Fuel Consumption" value={cockpitData?.fuel_consumption?.currentRate} unit="tons/hour" status={cockpitData?.fuel_consumption?.trend} description={`Daily Average: ${cockpitData?.fuel_consumption?.dailyAverage} t/hr`} />
          <EnergyCockpitCard title="Energy Efficiency (SEC)" value={cockpitData?.energy_efficiency?.sec} unit="kWh/ton" status={cockpitData?.energy_efficiency?.trend} description={`Target: ${cockpitData?.energy_efficiency?.target} kWh/ton`} />
          <EnergyCockpitCard title="Cost Analysis" value={`${cockpitData?.cost_analysis?.estimatedDailyCost?.toLocaleString()}`} unit="/ day" description={`Savings Today: ${cockpitData?.cost_analysis?.savingsToday}`} />
          <EnergyCockpitCard title="Emissions Monitoring (CO2)" value={cockpitData?.emissions_monitoring?.currentCO2} unit="t/ton" status={cockpitData?.emissions_monitoring?.trend} description={`Limit: ${cockpitData?.emissions_monitoring?.limit} t/ton`} />
        </Box>

        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', minHeight: 450 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Energy Consumption Trend</Typography>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Time Range</InputLabel>
              <Select value={timeRange} label="Time Range" onChange={(e: any) => setTimeRange(e.target.value as string)}>
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            id="energy-chart-container"
            sx={{ flex: 1, cursor: 'pointer', minHeight: '350px' }}
            onClick={() => onChartClick(<EnergyTrendChart />, 'Energy Consumption Trend')}
          >
            <EnergyTrendChart />
          </Box>
        </Paper>
      </Box>
      </Box>

    </motion.div>
  );
};

export default EnergyCockpit;