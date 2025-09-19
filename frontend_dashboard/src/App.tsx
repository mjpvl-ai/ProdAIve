import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { theme } from './theme';
import Sidebar from './components/Sidebar';
import GeminiAIAssistant from './components/GeminiAIAssistant';
import HeaderBar from './components/HeaderBar';
import EnergyCockpit from './components/EnergyCockpit';
import KilnHealthOverview from './components/KilnHealthOverview';
import PredictiveQualityDashboard from './components/PredictiveQualityDashboard';
import { Typography, Paper } from '@mui/material';
import FlowDisplay from './components/FlowDisplay'; // Import the new FlowDisplay component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const drawerWidth = 240;
const aiAssistantWidth = 300;

// Dummy data for the chart
const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

// --- Placeholder Components for other dashboards ---
const OverviewDashboard: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
      Overall Dashboard Overview
    </Typography>
    <Typography variant="body1" paragraph>
      Welcome to your comprehensive dashboard. Here you can find a summary of key metrics and operational statuses across your systems.
    </Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mt: 4 }}>
      <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary">Total Operations</Typography>
        <Typography variant="h3">1,234</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="secondary">Active Processes</Typography>
        <Typography variant="h3">45</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Alerts</Typography>
        <Typography variant="h3">3</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="success">Health Score</Typography>
        <Typography variant="h3">98%</Typography>
      </Paper>
    </Box>

    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Monthly Performance
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  </Box>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(true);
  const [currentView, setCurrentView] = useState<string>('Realtime Flow'); // Set initial view to Realtime Flow

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAIAssistantToggle = () => {
    setAiAssistantOpen(!aiAssistantOpen);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return <OverviewDashboard />;
      case 'Energy Cockpit':
        return <EnergyCockpit />;
      case 'Kiln Health':
        return <KilnHealthOverview />;
      case 'Predictive Quality':
        return <PredictiveQualityDashboard />;
      case 'Realtime Flow': // New case for FlowDisplay
        return <FlowDisplay />;
      case 'AI Assistant':
        return <GeminiAIAssistant />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <HeaderBar
          onSidebarToggle={handleSidebarToggle}
          onAIAssistantToggle={handleAIAssistantToggle}
          sidebarOpen={sidebarOpen}
          aiAssistantOpen={aiAssistantOpen}
          currentView={currentView}
        />
        <Sidebar open={sidebarOpen} onSelectView={handleViewChange} currentView={currentView} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 3 },
            mt: '64px', // Offset for AppBar height
            ml: sidebarOpen ? `${drawerWidth}px` : '0px',
            mr: aiAssistantOpen ? `${aiAssistantWidth}px` : '0px',
            width: {
              sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px - ${aiAssistantOpen ? aiAssistantWidth : 0}px)`,
            },
            overflowY: 'auto',
            transition: (theme) =>
              theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          {renderMainContent()}
        </Box>
        <Box
          component="aside"
          sx={{
            width: aiAssistantOpen ? aiAssistantWidth : 0,
            flexShrink: 0,
            borderLeft: aiAssistantOpen ? '1px solid #e0e0e0' : 'none',
            height: '100vh',
            position: 'fixed',
            right: 0,
            top: 0,
            overflowY: 'auto',
            bgcolor: 'background.paper',
            transition: (theme) =>
              theme.transitions.create(['width', 'border-left'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          <GeminiAIAssistant />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;