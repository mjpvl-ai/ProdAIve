import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Avatar, Dialog, DialogContent, IconButton, Toolbar, AppBar, useTheme, useMediaQuery } from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  WarningAmber as WarningAmberIcon,
  ErrorOutline as ErrorOutlineIcon,
  Bolt as BoltIcon,
  Whatshot as WhatshotIcon,
  HighQuality as HighQualityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

import HeaderBar from './components/HeaderBar';
import Sidebar from './components/Sidebar';
import GeminiAIAssistant from './components/GeminiAIAssistant';
import KilnHealthOverview from './components/KilnHealthOverview';
import EnergyCockpit from './components/EnergyCockpit';
import PredictiveQualityDashboard from './components/PredictiveQualityDashboard';
import FlowDisplay from './components/FlowDisplay';
import Settings from './components/Settings';
import AIAgentActions from './components/AIAgentActions';

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 60; // Width for collapsed sidebar icons
const AI_ASSISTANT_WIDTH = 350;

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
const Overview: React.FC<{ onChartClick: (chart: React.ReactNode, title: string) => void }> = ({ onChartClick }) => (
  <Box>
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
    </Grid>
  </Box>
);

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'aiAssistantOpen' })<{
  open?: boolean;
  aiAssistantOpen?: boolean;
}>(({ theme, open, aiAssistantOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  marginTop: '64px', // For the HeaderBar
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${DRAWER_WIDTH}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false);
  const [assistantPosition, setAssistantPosition] = useState({
    width: AI_ASSISTANT_WIDTH,
    height: window.innerHeight * 0.8,
    top: 64, // Start below the header
    left: window.innerWidth - AI_ASSISTANT_WIDTH - 20,
  });
  const [aiAssistantFullScreen, setAIAssistantFullScreen] = useState(false);
  const [currentView, setCurrentView] = useState('Overview');
  const [alertingNodeId, setAlertingNodeId] = useState<string | null>(null);
  const [fullscreenContent, setFullscreenContent] = useState<{ element: React.ReactNode, title: string } | null>(null);

  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg')); // 'lg' is 1200px by default

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAIAssistantToggle = () => setAIAssistantOpen(!aiAssistantOpen);
  const handleAIAssistantFullscreenToggle = () => setAIAssistantFullScreen(!aiAssistantFullScreen);
  const handleChartClick = (element: React.ReactNode, title: string) => {
    setFullscreenContent({ element, title });
  };
  const handleCloseFullscreen = () => {
    setFullscreenContent(null);
  };
  const handleViewSelect = (view: string) => {
    setCurrentView(view);
    if (!isLgUp) setSidebarOpen(false); // Close temporary drawer on selection
  };


  const renderView = () => {
    switch (currentView) {
      case 'Overview':
        return <Overview onChartClick={handleChartClick} />;
      case 'Kiln Health':
        return <KilnHealthOverview onChartClick={handleChartClick} />;
      case 'Energy Cockpit':
        return <EnergyCockpit onChartClick={handleChartClick} />;
      case 'Predictive Quality':
        return <PredictiveQualityDashboard onChartClick={handleChartClick} />;
      case 'Realtime Flow':
        return <FlowDisplay alertingNodeId={alertingNodeId} />;
      case 'AI Agent Actions':
        return <AIAgentActions />;
      case 'Settings':
        return <Settings />;
      default:
        return <Overview onChartClick={handleChartClick} />;
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <HeaderBar
          sidebarOpen={sidebarOpen}
          aiAssistantOpen={aiAssistantOpen}
          onSidebarToggle={handleSidebarToggle}
          onAIAssistantToggle={handleAIAssistantToggle}
          onAIAssistantFullscreenToggle={handleAIAssistantFullscreenToggle}
          currentView={currentView}
        />
        <Sidebar
          open={sidebarOpen}
          variant={isLgUp ? 'permanent' : 'temporary'}
          currentView={currentView}
          onSelectView={handleViewSelect}
          onClose={handleSidebarToggle}
        />
        <Main
          sx={{
            ml: isLgUp ? (sidebarOpen ? `${DRAWER_WIDTH}px` : `${COLLAPSED_DRAWER_WIDTH}px`) : 0,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%' }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </Main>
      </Box>
      <AnimatePresence>
        {aiAssistantOpen && (
          <motion.div
            style={{
              position: 'fixed',
              top: aiAssistantFullScreen ? 0 : assistantPosition.top,
              left: aiAssistantFullScreen ? 0 : assistantPosition.left,
              height: aiAssistantFullScreen ? '100vh' : assistantPosition.height,
              width: aiAssistantFullScreen ? '100vw' : assistantPosition.width,
              zIndex: theme.zIndex.drawer + 2, // Ensure it's above the header
            }}
            initial={aiAssistantFullScreen ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={aiAssistantFullScreen ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={aiAssistantFullScreen ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={aiAssistantFullScreen ? { duration: 0.3 } : { type: 'spring', stiffness: 300, damping: 30 }}
          >
            <GeminiAIAssistant
              position={assistantPosition}
              onPositionChange={setAssistantPosition}
              onTriggerAlert={setAlertingNodeId}
              isFullScreen={aiAssistantFullScreen}
              onToggleFullScreen={handleAIAssistantFullscreenToggle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog fullScreen open={!!fullscreenContent} onClose={handleCloseFullscreen}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {fullscreenContent?.title}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseFullscreen} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
          {fullscreenContent?.element}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default App;