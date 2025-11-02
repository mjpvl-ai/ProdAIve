import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogContent, IconButton, Toolbar, AppBar, useTheme, useMediaQuery, } from '@mui/material';
import {
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
import { Overview } from './components/Overview';
import KilnHealthOverview from './components/KilnHealthOverview';
import EnergyCockpit from './components/EnergyCockpit';
import PredictiveQualityDashboard from './components/PredictiveQualityDashboard';
import Settings from './components/Settings';
import AIAgentActions from './components/AIAgentActions';
import FlowDisplay from './components/FlowDisplay';

import GeminiAIAssistant from './components/GeminiAIAssistant';
const AI_ASSISTANT_WIDTH = 350;

interface Alert {
  message: string;
}

export interface Position {
  width: number;
  height: number;
  top: number;
  left: number;
}

// Mock data for the overview chart

import VarianceAnalysis from './components/VarianceAnalysis';

const menuItems = [
  { text: 'Overview', icon: <DashboardIcon />, view: 'Overview' },
  { text: 'Kiln Health', icon: <ThermostatIcon />, view: 'Kiln Health' },
  { text: 'Energy Cockpit', icon: <BoltIcon />, view: 'Energy Cockpit' },
  { text: 'Predictive Quality', icon: <OnlinePredictionIcon />, view: 'Predictive Quality' },
  { text: 'Variance Analysis', icon: <AccountTreeIcon />, view: 'Variance Analysis' },
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
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  }
}));

const App: React.FC = () => {
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false);
  const [assistantPosition, setAssistantPosition] = useState<Position>(() => {
    const initialHeight = window.innerHeight - 64; // Assuming header height is 64px
    const initialLeft = window.innerWidth - AI_ASSISTANT_WIDTH; // Docked to right
    return {
      width: AI_ASSISTANT_WIDTH,
      height: initialHeight,
      top: 64,
      left: initialLeft,
    };
  });

  const [aiAssistantFullScreen, setAIAssistantFullScreen] = useState(false);
  const [currentView, setCurrentView] = useState('Overview');
  const [alertingNodeId, setAlertingNodeId] = useState<string | null>(null);
  const [fullscreenContent, setFullscreenContent] = useState<{ element: React.ReactNode, title: string } | null>(null);
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const updatedMenuItems = menuItems;

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



  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
      case 'Variance Analysis':
        return <VarianceAnalysis />;
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
          menuItems={updatedMenuItems}
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

        <AnimatePresence>
          {aiAssistantOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: 64, // Below HeaderBar
                right: 0,
                width: aiAssistantFullScreen || isMobile ? '100vw' : AI_ASSISTANT_WIDTH,
                height: aiAssistantFullScreen ? 'calc(100vh - 64px)' : 'calc(100vh - 64px - 2 * 16px)', // Full height minus HeaderBar and some padding
                maxHeight: 'calc(100vh - 64px)',
                zIndex: 1250, // Above other content
                boxShadow: theme.shadows[10],
                borderRadius: '12px 0 0 12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.default,
              }}
            >
              <GeminiAIAssistant
                isFullScreen={aiAssistantFullScreen}
                onToggleFullScreen={handleAIAssistantFullscreenToggle}
                alert={activeAlert}
                onSelectView={handleViewSelect}
                onTriggerAlert={setAlertingNodeId}
                position={assistantPosition}
                onPositionChange={setAssistantPosition}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

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