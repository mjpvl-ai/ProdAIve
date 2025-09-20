import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogContent, IconButton, Toolbar, AppBar, useTheme, useMediaQuery, } from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  WarningAmber as WarningAmberIcon,
  ErrorOutline as ErrorOutlineIcon,
  Whatshot as WhatshotIcon,
  HighQuality as HighQualityIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Thermostat as ThermostatIcon,
  Bolt as BoltIcon,
  OnlinePrediction as OnlinePredictionIcon,
  SmartToy as SmartToyIcon,
  Settings as SettingsIcon,
  AccountTree as AccountTreeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

import HeaderBar from './components/HeaderBar';
import GeminiAIAssistant from './components/GeminiAIAssistant';
import { Overview } from './components/Overview';
import KilnHealthOverview from './components/KilnHealthOverview';
import EnergyCockpit from './components/EnergyCockpit';
import PredictiveQualityDashboard from './components/PredictiveQualityDashboard';
import Settings from './components/Settings';
import AIAgentActions from './components/AIAgentActions';
import FlowDisplay from './components/FlowDisplay';
const AI_ASSISTANT_WIDTH = 350;

interface Alert {
  message: string;
}

// Mock data for the overview chart

const menuItems = [
  { text: 'Overview', icon: <DashboardIcon />, view: 'Overview' },
  { text: 'Kiln Health', icon: <ThermostatIcon />, view: 'Kiln Health' },
  { text: 'Energy Cockpit', icon: <BoltIcon />, view: 'Energy Cockpit' },
  { text: 'Predictive Quality', icon: <OnlinePredictionIcon />, view: 'Predictive Quality' },
  { text: 'AI Agent Actions', icon: <SmartToyIcon />, view: 'AI Agent Actions' },
  { text: 'Process Flow', icon: <AccountTreeIcon />, view: 'Process Flow' },
  { text: 'Settings', icon: <SettingsIcon />, view: 'Settings' },
];

const Main = styled('main')(({ theme }) => ({
  boxSizing: 'border-box', // Ensure padding doesn't add to the width
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '64px', // For the HeaderBar
  width: '100%', // Occupy full width
}));

const App: React.FC = () => {
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false);
  const [assistantPosition, setAssistantPosition] = useState({
    width: AI_ASSISTANT_WIDTH, // Keep width for resizing logic if any
  });

  const [aiAssistantFullScreen, setAIAssistantFullScreen] = useState(false);
  const [currentView, setCurrentView] = useState('Overview');
  const [alertingNodeId, setAlertingNodeId] = useState<string | null>(null);
  const [fullscreenContent, setFullscreenContent] = useState<{ element: React.ReactNode, title: string } | null>(null);
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);

  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg')); // 'lg' is 1200px by default

  const handleAIAssistantToggle = () => setAIAssistantOpen(!aiAssistantOpen);

  useEffect(() => {
    // Simulate an alert after 5 seconds
    const timer = setTimeout(() => {
      const nodeId = '5'; // Corresponds to "Kiln Burning"
      setAlertingNodeId(nodeId);
      setActiveAlert({ message: 'High temperature spike detected in Kiln! Recommend reducing fuel rate.' });
      setAIAssistantOpen(true);
      // Switch to the Process Flow view to show the alert's origin
      setCurrentView('Process Flow');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);



  const handleAIAssistantFullscreenToggle = () => setAIAssistantFullScreen(!aiAssistantFullScreen);
  const handleChartClick = (element: React.ReactNode, title: string) => {
    setFullscreenContent({ element, title });
  };
  const handleCloseFullscreen = () => {
    setFullscreenContent(null);
  };
  const handleViewSelect = (view: string) => {
    setCurrentView(view);
  };


  const renderView = () => {
    switch (currentView) {
      case 'Overview':
        return <Overview onChartClick={handleChartClick} alertingNodeId={alertingNodeId} />;
      case 'Kiln Health':
        return <KilnHealthOverview onChartClick={handleChartClick} />;
      case 'Energy Cockpit':
        return <EnergyCockpit onChartClick={handleChartClick} />;
      case 'Predictive Quality':
        return <PredictiveQualityDashboard onChartClick={handleChartClick} />;
      case 'AI Agent Actions':
        return <AIAgentActions />;
      case 'Process Flow':
        return <FlowDisplay alertingNodeId={alertingNodeId} />;
      case 'Settings':
        return <Settings />; 
      default:
        return <Overview onChartClick={handleChartClick} alertingNodeId={alertingNodeId} />;
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <HeaderBar
          aiAssistantOpen={aiAssistantOpen}
          onAIAssistantToggle={handleAIAssistantToggle}
          onAIAssistantFullscreenToggle={handleAIAssistantFullscreenToggle}
          currentView={currentView}
          onSelectView={handleViewSelect}
          menuItems={menuItems}
        />
        <Main>
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
              top: aiAssistantFullScreen ? 0 : 64, // Align with header
              right: aiAssistantFullScreen ? 0 : 0, // Dock to the right
              height: aiAssistantFullScreen ? '100vh' : 'calc(100vh - 64px)', // Fill available height
              width: aiAssistantFullScreen ? '100vw' : assistantPosition.width,
              borderLeft: `1px solid ${theme.palette.divider}`,
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
              alert={activeAlert}
              onSelectView={handleViewSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog fullScreen open={!!fullscreenContent} onClose={handleCloseFullscreen}>
        <AppBar sx={{ position: 'relative', bgcolor: 'background.paper', color: 'text.primary' }}>
          <Toolbar>
            <Box sx={{ ml: 2, flex: 1 }} component="div" color="inherit">
              {fullscreenContent?.title}
            </Box>
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