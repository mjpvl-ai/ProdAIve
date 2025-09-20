import React, { useState, useEffect, ReactNode } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import EnergyCockpitCard from './EnergyCockpitCard';

interface EnergyDataPoint {
  name: string;
  consumption: number;
}

interface EnergyData {
  '24hours': EnergyDataPoint[];
  '7days': EnergyDataPoint[];
  '30days': EnergyDataPoint[];
}

interface EnergyCockpitProps {
  onChartClick: (element: ReactNode, title: string) => void;
}

const EnergyCockpit: React.FC<EnergyCockpitProps> = ({ onChartClick }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7days');
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnergyData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        const response = await new Promise<EnergyData>((resolve) => {
          setTimeout(() => {
            const mockData: EnergyData = {
              '24hours': [
                { name: '00:00', consumption: 100 },
                { name: '04:00', consumption: 120 },
                { name: '08:00', consumption: 110 },
                { name: '12:00', consumption: 130 },
                { name: '16:00', consumption: 125 },
                { name: '20:00', consumption: 140 },
              ],
              '7days': [
                { name: 'Day 1', consumption: 4000 },
                { name: 'Day 2', consumption: 3000 },
                { name: 'Day 3', consumption: 2000 },
                { name: 'Day 4', consumption: 2780 },
                { name: 'Day 5', consumption: 1890 },
                { name: 'Day 6', consumption: 2390 },
                { name: 'Day 7', consumption: 3490 },
              ],
              '30days': [
                { name: 'Week 1', consumption: 28000 },
                { name: 'Week 2', consumption: 25000 },
                { name: 'Week 3', consumption: 22000 },
                { name: 'Week 4', consumption: 26000 },
              ],
            };
            resolve(mockData);
          }, 500);
        });
        setEnergyData(response);
      } catch (err) {
        setError('Failed to fetch energy data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, [timeRange]);

  const fuelConsumption = {
    currentRate: 82,
    trend: 'down' as 'down' | 'up' | 'stable',
    dailyAverage: 85,
  };

  const energyEfficiency = {
    sec: 850,
    target: 800,
    deviation: '+50',
    trend: 'up' as 'down' | 'up' | 'stable',
  };

  const costAnalysis = {
    estimatedDailyCost: 15000,
    savingsToday: 500,
  };

  const emissionsMonitoring = {
    currentCO2: 0.6,
    limit: 0.7,
    trend: 'stable' as 'down' | 'up' | 'stable',
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const EnergyTrendChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}
      {error && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Alert severity="error">{error}</Alert></Box>}
      {!loading && !error && energyData && (
        <AreaChart data={energyData[timeRange as keyof typeof energyData]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
      )}
    </ResponsiveContainer>
  );

  return (
    <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
      <Box sx={{ py: 3, px: 0.75 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Energy Cockpit</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mt: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
          <EnergyCockpitCard title="Real-time Fuel Consumption" value={fuelConsumption.currentRate} unit="tons/hour" status={fuelConsumption.trend} description={`Daily Average: ${fuelConsumption.dailyAverage} t/hr`} />
          <EnergyCockpitCard title="Energy Efficiency (SEC)" value={energyEfficiency.sec} unit="kWh/ton" status={energyEfficiency.trend} description={`Target: ${energyEfficiency.target} kWh/ton`} />
          <EnergyCockpitCard title="Cost Analysis" value={`${costAnalysis.estimatedDailyCost.toLocaleString()}`} unit="/ day" description={`Savings Today: ${costAnalysis.savingsToday}`} />
          <EnergyCockpitCard title="Emissions Monitoring (CO2)" value={emissionsMonitoring.currentCO2} unit="t/ton" status={emissionsMonitoring.trend} description={`Limit: ${emissionsMonitoring.limit} t/ton`} />
        </Box>

        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Energy Consumption Trend</Typography>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Time Range</InputLabel>
              <Select value={timeRange} label="Time Range" onChange={(e: any) => setTimeRange(e.target.value as string)}>
                <MenuItem value={"24hours"}>Last 24 Hours</MenuItem>
                <MenuItem value={"7days"}>Last 7 Days</MenuItem>
                <MenuItem value={"30days"}>Last 30 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            id="energy-chart-container"
            sx={{ flex: 1, cursor: 'pointer' }}
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